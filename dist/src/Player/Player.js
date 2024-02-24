"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Connection_1 = require("./Connection");
const Queue_1 = __importDefault(require("../guild/Queue"));
const events_1 = require("events");
const Filters_1 = require("./Filters");
const Response_1 = require("../guild/Response");
const escapeRegExp = (str) => {
    try {
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    catch { }
};
class Player extends events_1.EventEmitter {
    data;
    poru;
    node;
    connection;
    queue;
    filters;
    guildId;
    voiceChannel;
    textChannel;
    currentTrack;
    previousTrack;
    isPlaying;
    isPaused;
    isConnected;
    isAutoPlay;
    isQuietMode;
    loop;
    position;
    ping;
    timestamp;
    mute;
    deaf;
    volume;
    constructor(poru, node, options) {
        super();
        this.poru = poru;
        this.node = node;
        this.queue = new Queue_1.default();
        this.connection = new Connection_1.Connection(this);
        this.guildId = options.guildId;
        this.filters = this.poru.options.customFilter ? new this.poru.options.customFilter(this) : new Filters_1.Filters(this);
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
    async play() {
        if (!this.queue.length)
            return;
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
        }
        else {
            //  return this.play();
            // Here joniii: What is that?
        }
        ;
        return this;
    }
    /**
      * Resolve a track
      * @param {Track} track - Only for personal use
      * @returns {Promise<Track>} Returns a Track
      */
    async resolveTrack(track) {
        const query = [track.info?.author, track.info?.title]
            .filter((x) => !!x)
            .join(" - ");
        const result = await this.resolve({ query, source: this.poru.options?.defaultPlatform || "ytsearch", requester: track.info?.requester });
        if (!result || !result.tracks.length)
            return;
        if (track.info?.author) {
            const author = [track.info.author, `${track.info.author} - Topic`];
            const officialAudio = result.tracks.find((track) => author.some((name) => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)) ||
                new RegExp(`^${escapeRegExp(track.info.title)}$`, "i").test(track.info.title));
            if (officialAudio) {
                //track.info.identifier = officialAudio.info.identifier;
                track.track = officialAudio.track;
                return track;
            }
        }
        if (track.info.length) {
            const sameDuration = result.tracks.find((track) => track.info.length >= (track.info.length ? track.info.length : 0) - 2000 &&
                track.info.length <= (track.info.length ? track.info.length : 0) + 2000);
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
    connect(options = this) {
        let { guildId, voiceChannel, deaf, mute } = options;
        this.send({
            guild_id: guildId,
            channel_id: voiceChannel,
            self_deaf: deaf || false,
            self_mute: mute || false,
        });
        this.isConnected = true;
        this.poru.emit("debug", this.guildId, `[Poru Player] Player has been connected`);
    }
    /**
     * This function will stop the current song
     * @returns {Promise<Player>} Returns the player after stopping the song
     *
     * You can use this function to also skip the current song
     */
    async stop() {
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
    async pause(toggle = true) {
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
    async seekTo(position) {
        if (this.position + position >= this.currentTrack.info.length)
            position = this.currentTrack.info.length;
        await this.node.rest.updatePlayer({ guildId: this.guildId, data: { position } });
    }
    /**
     * This function will set the volume to a specified number between 0 and 1000
     * @param volume Number to set the volume
     * @returns {Promise<Player>} The newly updated Player
     */
    async setVolume(volume) {
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
    setLoop(mode) {
        if (!mode)
            throw new Error(`[Poru Player] You must have to provide loop mode as argument of setLoop`);
        if (!["NONE", "TRACK", "QUEUE"].includes(mode))
            throw new Error(`[Poru Player] setLoop arguments are NONE,TRACK AND QUEUE`);
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
    setTextChannel(channel) {
        this.textChannel = channel;
        return this;
    }
    /**
     * This function will set the voice channel
     * @param {string} channel String to set the voice channel
     * @param {Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>} options Options `mute` and `deaf`
     * @returns {Player} Returns the newly updated Player
     */
    setVoiceChannel(channel, options) {
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
    set(key, value) {
        return (this.data[key] = value);
    }
    /**
     * This will retrieve the value via the key
     * @param {string} key Key to get the value
     * @returns {K} Returns the data that was obtained via the key
     */
    get(key) {
        return this.data[key];
    }
    /**
     * This function will disconnect us from the channel
     * @returns {Promise<Player>} Returns the newly updated Player
     */
    async disconnect() {
        if (!this.voiceChannel)
            return;
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
    async destroy() {
        await this.disconnect();
        await this.node.rest.destroyPlayer(this.guildId);
        this.poru.emit("debug", this.guildId, `[Poru Player] destroyed the player`);
        this.poru.emit("playerDestroy", this);
        return this.poru.players.delete(this.guildId);
    }
    ;
    /**
     * This function will restart the player and play the current track
     * @returns {Promise<Player>} Returns a Player object
     */
    async restart() {
        if (!this.currentTrack.track && !this.queue.length)
            return;
        if (!this.currentTrack.track)
            return await this.play();
        await this.node.rest.updatePlayer({
            guildId: this.guildId,
            data: {
                position: this.position,
                track: this.currentTrack,
            },
        });
        return this;
    }
    ;
    /**
     * This function will move the node from the current player
     * @param {string} name The name of the node to move to
     * @returns
     */
    async moveNode(name) {
        const node = this.poru.nodes.get(name);
        if (!node || node.name === this.node.name)
            return;
        if (!node.isConnected)
            throw new Error("Provided Node is not connected");
        try {
            await this.node.rest.destroyPlayer(this.guildId);
            this.poru.players.delete(this.guildId);
            this.node = node;
            this.poru.players.set(this.guildId, this);
            return await this.restart();
        }
        catch (e) {
            await this.destroy();
            throw e;
        }
    }
    ;
    /**
     * This function will autmatically move the node to the leastUsed Node for the current player
     * @returns Promise of Player or nothing if there was no node to move to or a error came up
     */
    async autoMoveNode() {
        if (this.poru.leastUsedNodes.length === 0)
            throw new Error("[Poru Error] No nodes are avaliable");
        const node = this.poru.nodes.get(this.poru.leastUsedNodes[0].name);
        if (!node) {
            await this.destroy();
            return;
        }
        ;
        return await this.moveNode(node.name);
    }
    ;
    /**
     * This function will automatically add a track to the queue and play it
     * @returns The newly updated Player which is playing the song
     */
    async autoplay() {
        try {
            const data = `https://www.youtube.com/watch?v=${this.previousTrack?.info?.identifier || this.currentTrack?.info?.identifier}&list=RD${this.previousTrack.info.identifier || this.currentTrack.info.identifier}`;
            const response = await this.poru.resolve({
                query: data,
                requester: this.previousTrack?.info?.requester ?? this.currentTrack?.info?.requester,
                source: this.previousTrack?.info?.sourceName ?? this.currentTrack?.info?.sourceName ?? this.poru.options?.defaultPlatform ?? "ytmsearch",
            });
            if (!response ||
                !response.tracks ||
                ["error", "empty"].includes(response.loadType))
                return await this.stop();
            response.tracks.shift();
            const track = response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))];
            this.queue.push(track);
            await this.play();
            return this;
        }
        catch (e) {
            return await this.stop();
        }
        ;
    }
    ;
    /**
     * This function will handle all the events
     * @param {EventData} data The data of the event
     * @returns {Promise<Player | boolean | void>} The Player object, a boolean or void
     */
    async eventHandler(data) {
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
                }
                else if (this.currentTrack && this.loop === "QUEUE") {
                    this.queue.push(this.previousTrack);
                    this.poru.emit("trackEnd", this, this.currentTrack, data);
                    return await this.play();
                }
                if (this.queue.length === 0) {
                    this.isPlaying = false;
                    return this.poru.emit("queueEnd", this);
                }
                else if (this.queue.length > 0) {
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
                this.poru.emit("debug", `Player -> ${this.guildId}`, "Player paused Cause Channel deleted Or Client was kicked");
                break;
            }
            default: {
                throw new Error(`An unknown event: ${data}`);
            }
        }
    }
    ;
    /**
     * This function will get the track by it's name or identifier or url and will return the track data
     * @param {ResolveOptions} param0 The parameters to resolve the track
     * @returns {Promise<Response>} The response of the track data which was searched for
     */
    async resolve({ query, source, requester }) {
        const regex = /^https?:\/\//;
        if (regex.test(query)) {
            const response = await this.node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent(query)}`);
            return new Response_1.Response(response, requester);
        }
        else {
            const track = `${source || "ytsearch"}:${query}`;
            const response = await this.node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent(track)}`);
            return new Response_1.Response(response, requester);
        }
    }
    ;
    /**
     *
     * @param data The data to send to the voice server from discord
     * @returns {void} void
     */
    send(data) {
        this.poru.send({ op: 4, d: data });
    }
    ;
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map