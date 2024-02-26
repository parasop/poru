import { Poru, ResolveOptions, EventData } from "../Poru";
import { Node } from "../Node/Node";
import { Track } from "../guild/Track";
import { Connection } from "./Connection";
import Queue from "../guild/Queue";
import { EventEmitter } from "events";
import { Filters } from "./Filters";
import { Response, LoadTrackResponse } from "../guild/Response";
import { ConnectionOptions } from "../Poru";
/**
 * The loop type
 * @typedef {string} Loop
 * @property {string} NONE - No loop
 */
type Loop = "NONE" | "TRACK" | "QUEUE";

const escapeRegExp = (str: string) => {
    try {
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    } catch { }
}

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
    public isAutoPlay: boolean;
    public isQuietMode: boolean;
    public loop: Loop;
    public position: number;
    public ping: number;
    public timestamp: number;
    public mute: boolean;
    public deaf: boolean;
    public volume: number;

    constructor(poru: Poru, node: Node, options: ConnectionOptions) {
        super();
        this.poru = poru;
        this.node = node;
        this.queue = new Queue();
        this.connection = new Connection(this);
        this.guildId = options.guildId;
        this.filters = this.poru.options.customFilter ? new this.poru.options.customFilter(this) : new Filters(this);
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

        this.poru.emit("playerCreate", this);
        this.on("playerUpdate", (packet) => {
            (this.isConnected = packet.state.connected),
                (this.position = packet.state.position),
                (this.ping = packet.state.ping);
            this.timestamp = packet.state.time;
            //this event will be useful for creating web player
            this.poru.emit("playerUpdate", this);
        });
        this.on("event", (data) => this.eventHandler(data));
    }

    /**
     * Play a track
     * @returns {Promise<Player>} The newly updated player whose playing the song
     */
    public async play(): Promise<Player> {
        if (!this.queue.length) return;
        this.currentTrack = this.queue.shift();
        if (!this.currentTrack.track)
            this.currentTrack = await this.resolveTrack(this.currentTrack);
        if (this.currentTrack.track) {
            await this.node.rest.updatePlayer({
                guildId: this.guildId,
                data: {
                    track: { encoded: this.currentTrack?.track },
                },
            });
            this.isPlaying = true;
            this.position = 0;
        } else {
            //  return this.play();

            // Here joniii: What is that?
        };

        return this;
    }

    /**
      * Resolve a track
      * @param {Track} track - Only for personal use
      * @returns {Promise<Track>} Returns a Track
      */
    private async resolveTrack(track: Track): Promise<Track> {
        const query = [track.info?.author, track.info?.title]
            .filter((x) => !!x)
            .join(" - ");
        const result = await this.resolve({ query, source: this.poru.options?.defaultPlatform || "ytsearch", requester: track.info?.requester });
        if (!result || !result.tracks.length) return;

        if (track.info?.author) {
            const author = [track.info.author, `${track.info.author} - Topic`];
            const officialAudio = result.tracks.find(
                (track) =>
                    author.some((name) =>
                        new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)
                    ) ||
                    new RegExp(`^${escapeRegExp(track.info.title)}$`, "i").test(
                        track.info.title
                    )
            );
            if (officialAudio) {
                //track.info.identifier = officialAudio.info.identifier;
                track.track = officialAudio.track;
                return track;
            }
        }
        if (track.info.length) {
            const sameDuration = result.tracks.find(
                (track) =>
                    track.info.length >= (track.info.length ? track.info.length : 0) - 2000 &&
                    track.info.length <= (track.info.length ? track.info.length : 0) + 2000
            );
            if (sameDuration) {
                //track.info.identifier = sameDuration.info.identifier;
                track.track = sameDuration.track;
                return track;
            }
        }
        track.info.identifier = result.tracks[0].info.identifier;
        return track;
    }

    /**
     * This function will make the bot connect to a voice channel.
     * @param {ConnectionOptions} options To connect to voice channel
     * @returns {void} void
     */
    public connect(options: ConnectionOptions = this): void {
        let { guildId, voiceChannel, deaf, mute } = options;
        this.send({
            guild_id: guildId,
            channel_id: voiceChannel,
            self_deaf: deaf || false,
            self_mute: mute || false,
        });
        this.isConnected = true;
        this.poru.emit(
            "debug",
            this.guildId,
            `[Poru Player] Player has been connected`
        );
    }

    /**
     * This function will stop the current song
     * @returns {Promise<Player>} Returns the player after stopping the song
     * 
     * You can use this function to also skip the current song
     */
    public async stop(): Promise<Player> {
        await this.node.rest.updatePlayer({
            guildId: this.guildId,
            data: { track: { encoded: null } },
        });
        this.position = 0;
        this.isPlaying = false;

        return this;
    }

    /**
     * 
     * @param {boolean} toggle Boolean to pause or resume the player || Default = true
     * @returns {Promise<Player>} To pause or resume the player
     */
    public async pause(toggle: boolean = true): Promise<Player> {
        await this.node.rest.updatePlayer({
            guildId: this.guildId,
            data: { paused: toggle },
        });
        this.isPlaying = !toggle;
        this.isPaused = toggle;

        return this;
    }

    /**
     * This function will seek to the specified position
     * @param {number} position Number to seek to the position
     * @returns {Promise<void>} void
     */
    public async seekTo(position: number): Promise<void> {
        if (this.position + position >= this.currentTrack.info.length)
            position = this.currentTrack.info.length;
        await this.node.rest.updatePlayer({ guildId: this.guildId, data: { position } });
    }

    /**
     * This function will set the volume to a specified number between 0 and 1000
     * @param volume Number to set the volume
     * @returns {Promise<Player>} The newly updated Player
     */
    public async setVolume(volume: number): Promise<Player> {
        if (volume < 0 || volume > 1000)
            throw new Error("[Poru Exception] Volume must be between 0 to 1000");
        await this.node.rest.updatePlayer({ guildId: this.guildId, data: { volume } });
        this.volume = volume;
        return this;
    }

    /**
     * This function will activate the loop mode. These are the options `NONE, TRACK, QUEUE`
     * @param {Loop} mode Loop mode
     * @returns {Player} Returns the newly updated Player
     */
    public setLoop(mode: Loop): Player {
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

    /**
     * This function will set the text channel in the player
     * @param {string} channel String to set the text channel
     * @returns {Player} Returns the newly updated Player
     */
    public setTextChannel(channel: string): Player {
        this.textChannel = channel;
        return this;
    }

    /**
     * This function will set the voice channel
     * @param {string} channel String to set the voice channel
     * @param {Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>} options Options `mute` and `deaf`
     * @returns {Player} Returns the newly updated Player
     */
    public setVoiceChannel(
        channel: string,
        options?: Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>
    ): Player {
        if (this.isConnected && channel == this.voiceChannel)
            throw new ReferenceError(`Player is already connected to ${channel}`);

        this.voiceChannel = channel;

        if (options) {
            this.mute = options.mute ?? this.mute ?? false;
            this.deaf = options.deaf ?? this.deaf ?? false;
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

    /**
     * This will set a value to a key
     * @param {string} key Key to set the value
     * @param {unknown} value Value to set the key
     * @returns {K} To set the key and value
     */
    public set<K>(key: string, value: K): K {
        return (this.data[key] = value) as K;
    }

    /**
     * This will retrieve the value via the key
     * @param {string} key Key to get the value
     * @returns {K} Returns the data that was obtained via the key
     */
    public get<K>(key: string): K {
        return this.data[key] as K;
    }

    /**
     * This function will disconnect us from the channel
     * @returns {Promise<Player>} Returns the newly updated Player
     */
    public async disconnect(): Promise<Player> {
        if (!this.voiceChannel) return;
        await this.pause(true);
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

    /**
     * Destroys the player for this guild.
     * @returns {Promise<boolean>} Indicating if the player was successfully destroyed
     */
    public async destroy(): Promise<boolean> {
        await this.disconnect();
        await this.node.rest.destroyPlayer(this.guildId);
        this.poru.emit("debug", this.guildId, `[Poru Player] destroyed the player`);
        this.poru.emit("playerDestroy", this);
        return this.poru.players.delete(this.guildId);
    };

    /**
     * This function will restart the player and play the current track
     * @returns {Promise<Player>} Returns a Player object
     */
    public async restart(): Promise<Player> {
        if (!this.currentTrack.track && !this.queue.length) return;
        if (!this.currentTrack.track) return await this.play();

        await this.node.rest.updatePlayer({
            guildId: this.guildId,
            data: {
                position: this.position,
                track: this.currentTrack,
            },
        });

        return this;
    };


    /**
     * This function will move the node from the current player
     * @param {string} name The name of the node to move to
     * @returns 
     */
    public async moveNode(name: string) {
        const node = this.poru.nodes.get(name);

        if (!node || node.name === this.node.name) return;
        if (!node.isConnected)
            throw new Error("Provided Node is not connected");

        try {
            await this.node.rest.destroyPlayer(this.guildId);
            this.poru.players.delete(this.guildId);
            this.node = node;
            this.poru.players.set(this.guildId, this);
            return await this.restart();
        } catch (e) {
            await this.destroy();
            throw e;
        }
    };

    /**
     * This function will autmatically move the node to the leastUsed Node for the current player
     * @returns Promise of Player or nothing if there was no node to move to or a error came up
     */
    public async autoMoveNode(): Promise<Player | void> {
        if (this.poru.leastUsedNodes.length === 0)
            throw new Error("[Poru Error] No nodes are avaliable");

        const node = this.poru.nodes.get(this.poru.leastUsedNodes[0].name);
        if (!node) {
            await this.destroy();
            return;
        };

        return await this.moveNode(node.name);
    };

    /**
     * This function will automatically add a track to the queue and play it
     * @returns The newly updated Player which is playing the song
     */
    public async autoplay(): Promise<Player> {
        try {
            const data = `https://www.youtube.com/watch?v=${this.previousTrack?.info?.identifier || this.currentTrack?.info?.identifier
                }&list=RD${this.previousTrack.info.identifier || this.currentTrack.info.identifier}`;

            const response = await this.poru.resolve({
                query: data,
                requester: this.previousTrack?.info?.requester ?? this.currentTrack?.info?.requester,
                source: this.previousTrack?.info?.sourceName ?? this.currentTrack?.info?.sourceName ?? this.poru.options?.defaultPlatform ?? "ytmsearch",
            });

            if (
                !response ||
                !response.tracks ||
                ["error", "empty"].includes(response.loadType)
            )
                return await this.stop();

            response.tracks.shift();

            const track = response.tracks[
                Math.floor(Math.random() * Math.floor(response.tracks.length))
            ];

            this.queue.push(track);
            await this.play();

            return this;
        } catch (e) {
            return await this.stop();
        };
    };

    /**
     * This function will handle all the events
     * @param {EventData} data The data of the event
     * @returns {Promise<Player | boolean | void>} The Player object, a boolean or void
     */
    public async eventHandler(data: EventData): Promise<Player | boolean | void> {
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
                    this.poru.emit("trackEnd", this, this.currentTrack, data);
                    return await this.play();
                } else if (this.currentTrack && this.loop === "QUEUE") {
                    this.queue.push(this.previousTrack);
                    this.poru.emit("trackEnd", this, this.currentTrack, data);
                    return await this.play();
                }

                if (this.queue.length === 0) {
                    this.isPlaying = false;
                    return this.poru.emit("queueEnd", this);
                } else if (this.queue.length > 0) {
                    this.poru.emit("trackEnd", this, this.currentTrack, data);
                    return await this.play();
                }

                this.isPlaying = false;
                this.poru.emit("queueEnd", this);
                break;
            }

            case "TrackStuckEvent": {
                this.poru.emit("trackError", this, this.currentTrack, data);
                await this.stop();
                break;
            }
            case "TrackExceptionEvent": {
                this.poru.emit("trackError", this, this.currentTrack, data);
                await this.stop();
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
                await this.pause(true);
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
    };

    /**
     * This function will get the track by it's name or identifier or url and will return the track data
     * @param {ResolveOptions} param0 The parameters to resolve the track
     * @returns {Promise<Response>} The response of the track data which was searched for
     */
    public async resolve({ query, source, requester }: ResolveOptions): Promise<Response> {
        const regex = /^https?:\/\//;

        if (regex.test(query)) {
            const response = await this.node.rest.get<LoadTrackResponse>(
                `/v4/loadtracks?identifier=${encodeURIComponent(query)}`
            );
            return new Response(response, requester);
        } else {
            const track = `${source || "ytsearch"}:${query}`;
            const response = await this.node.rest.get<LoadTrackResponse>(
                `/v4/loadtracks?identifier=${encodeURIComponent(track)}`
            );
            return new Response(response, requester);
        }
    };

    /**
     * 
     * @param data The data to send to the voice server from discord
     * @returns {void} void
     */
    public send(data: any): void {
        this.poru.send({ op: 4, d: data });
    };
}