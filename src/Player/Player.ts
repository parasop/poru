import { Poru, ResolveOptions, EventData, ConnectionOptions } from "../Poru"
import { Node } from "../Node/Node"
import { Track } from "../guild/Track"
import { Connection } from "./Connection"
import Queue from "../guild/Queue"
import { EventEmitter } from "events"
import { Filters } from "./Filters"
import { Response, LoadTrackResponse } from "../guild/Response"

type Loop = "NONE" | "TRACK" | "QUEUE"

const escapeRegExp = (str: string) => {
  try {
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  } catch { }
}

/**
 * Represents a player capable of playing audio tracks.
 * @extends EventEmitter
 */
export class Player extends EventEmitter {
  public readonly data: Record<string, unknown>
  /** The Poru instance associated with the player. */
  public poru: Poru
  /** The node associated with the player. */
  public node: Node
  /** The connection associated with the player. */
  public connection: Connection
  /** The queue of tracks for the player. */
  public queue: Queue
  /** Filters applied to the player's audio. */
  public filters: Filters
  /** The guild ID associated with the player. */
  public guildId: string
  /** The guild ID associated with the player. */
  public voiceChannel: string
  /** The text channel ID associated with the player. */
  public textChannel: string
  /** The currently playing track */
  public currentTrack: Track
  /** The previously played track */
  public previousTrack: Track
  /** Indicates whether the player is currently playing a track. */
  public isPlaying: boolean
  /** Indicates whether the player is connected to a voice channel. */
  public isPaused: boolean
  /** Indicates whether the player is connected to a voice channel. */
  public isConnected: boolean
  /** Indicated whether autoplay mode is enabled. */
  public isAutoPlay: boolean // Is this even used?
  /** Indicated whether quiet mode is enabled for the player.  */
  public isQuietMode: boolean // Is this even used?
  /** The loop settings for the player. */
  public loop: Loop
  /** The current position of the player in the track (in milliseconds) */
  public position: number
  /** The current delay estimate of the player (in milliseconds) */
  public ping: number
  /** The timestamp of the player's state */
  public timestamp: number
  /** Indicates whether the player is set to be muted. */
  public mute: boolean
  /** Indicated whether the player is set to be deafened */
  public deaf: boolean
  /** The volume of the player (0-1000) */
  public volume: number

  constructor(poru: Poru, node: Node, options: ConnectionOptions) {
    super()
    this.poru = poru
    this.node = node
    this.queue = new Queue()
    this.connection = new Connection(this)
    this.guildId = options.guildId
    this.filters = this.poru.options.customFilter ? new this.poru.options.customFilter(this) : new Filters(this)
    this.voiceChannel = options.voiceChannel
    this.textChannel = options.textChannel
    this.currentTrack = null
    this.previousTrack = null
    this.deaf = options.deaf || false
    this.mute = options.mute || false
    this.volume = 100
    this.isPlaying = false
    this.isPaused = false
    this.position = 0
    this.ping = 0
    this.timestamp = null
    this.isConnected = false
    this.loop = "NONE"
    this.data = {}

    this.poru.emit("playerCreate", this)
    this.on("playerUpdate", (packet) => {
      (this.isConnected = packet.state.connected),
        (this.position = packet.state.position),
        (this.ping = packet.state.ping)
      this.timestamp = packet.state.time
      //this event will be useful for creating web player
      this.poru.emit("playerUpdate", this)
    })
    this.on("event", (data) => this.eventHandler(data))
  }

