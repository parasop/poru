import { Poru, ResolveOptions } from "../Poru";
import { Node } from "../Node/Node";
import { Track, trackData } from "../guild/Track";
import { Connection } from "./Connection";
import Queue from "../guild/Queue";
import { EventEmitter } from "events";
import { Filters } from "./Filters";
import { Response } from "../guild/Response";
import { ConnectionOptions } from "../Poru";
type Loop = "NONE" | "TRACK" | "QUEUE";

export class Player extends EventEmitter {
  public readonly data: Record<string, unknown>;
  public poru: Poru;
  public node: Node;
  public connection: Connection;
  public queue: Queue;
  public filters: Filters;
  public guildId: string;
  public voiceChannel: string;
  public textChannel: string;
  public currentTrack: Track;
  public previousTrack: Track;
  public isPlaying: boolean;
  public isPaused: boolean;
  public isConnected: boolean;
  public loop: Loop;
  public position: number;
  public ping: number;
  public timestamp: number;
  public mute: boolean;
  public deaf: boolean;
  public volume: number;

  constructor(poru: Poru, node: Node, options) {
    super();
    this.poru = poru;
    this.node = node;
    this.queue = new Queue();
    this.connection = new Connection(this);
    this.guildId = options.guildId;
    this.filters = new Filters(this);
    this.voiceChannel = options.voiceChannel;
    this.textChannel = options.textChannel;
    this.currentTrack = null;
    this.previousTrack = null;
    this.deaf = options.deaf || false;
    this.mute = options.mute || false;
    this.volume = 100;
    this.isPlaying = false;
    this.isPaused = false;
    this.position = 0;
    this.ping = 0;
    this.timestamp = null;
    this.isConnected = false;
    this.loop = "NONE";
    this.data = {};

    this.on("playerUpdate", (packet) => {
      (this.isConnected = packet.state.connected),
        (this.position = packet.state.position),
        (this.ping = packet.state.ping);
      this.timestamp = packet.state.time;
      //this event will be useful for creating web player
      this.poru.emit("playerUpdate",this)
    });
    this.on("event", (data) => this.eventHandler(data));
  }

