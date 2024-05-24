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
const ws_1 = __importDefault(require("ws"));
const escapeRegExp = (str) => {
    try {
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    catch { }
};
;
;
;
/**
 * Represents a player capable of playing audio tracks.
 * @extends EventEmitter
 */
class Player extends events_1.EventEmitter {
    data;
    /** The Poru instance associated with the player. */
    poru;
    /** The node associated with the player. */
    node;
    /** The connection associated with the player. */
    connection;
    /** The queue of tracks for the player. */
    queue;
    /** Filters applied to the player's audio. */
    filters;
    /** The guild ID associated with the player. */
    guildId;
    /** The guild ID associated with the player. */
    voiceChannel;
    /** The text channel ID associated with the player. */
    textChannel;
    /** The currently playing track */
    currentTrack;
    /** The previously played track */
    previousTrack;
    /** Indicates whether the player is currently playing a track. */
    isPlaying;
    /** Indicates whether the player is connected to a voice channel. */
    isPaused;
    /** Indicates whether the player is connected to a voice channel. */
    isConnected;
    /** Indicated whether autoplay mode is enabled. */
    isAutoPlay; // Is this even used?
    /** Indicated whether quiet mode is enabled for the player.  */
    isQuietMode; // Is this even used?
    /** The loop settings for the player. */
    loop;
    /** The current position of the player in the track (in milliseconds) */
    position;
    /** The current delay estimate of the player (in milliseconds) */
    ping;
    /** The timestamp of the player's state */
    timestamp;
    /** Indicates whether the player is set to be muted. */
    mute;
    /** Indicated whether the player is set to be deafened */
    deaf;
    /** The volume of the player (0-1000) */
    volume;
    /** Should only be used when the node is a NodeLink */
    voiceReceiverWsClient;
    isConnectToVoiceReceiver;
    voiceReceiverReconnectTimeout;
    voiceReceiverAttempt;
    voiceReceiverReconnectTries;
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
        this.isAutoPlay = false;
        this.isQuietMode = false;
        this.isConnected = false;
        this.loop = "NONE";
        this.data = {};
        this.voiceReceiverWsClient = null;
        this.isConnectToVoiceReceiver = false;
        this.voiceReceiverReconnectTimeout = null;
        this.voiceReceiverAttempt = 0;
        this.voiceReceiverReconnectTries = 3;
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
     * Initiates playback of the next track in the queue.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async play() {
        if (!this.queue.length)
            return this;
        this.currentTrack = this.queue.shift() ?? null;
        if (this.currentTrack && !this.currentTrack?.track)
            this.currentTrack = await this.resolveTrack(this.currentTrack);
        if (this.currentTrack?.track) {
            await this.node.rest.updatePlayer({
                guildId: this.guildId,
                data: {
                    track: { encoded: this.currentTrack.track },
                },
            });
            this.isPlaying = true;
            this.position = 0;
            this.isAutoPlay = false;
        }
        ;
        return this;
    }
    /**
     * Resolves a track before playback.
     * @param {Track} track - The track to resolve.
     * @returns {Promise<Track>} - A Promise that resolves to the resolved track.
     * @private
     */
    async resolveTrack(track) {
        const query = [track.info?.author, track.info?.title]
            .filter((x) => !!x)
            .join(" - ");
        const result = await this.resolve({ query, source: this.poru.options?.defaultPlatform || "ytsearch", requester: track.info?.requester });
        if (!result || !result.tracks.length)
            return null;
        if (track.info?.author) {
            const author = [track.info.author, `${track.info.author} - Topic`];
            const officialAudio = result.tracks.find((track) => author.some((name) => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)) ||
                new RegExp(`^${escapeRegExp(track.info.title)}$`, "i").test(track.info.title));
            if (officialAudio) {
                track.info.identifier = officialAudio.info.identifier;
                track.track = officialAudio.track;
                return track;
            }
        }
        if (track.info.length) {
            const sameDuration = result.tracks.find((track) => track.info.length >= (track.info.length ? track.info.length : 0) - 2000 &&
                track.info.length <= (track.info.length ? track.info.length : 0) + 2000);
            if (sameDuration) {
                track.info.identifier = sameDuration.info.identifier;
                track.track = sameDuration.track;
                return track;
            }
        }
        track.info.identifier = result.tracks[0].info.identifier;
        return track;
    }
    /**
     * Connects the player to a voice channel.
     * @param {ConnectionOptions} [options=this] - The options for the connection.
     */
    connect(options = this) {
        const { guildId, voiceChannel, deaf, mute } = options;
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
     * Skips the current track.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async skip() {
        await this.node.rest.updatePlayer({
            guildId: this.guildId,
            data: { track: { encoded: null } },
        });
        this.position = 0;
        this.isPlaying = false;
        return this;
    }
    ;
    /**
     * This function is used to get lyrics of the current track.
     *
     * @attention This function is only available for [NodeLink](https://github.com/PerformanC/NodeLink) nodes.
     *
     * @param encodedTrack The encoded track to get the lyrics from
     * @param language The language of the lyrics to get defaults to english
     * @returns
     */
    async getLyrics(encodedTrack) {
        let node = this.node;
        if (!this.node.isNodeLink)
            node = Array.from(this.poru.nodes)?.find(([, node]) => node.isNodeLink)?.[1];
        if (!node || !node.isNodeLink)
            throw new Error("[Poru Exception] No NodeLink node found in the Poru instance.");
        if (!encodedTrack && !this.currentTrack)
            throw new Error("[Poru Exception] A track must be playing right now or be supplied.");
        encodedTrack = this.currentTrack?.track;
        return await this.node.rest.get(`/v4/lyrics?track=${encodeURIComponent(encodedTrack ?? "")}`);
    }
    ;
    /**
     * Pauses or resumes playback.
     * @param {boolean} [toggle=true] - Specifies whether to pause or resume playback.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
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
     * Seeks to a specific position in the current track.
     * @param {number} position - The position to seek to (in milliseconds).
     */
    async seekTo(position) {
        if (this.position + position >= (this.currentTrack?.info.length ?? 0))
            position = this.currentTrack?.info.length ?? 0;
        await this.node.rest.updatePlayer({ guildId: this.guildId, data: { position } });
    }
    ;
    /**
     * Sets the volume level of the player.
     * @param {number} volume - The volume level (0 to 1000).
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async setVolume(volume) {
        if (volume < 0 || volume > 1000)
            throw new Error("[Poru Exception] Volume must be between 0 to 1000");
        await this.node.rest.updatePlayer({ guildId: this.guildId, data: { volume } });
        this.volume = volume;
        return this;
    }
    /**
     * Sets the loop mode of the player.
     * @param {Loop} mode - The loop mode to set.
     * @returns {Player} - The Player instance.
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
     * Sets the text channel associated with the player.
     * @param {string} channel - The ID of the text channel.
     * @returns {Player} - The Player instance.
     */
    setTextChannel(channel) {
        this.textChannel = channel;
        return this;
    }
    /**
     * Sets the voice channel associated with the player.
     * @param {string} channel - The ID of the voice channel.
     * @param {ConnectionOptions} [options] - The options for the connection.
     * @returns {Player} - The Player instance.
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
     * Sets a custom data value associated with the player.
     * @param {string} key - The key for the data value.
     * @param {K} value - The value to set.
     * @returns {K} - The set value.
     */
    set(key, value) {
        return (this.data[key] = value);
    }
    /**
     * Retrieves a custom data value associated with the player.
     * @param {string} key - The key for the data value.
     * @returns {K} - The retrieved value.
     */
    get(key) {
        return this.data[key];
    }
    /**
     * Disconnects the player from the voice channel.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async disconnect() {
        if (!this.voiceChannel)
            return this;
        await this.pause(true);
        this.isConnected = false;
        this.send({
            guild_id: this.guildId,
            channel_id: null,
            self_mute: false,
            self_deaf: false,
        });
        return this;
    }
    ;
    /**
     * Destroys the player and cleans up associated resources.
     * @returns {Promise<boolean>} - A Promise that resolves to a boolean which is true if an element in the Map existed and has been removed, or false if the element does not exist.
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
     * Restarts playback from the current track.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async restart() {
        if (!this.currentTrack?.track && !this.queue.length)
            return this;
        if (!this.currentTrack?.track)
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
     * Moves the player to a different node.
     * @param {string} name - The name of the target node.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async moveNode(name) {
        const node = this.poru.nodes.get(name);
        if (!node || node.name === this.node.name)
            return this;
        if (!node.isConnected)
            throw new Error("Provided Node is not connected");
        try {
            await this.node.rest.destroyPlayer(this.guildId).catch(() => { });
            this.poru.players.delete(this.guildId);
            this.node = node;
            this.poru.players.set(this.guildId, this);
            return await this.restart();
        }
        catch (e) {
            await this.destroy();
            throw e;
        }
        ;
    }
    ;
    /**
     * Automatically moves the player to a less used node.
     * @returns {Promise<Player | void>} - A Promise that resolves to the Player instance or void.
     */
    async autoMoveNode() {
        if (this.poru.leastUsedNodes.length === 0)
            throw new Error("[Poru Error] No nodes are avaliable");
        const node = this.poru.nodes.get(this.poru.leastUsedNodes[0]?.name);
        if (!node) {
            await this.destroy();
            return;
        }
        ;
        return await this.moveNode(node.name);
    }
    ;
    /**
     * Enables autoplay functionality for the player.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    async autoplay() {
        try {
            const data = `https://www.youtube.com/watch?v=${this.previousTrack?.info?.identifier || this.currentTrack?.info?.identifier}&list=RD${this.previousTrack?.info.identifier || this.currentTrack?.info.identifier}`;
            const response = await this.poru.resolve({
                query: data,
                requester: this.previousTrack?.info?.requester ?? this.currentTrack?.info?.requester,
                source: this.previousTrack?.info?.sourceName ?? this.currentTrack?.info?.sourceName ?? this.poru.options?.defaultPlatform ?? "ytmsearch",
            });
            if (!response || !response.tracks || ["error", "empty"].includes(response.loadType))
                return await this.skip();
            response.tracks.shift();
            const track = response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))];
            this.queue.push(track);
            await this.play();
            this.isAutoPlay = true;
            return this;
        }
        catch (e) {
            return await this.skip();
        }
        ;
    }
    ;
    /**
     * Handles incoming events for the player.
     * @param {EventData} data - The event data.
     * @returns {Promise<Player | boolean | void>} - A Promise that resolves to the Player instance, a boolean, or void.
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
                if (data.reason === "replaced")
                    return this.poru.emit("trackEnd", this, this.currentTrack, data);
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
                await this.skip();
                break;
            }
            case "TrackExceptionEvent": {
                this.poru.emit("trackError", this, this.currentTrack, data);
                await this.skip();
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
     * Resolves a query to obtain audio tracks.
     * @param {ResolveOptions} options - The options for resolving the query.
     * @returns {Promise<Response>} - A Promise that resolves to a Response object containing the resolved tracks.
     */
    async resolve({ query, source, requester }) {
        const response = await this.node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent((this.startsWithMultiple(query, ["https://", "http://"]) ? '' : `${source || 'ytsearch'}:`) + query)}`) ?? { loadType: "empty", data: {} };
        return new Response_1.Response(response, requester);
    }
    ;
    /**
     * Sends data to the Poru system.
     * @param {any} data - The data to send.
     */
    send(data) {
        if (!this.poru.send)
            throw new Error("[Poru Error] The send function is required to send data to discord. Please provide a send function in the Poru options or use one of the supported Libraries.");
        this.poru.send({ op: 4, d: data });
    }
    ;
    async setupVoiceReceiverConnection() {
        return new Promise(async (resolve, reject) => {
            if (!this.node.isNodeLink)
                return reject(new Error("[Poru Exception] This function is only available for NodeLink nodes."));
            if (!this.poru.userId)
                return reject(new Error("[Poru Error] No user id found in the Poru instance. Consider using a supported library."));
            if (this.voiceReceiverWsClient)
                await this.removeVoiceReceiverConnection();
            const headers = {
                Authorization: this.node.password,
                "User-Id": this.poru.userId,
                "Guild-Id": this.guildId,
                "Client-Name": this.node.clientName,
            };
            const { host, secure, port } = this.node.options;
            this.voiceReceiverWsClient = new ws_1.default(`${secure ? "wss" : "ws"}://${host}:${port}/connection/data`, { headers });
            this.voiceReceiverWsClient.on("open", this.voiceReceiverOpen.bind(this));
            this.voiceReceiverWsClient.on("error", this.voiceReceiverError.bind(this));
            this.voiceReceiverWsClient.on("message", this.voiceReceiverMessage.bind(this));
            this.voiceReceiverWsClient.on("close", this.voiceReceiverClose.bind(this));
            return resolve(true);
        });
    }
    ;
    async removeVoiceReceiverConnection() {
        return new Promise((resolve, reject) => {
            if (!this.node.isNodeLink)
                return reject(new Error("[Poru Exception] This function is only available for NodeLink nodes."));
            this.voiceReceiverWsClient?.close(1000, "destroy");
            this.voiceReceiverWsClient?.removeAllListeners();
            this.voiceReceiverWsClient = null;
            this.isConnectToVoiceReceiver = false;
            return resolve(true);
        });
    }
    ;
    // Private stuff
    /**
      * This will close the connection to the node
      * @param {any} event any
      * @returns {void} void
      */
    async voiceReceiverClose(event) {
        try {
            await this.voiceReceiverDisconnect();
            this.poru.emit("debug", this.node.name, `[Voice Receiver Web Socket] Connection was closed with the following Error code: ${event || "Unknown code"}`);
            if (event !== 1000)
                await this.voiceReceiverReconnect();
        }
        catch (error) {
            this.poru.emit("debug", "[Voice Receiver Web Socket] Error while closing the connection with the node.", error);
        }
        ;
    }
    ;
    startsWithMultiple(s, words) {
        return words.some(w => s.startsWith(w));
    }
    ;
    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    async voiceReceiverReconnect() {
        this.voiceReceiverReconnectTimeout = setTimeout(async () => {
            if (this.voiceReceiverAttempt > this.voiceReceiverReconnectTries) {
                throw new Error(`[Poru Voice Receiver Websocket] Unable to connect with ${this.node.name} node to the voice Receiver Websocket after ${this.voiceReceiverReconnectTries} tries`);
            }
            // Delete the ws instance
            this.isConnected = false;
            this.voiceReceiverWsClient?.removeAllListeners();
            this.voiceReceiverWsClient = null;
            this.poru.emit("debug", this.node.name, `[Voice Receiver Web Socket] Reconnecting to the voice Receiver Websocket...`);
            await this.setupVoiceReceiverConnection();
            this.voiceReceiverAttempt++;
        }, this.node.reconnectTimeout);
    }
    ;
    /**
     * This function will make the node disconnect
     * @returns {Promise<void>} void
     */
    async voiceReceiverDisconnect() {
        if (!this.isConnectToVoiceReceiver)
            return;
        this.voiceReceiverWsClient?.close(1000, "destroy");
        this.voiceReceiverWsClient?.removeAllListeners();
        this.voiceReceiverWsClient = null;
        this.poru.emit("voiceReceiverDisconnected", this, `[Voice Receiver Web Socket] Connection was closed.`);
    }
    ;
    /**
      * This function will open up again the node
      * @returns {Promise<void>} The Promise<void>
      */
    async voiceReceiverOpen() {
        try {
            if (this.voiceReceiverReconnectTimeout) {
                clearTimeout(this.voiceReceiverReconnectTimeout);
                this.voiceReceiverReconnectTimeout = null;
            }
            ;
            this.isConnectToVoiceReceiver = true;
            this.poru.emit("voiceReceiverConnected", this, `[Voice Receiver Web Socket] Connection ready ${this.node.socketURL}/connection/data`);
        }
        catch (error) {
            this.poru.emit("debug", `[Voice Receiver Web Socket] Error while opening the connection with the node ${this.node.name}. to the voice Receiver Websocket.`, error);
        }
        ;
    }
    ;
    /**
     * This will send a message to the node
     * @param {string} payload The sent payload we recieved in stringified form
     * @returns {Promise<void>} Return void
     */
    async voiceReceiverMessage(payload) {
        try {
            const packet = JSON.parse(payload);
            if (!packet?.op)
                return;
            this.poru.emit("debug", this.node.name, `[Voice Receiver Web Socket] Recieved a payload: ${payload}`);
            switch (packet.type) {
                case "startSpeakingEvent": {
                    this.poru.emit("startSpeaking", this, packet.data);
                    break;
                }
                case "endSpeakingEvent": {
                    const data = {
                        ...packet.data,
                        data: Buffer.from(packet.data.data, "base64")
                    };
                    this.poru.emit("endSpeaking", this, data);
                    break;
                }
                default: {
                    this.poru.emit("debug", this.node.name, `[Voice Receiver Web Socket] Recieved an unknown payload: ${payload}`);
                    break;
                }
            }
        }
        catch (err) {
            this.poru.emit("voiceReceiverError", this, "[Voice Receiver Web Socket] Error while parsing the payload. " + err);
        }
        ;
    }
    ;
    /**
      * This function will emit the error so that the user's listeners can get them and listen to them
      * @param {any} event any
      * @returns {void} void
      */
    voiceReceiverError(event) {
        if (!event)
            return;
        this.poru.emit("voiceReceiverError", this, event);
        this.poru.emit("debug", `[Voice Receiver Web Socket] Connection for NodeLink Voice Receiver (${this.node.name}) has the following error code: ${event.code || event}`);
    }
    ;
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map