  /**
   * Initiates playback of the next track in the queue.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async play(): Promise<Player> {
    if (!this.queue.length) return
    this.currentTrack = this.queue.shift()
    if (!this.currentTrack.track)
      this.currentTrack = await this.resolveTrack(this.currentTrack)
    if (this.currentTrack.track) {
      await this.node.rest.updatePlayer({
        guildId: this.guildId,
        data: {
          track: { encoded: this.currentTrack?.track },
        },
      })
      this.isPlaying = true
      this.position = 0
    } else {
      //  return this.play();

      // Here joniii: What is that?
    };

    return this
  }

  /**
   * Resolves a track before playback.
   * @param {Track} track - The track to resolve.
   * @returns {Promise<Track>} - A Promise that resolves to the resolved track.
   * @private
   */
  private async resolveTrack(track: Track): Promise<Track> {
    const query = [track.info?.author, track.info?.title]
      .filter((x) => !!x)
      .join(" - ")
    const result = await this.resolve({ query, source: this.poru.options?.defaultPlatform || "ytsearch", requester: track.info?.requester })
    if (!result || !result.tracks.length) return

    if (track.info?.author) {
      const author = [track.info.author, `${track.info.author} - Topic`]
      const officialAudio = result.tracks.find(
        (track) =>
          author.some((name) =>
            new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)
          ) ||
          new RegExp(`^${escapeRegExp(track.info.title)}$`, "i").test(
            track.info.title
          )
      )
      if (officialAudio) {
        //track.info.identifier = officialAudio.info.identifier;
        track.track = officialAudio.track
        return track
      }
    }
    if (track.info.length) {
      const sameDuration = result.tracks.find(
        (track) =>
          track.info.length >= (track.info.length ? track.info.length : 0) - 2000 &&
          track.info.length <= (track.info.length ? track.info.length : 0) + 2000
      )
      if (sameDuration) {
        //track.info.identifier = sameDuration.info.identifier;
        track.track = sameDuration.track
        return track
      }
    }
    track.info.identifier = result.tracks[0].info.identifier
    return track
  }

  /**
   * Connects the player to a voice channel.
   * @param {ConnectionOptions} [options=this] - The options for the connection.
   */
  public connect(options: ConnectionOptions = this): void {
    let { guildId, voiceChannel, deaf, mute } = options
    this.send({
      guild_id: guildId,
      channel_id: voiceChannel,
      self_deaf: deaf || false,
      self_mute: mute || false,
    })
    this.isConnected = true
    this.poru.emit(
      "debug",
      this.guildId,
      `[Poru Player] Player has been connected`
    )
  }

  /**
   * Skips the current track.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async skip(): Promise<Player> {
    await this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: { track: { encoded: null } },
    })
    this.position = 0
    this.isPlaying = false

    return this
  }

  /**
   * Pauses or resumes playback.
   * @param {boolean} [toggle=true] - Specifies whether to pause or resume playback.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async pause(toggle: boolean = true): Promise<Player> {
    await this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: { paused: toggle },
    })
    this.isPlaying = !toggle
    this.isPaused = toggle

    return this
  }

  /**
   * Seeks to a specific position in the current track.
   * @param {number} position - The position to seek to (in milliseconds).
   */
  public async seekTo(position: number) {
    if (this.position + position >= this.currentTrack.info.length)
      position = this.currentTrack.info.length
    await this.node.rest.updatePlayer({ guildId: this.guildId, data: { position } })
  }

  /**
   * Sets the volume level of the player.
   * @param {number} volume - The volume level (0 to 1000).
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async setVolume(volume: number): Promise<Player> {
    if (volume < 0 || volume > 1000)
      throw new Error("[Poru Exception] Volume must be between 0 to 1000")
    await this.node.rest.updatePlayer({ guildId: this.guildId, data: { volume } })
    this.volume = volume
    return this
  }

  /**
   * Sets the loop mode of the player.
   * @param {Loop} mode - The loop mode to set.
   * @returns {Player} - The Player instance.
   */
  public setLoop(mode: Loop): this {
    if (!mode)
      throw new Error(
        `[Poru Player] You must have to provide loop mode as argument of setLoop`
      )

    if (!["NONE", "TRACK", "QUEUE"].includes(mode))
      throw new Error(
        `[Poru Player] setLoop arguments are NONE,TRACK AND QUEUE`
      )

    switch (mode) {
      case "NONE": {
        this.loop = "NONE"
        break
      }
      case "TRACK": {
        this.loop = "TRACK"
        break
      }
      case "QUEUE": {
        this.loop = "QUEUE"
        break
      }
      default: {
        this.loop = "NONE"
      }
    }

    return this
  }

  /**
   * Sets the text channel associated with the player.
   * @param {string} channel - The ID of the text channel.
   * @returns {Player} - The Player instance.
   */
  public setTextChannel(channel: string): this {
    this.textChannel = channel
    return this
  }

  /**
   * Sets the voice channel associated with the player.
   * @param {string} channel - The ID of the voice channel.
   * @param {ConnectionOptions} [options] - The options for the connection.
   * @returns {Player} - The Player instance.
   */
  public setVoiceChannel(
    channel: string,
    options?: Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>
  ): this {
    if (this.isConnected && channel == this.voiceChannel)
      throw new ReferenceError(`Player is already connected to ${channel}`)

    this.voiceChannel = channel

    if (options) {
      this.mute = options.mute ?? this.mute ?? false
      this.deaf = options.deaf ?? this.deaf ?? false
    }

    this.connect({
      deaf: this.deaf,
      guildId: this.guildId,
      voiceChannel: this.voiceChannel,
      textChannel: this.textChannel,
      mute: this.mute,
    })

    return this
  }

  /**
   * Sets a custom data value associated with the player.
   * @param {string} key - The key for the data value.
   * @param {K} value - The value to set.
   * @returns {K} - The set value.
   */
  public set<K>(key: string, value: K): K {
    return (this.data[key] = value) as K
  }

  /**
   * Retrieves a custom data value associated with the player.
   * @param {string} key - The key for the data value.
   * @returns {K} - The retrieved value.
   */
  public get<K>(key: string): K {
    return this.data[key] as K
  }

  /**
   * Disconnects the player from the voice channel.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async disconnect(): Promise<Player> {
    if (!this.voiceChannel) return
    await this.pause(true)
    this.isConnected = false
    this.send({
      guild_id: this.guildId,
      channel_id: null,
      self_mute: false,
      self_deaf: false,
    })
    this.voiceChannel = null
    return this
  }

  /**
   * Destroys the player and cleans up associated resources.
   * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating the success of destruction.
   */
  public async destroy(): Promise<boolean> {
    await this.disconnect()
    await this.node.rest.destroyPlayer(this.guildId)
    this.poru.emit("debug", this.guildId, `[Poru Player] destroyed the player`)
    this.poru.emit("playerDestroy", this)
    return this.poru.players.delete(this.guildId)
  };

  /**
   * Restarts playback from the current track.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async restart(): Promise<Player> {
    if (!this.currentTrack.track && !this.queue.length) return
    if (!this.currentTrack.track) return await this.play()

    await this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: {
        position: this.position,
        track: this.currentTrack,
      },
    })

    return this
  };

  /**
   * Moves the player to a different node.
   * @param {string} name - The name of the target node.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async moveNode(name: string) {
    const node = this.poru.nodes.get(name)

    if (!node || node.name === this.node.name) return
    if (!node.isConnected)
      throw new Error("Provided Node is not connected")

    try {
      await this.node.rest.destroyPlayer(this.guildId)
      this.poru.players.delete(this.guildId)
      this.node = node
      this.poru.players.set(this.guildId, this)
      return await this.restart()
    } catch (e) {
      await this.destroy()
      throw e
    }
  };

  /**
   * Automatically moves the player to a less used node.
   * @returns {Promise<Player | void>} - A Promise that resolves to the Player instance or void.
   */
  public async autoMoveNode(): Promise<Player | void> {
    if (this.poru.leastUsedNodes.length === 0)
      throw new Error("[Poru Error] No nodes are avaliable")

    const node = this.poru.nodes.get(this.poru.leastUsedNodes[0].name)
    if (!node) {
      await this.destroy()
      return
    };

    return await this.moveNode(node.name)
  };

  /**
   * Enables autoplay functionality for the player.
   * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
   */
  public async autoplay(): Promise<Player> {
    try {
      const data = `https://www.youtube.com/watch?v=${this.previousTrack?.info?.identifier || this.currentTrack?.info?.identifier
        }&list=RD${this.previousTrack.info.identifier || this.currentTrack.info.identifier}`

      const response = await this.poru.resolve({
        query: data,
        requester: this.previousTrack?.info?.requester ?? this.currentTrack?.info?.requester,
        source: this.previousTrack?.info?.sourceName ?? this.currentTrack?.info?.sourceName ?? this.poru.options?.defaultPlatform ?? "ytmsearch",
      })

      if (
        !response ||
        !response.tracks ||
        ["error", "empty"].includes(response.loadType)
      )
        return await this.skip()

      response.tracks.shift()

      const track = response.tracks[
        Math.floor(Math.random() * Math.floor(response.tracks.length))
      ]

      this.queue.push(track)
      await this.play()

      return this
    } catch (e) {
      return await this.skip()
    };
  };

  /**
   * Handles incoming events for the player.
   * @param {EventData} data - The event data.
   * @returns {Promise<Player | boolean | void>} - A Promise that resolves to the Player instance, a boolean, or void.
   */
  public async eventHandler(data: EventData): Promise<Player | boolean | void> {
    switch (data.type) {
      case "TrackStartEvent": {
        this.isPlaying = true
        this.poru.emit("trackStart", this, this.currentTrack)
        break
      }
      case "TrackEndEvent": {
        this.previousTrack = this.currentTrack
        if (this.loop === "TRACK") {
          this.queue.unshift(this.previousTrack)
          this.poru.emit("trackEnd", this, this.currentTrack, data)
          return await this.play()
        } else if (this.currentTrack && this.loop === "QUEUE") {
          this.queue.push(this.previousTrack)
          this.poru.emit("trackEnd", this, this.currentTrack, data)
          return await this.play()
        }

        if (this.queue.length === 0) {
          this.isPlaying = false
          return this.poru.emit("queueEnd", this)
        } else if (this.queue.length > 0) {
          this.poru.emit("trackEnd", this, this.currentTrack, data)
          return await this.play()
        }

        this.isPlaying = false
        this.poru.emit("queueEnd", this)
        break
      }

      case "TrackStuckEvent": {
        this.poru.emit("trackError", this, this.currentTrack, data)
        await this.skip()
        break
      }
      case "TrackExceptionEvent": {
        this.poru.emit("trackError", this, this.currentTrack, data)
        await this.skip()
        break
      }
      case "WebSocketClosedEvent": {
        if ([4015, 4009].includes(data.code)) {
          this.send({
            guild_id: data.guildId,
            channel_id: this.voiceChannel,
            self_mute: this.mute,
            self_deaf: this.deaf,
          })
        }
        this.poru.emit("socketClose", this, this.currentTrack, data)
        await this.pause(true)
        this.poru.emit(
          "debug",
          `Player -> ${this.guildId}`,
          "Player paused Cause Channel deleted Or Client was kicked"
        )
        break
      }
      default: {
        throw new Error(`An unknown event: ${data}`)
      }
    }
  };

  /**
   * Resolves a query to obtain audio tracks.
   * @param {ResolveOptions} options - The options for resolving the query.
   * @returns {Promise<Response>} - A Promise that resolves to a Response object containing the resolved tracks.
   */
  public async resolve({ query, source, requester }: ResolveOptions): Promise<Response> {
    const regex = /^https?:\/\//

    if (regex.test(query)) {
      const response = await this.node.rest.get<LoadTrackResponse>(
        `/v4/loadtracks?identifier=${encodeURIComponent(query)}`
      )
      return new Response(response, requester)
    } else {
      const track = `${source || "ytsearch"}:${query}`
      const response = await this.node.rest.get<LoadTrackResponse>(
        `/v4/loadtracks?identifier=${encodeURIComponent(track)}`
      )
      return new Response(response, requester)
    }
  };

  /**
   * Sends data to the Poru system.
   * @param {any} data - The data to send.
   */
  public send(data: any): void {
    this.poru.send({ op: 4, d: data })
  };
}