  public async play() {
    if (!this.queue.length) return;
    this.currentTrack = this.queue.shift();
    if (!this.currentTrack.track) this.currentTrack = await this.currentTrack.resolve(this.poru);
    if(this.currentTrack.track){
    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: {
        encodedTrack: this.currentTrack.track,
      },
    });
    this.isPlaying = true;
    this.position = 0;
  } else {
    return this.play();
  }
  }

  public connect(options: ConnectionOptions = this) {
    let { guildId, voiceChannel, deaf, mute } = options;
    this.send({
      guild_id: guildId,
      channel_id: voiceChannel,
      self_deaf: deaf || true,
      self_mute: mute || false,
    });

    this.isConnected = true;
    this.poru.emit(
      "debug",
      this.guildId,
      `[Poru Player] Player has been connected`
    );
  }

  public stop() {
    this.position = 0;
    this.isPlaying = false;
    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: { encodedTrack: null },
    });

    return this;
  }

  public pause(toggle: boolean = true) {
    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: { paused: toggle },
    });
    this.isPlaying = !toggle;
    this.isPaused = toggle;

    return this;
  }

  public seekTo(position: number): void {
    if (this.position + position >= this.currentTrack.info.length)
      position = this.currentTrack.info.length;
    this.node.rest.updatePlayer({ guildId: this.guildId, data: { position } });
  }

  public setVolume(volume: number) {
    if (volume < 0 || volume > 1000)
      throw new Error("[Poru Exception] Volume must be between 0 to 1000");
    this.node.rest.updatePlayer({ guildId: this.guildId, data: { volume } });
    this.volume = volume;
    return this;
  }

  public setLoop(mode: Loop) {
    if (!mode)
      throw new Error(
        `[Poru Player] You must have to provide loop mode as argument of setLoop`
      );

    if (!["NONE", "TRACK", "QUEUE"].includes(mode))
      throw new Error(
        `[Poru Player] setLoop arguments are NONE,TRACK AND QUEUE`
      );

    switch (mode) {
      case "NONE": {
        this.loop = "NONE";
        break;
      }
      case "TRACK": {
        this.loop = "TRACK";
        break;
      }
      case "QUEUE": {
        this.loop = "QUEUE";
        break;
      }
      default: {
        this.loop = "NONE";
      }
    }

    return this;
  }

  public setTextChannel(channel: string) {
    this.textChannel = channel;
    return this;
  }

  public setVoiceChannel(
    channel: string,
    options?: { mute: boolean; deaf: boolean }
  ) {
    if (this.isConnected && channel == this.voiceChannel)
      throw new ReferenceError(`Player is already connected to ${channel}`);

    this.voiceChannel = channel;

    if (options) {
      this.mute = options.mute ?? this.mute;
      this.deaf = options.deaf ?? this.deaf;
    }

    this.connect({
      deaf: this.deaf,
      guildId: this.guildId,
      voiceChannel: this.voiceChannel,
      textChannel: this.textChannel,
      mute: this.mute,
    });

    return this;
  }

  public set(key: string, value: unknown) {
    return (this.data[key] = value);
  }

  public get<K>(key: string): K {
    return this.data[key] as K;
  }

  public disconnect() {
    if (!this.voiceChannel) return;
    this.pause(true);
    this.isConnected = false;
    this.send({
      guild_id: this.guildId,
      channel_id: null,
      self_mute: false,
      self_deaf: false,
    });
    this.voiceChannel = null;
    return this;
  }

  public destroy() {
    this.disconnect();
    this.node.rest.destroyPlayer(this.guildId);
    this.poru.emit("debug", this.guildId, `[Poru Player] destroyed the player`);
    this.poru.emit("playerDestroy",this);
    this.poru.players.delete(this.guildId);
  }

  public restart() {
    if (!this.currentTrack.track && !this.queue.length) return;
    if (!this.currentTrack.track) return this.play();

    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: {
        position: this.position,
        encodedTrack: this.currentTrack.track,
      },
    });
  }
  public moveNode(name: string) {
    let node = this.poru.nodes.get(name);

    if (!node || node.name === this.node.name) return;
    if (!node.isConnected)
      throw new Error("Provided Node not is not connected");

    try {
      this.node.rest.destroyPlayer(this.guildId);
      this.poru.players.delete(this.guildId);
      this.node = node;
      this.poru.players.set(this.guildId, this);
      this.restart();
    } catch (e) {
      this.destroy();
      throw e;
    }
  }

  public async AutoMoveNode(): Promise<void> {
    if (this.poru.leastUsedNodes.length === 0)
      throw new Error("[Poru Error] No nodes are avaliable");

    const node = this.poru.nodes.get(this.poru.leastUsedNodes[0].name);
    if (!node) return await this.destroy();
    await this.moveNode(node.name);
  }

  async autoplay(requester) {
    try {
      let data = `https://www.youtube.com/watch?v=${this.previousTrack.info.identifier || this.currentTrack.info.identifier
        }&list=RD${this.previousTrack.info.identifier || this.currentTrack.info.identifier
        }`;

      let response = await this.poru.resolve({query:data,requester,source:   this.poru.options.defaultPlatform || "ytmsearch"});
      if (!response ||!response.tracks ||["LOAD_FAILED", "NO_MATCHES"].includes(response.loadType)) return this.stop();
      let track =response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))];
      this.queue.push(track);
   //   this.play();

      return this.play();

    } catch (e) {
       return this.stop();
    }
  }










  public eventHandler(data) {
    switch (data.type) {
      case "TrackStartEvent": {
        this.isPlaying = true;
        this.poru.emit("trackStart", this, this.currentTrack);
        break;
      }
      case "TrackEndEvent": {
        this.previousTrack = this.currentTrack;
        if (this.loop === "TRACK") {
          this.queue.unshift(this.previousTrack);
          this.poru.emit("trackEnd", this, this.currentTrack);
          return this.play();
        } else if (this.currentTrack && this.loop === "QUEUE") {
          this.queue.push(this.previousTrack);
          this.poru.emit("trackEnd", this, this.currentTrack, data);
          return this.play();
        }

        if (this.queue.length === 0) {
          this.isPlaying = false;
          return this.poru.emit("queueEnd", this);
        } else if (this.queue.length > 0) {
          this.poru.emit("trackEnd", this, this.currentTrack);
          return this.play();
        }

        this.isPlaying = false;
        this.poru.emit("queueEnd", this);
        break;
      }

      case "TrackStuckEvent": {
        this.poru.emit("trackError", this, this.currentTrack, data);
        this.stop();
        break;
      }
      case "TrackExceptionEvent": {
        this.poru.emit("trackError", this, this.currentTrack, data);
        this.stop();
        break;
      }
      case "WebSocketClosedEvent": {
        if ([4015, 4009].includes(data.code)) {
          this.send({
            guild_id: data.guildId,
            channel_id: this.voiceChannel,
            self_mute: this.mute,
            self_deaf: this.deaf,
          });
        }
        this.poru.emit("socketClose", this, this.currentTrack, data);
        this.pause(true);
        this.poru.emit(
          "debug",
          `Player -> ${this.guildId}`,
          "Player paused Cause Channel deleted Or Client was kicked"
        );
        break;
      }
      default: {
        throw new Error(`An unknown event: ${data}`);
      }
    }
  }

  async resolve({ query, source, requester }: ResolveOptions) {
    const regex = /^https?:\/\//;

    if (regex.test(query)) {
      let response = await this.node.rest.get(
        `/v3/loadtracks?identifier=${encodeURIComponent(query)}`
      );
      return new Response(response, requester);
    } else {
      let track = `${source || "ytsearch"}:${query}`;
      let response = await this.node.rest.get(
        `/v3/loadtracks?identifier=${encodeURIComponent(track)}`
      );
      return new Response(response, requester);
    }
  }

  public send(data) {
    this.poru.send({ op: 4, d: data });
  }
}
