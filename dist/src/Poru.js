"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poru = void 0;
const Node_1 = require("./Node/Node");
const Player_1 = require("./Player/Player");
const events_1 = require("events");
const config_1 = require("./config");
const Response_1 = require("./guild/Response");
;
;
;
;
;
;
/**
 * Represents Poru, a library for managing audio players with Lavalink.
 * @extends EventEmitter
 */
class Poru extends events_1.EventEmitter {
    client;
    _nodes;
    options;
    nodes;
    players;
    userId;
    version;
    isActivated;
    send;
    /**
     * Creates an instance of Poru.
     * @param {any} client - VoiceClient used for connecting to Lavalink node server.
     * @param {NodeGroup[]} nodes - Array of node groups.
     * @param {PoruOptions} options - Configuration options for Poru.
     */
    constructor(client, nodes, options) {
        super();
        this.client = client;
        this._nodes = nodes;
        this.nodes = new Map();
        this.players = new Map();
        this.options = options;
        this.userId = null;
        this.version = config_1.Config.version;
        this.isActivated = false;
        this.send = null;
    }
    /**
     * Initializes Poru and adds nodes.
     */
    async init() {
        if (this.isActivated)
            return this;
        this.userId = this.client.user.id;
        this._nodes.forEach(async (node) => await this.addNode(node));
        this.isActivated = true;
        if (this.options.plugins) {
            this.options.plugins.forEach((plugin) => {
                plugin.load(this);
            });
        }
        if (!this.options.library)
            this.options.library = "discord.js";
        switch (this.options.library) {
            case "discord.js": {
                this.send = (packet) => {
                    const guild = this.client.guilds.cache.get(packet.d.guild_id);
                    if (guild)
                        guild.shard?.send(packet);
                };
                this.client.on("raw", async (packet) => {
                    await this.packetUpdate(packet);
                });
                break;
            }
            case "eris": {
                this.send = (packet) => {
                    const guild = this.client.guilds.get(packet.d.guild_id);
                    if (guild)
                        guild.shard.sendWS(packet?.op, packet?.d);
                };
                this.client.on("rawWS", async (packet) => {
                    await this.packetUpdate(packet);
                });
                break;
            }
            case "oceanic": {
                this.send = (packet) => {
                    const guild = this.client.guilds.get(packet.d.guild_id);
                    if (guild)
                        guild.shard.send(packet?.op, packet?.d);
                };
                this.client.on("packet", async (packet) => {
                    await this.packetUpdate(packet);
                });
                break;
            }
            case "other": {
                if (!this.send || !this.options.send)
                    throw new Error("Send function is required in Poru Options");
                this.send = this.options.send ?? null;
                break;
            }
        }
    }
    ;
    /**
     * Handles Voice State Update and Voice Server Update packets.
     * @param {Packet} packet - Packet from Discord API.
     * @returns {void}
     */
    async packetUpdate(packet) {
        if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t))
            return;
        if (!("guild_id" in packet.d))
            return;
        const player = this.players.get(packet.d.guild_id);
        if (!player)
            return;
        if (packet.t === "VOICE_SERVER_UPDATE") {
            await player.connection.setServersUpdate(packet.d);
        }
        if (packet.t === "VOICE_STATE_UPDATE") {
            if (packet.d.user_id !== this.userId)
                return;
            player.connection.setStateUpdate(packet.d);
        }
    }
    /**
     * Adds a node to the Poru instance.
     * @param {NodeGroup} options - Node group options.
     * @returns {Node} The added Node instance.
     */
    async addNode(options) {
        const node = new Node_1.Node(this, options, this.options);
        this.nodes.set(options.name, node);
        await node.connect();
        return node;
    }
    /**
      * Removes a node from the Poru instance.
      * @param {string} identifier - The name of the node.
      * @returns {boolean} A boolean indicating if the node was successfully removed.
      */
    async removeNode(identifier) {
        const node = this.nodes.get(identifier);
        if (!node)
            return true;
        await node.disconnect();
        return this.nodes.delete(identifier);
    }
    ;
    /**
     * Retrieves nodes by region.
     * @param {string} region - Region of the node.
     * @returns {Node[]} Array of nodes in the specified region.
     */
    getNodeByRegion(region) {
        return [...this.nodes.values()]
            .filter((node) => node.isConnected && node.regions?.includes(region?.toLowerCase()))
            .sort((a, b) => {
            const aLoad = a.stats?.cpu
                ? (a.stats.cpu.systemLoad / a.stats.cpu.cores) * 100
                : 0;
            const bLoad = b.stats?.cpu
                ? (b.stats.cpu.systemLoad / b.stats.cpu.cores) * 100
                : 0;
            return aLoad - bLoad;
        });
    }
    /**
     * Retrieves a node by its identifier.
     * @param {string} [identifier="auto"] - Node name.
     * @returns {Node | Node[]} The specified Node instance or array of nodes.
     */
    getNode(identifier = "auto") {
        if (!this.nodes.size)
            throw new Error(`No nodes available currently`);
        if (identifier === "auto")
            return this.leastUsedNodes;
        const node = this.nodes.get(identifier);
        if (!node)
            throw new Error("The node identifier you provided is not found");
        if (!node.isConnected)
            node.connect();
        return node;
    }
    /**
     * Creates a new player.
     * @param {ConnectionOptions} options - Connection options.
     * @returns {Player} The newly created Player instance.
     */
    createConnection(options) {
        if (!this.isActivated)
            throw new Error(`You have to init poru in your ready event`);
        const player = this.players.get(options.guildId);
        if (player)
            return player;
        if (this.leastUsedNodes.length === 0)
            throw new Error("[Poru Error] No nodes are available");
        let node;
        if (options.region) {
            const region = this.getNodeByRegion(options.region)[0];
            node = this.nodes.get(region.name || this.leastUsedNodes[0].name);
        }
        else {
            node = this.nodes.get(this.leastUsedNodes[0].name);
        }
        if (!node)
            throw new Error("[Poru Error] No nodes are available");
        return this.createPlayer(node, options);
    }
    createPlayer(node, options) {
        let player;
        if (this.options.customPlayer) {
            player = new this.options.customPlayer(this, node, options);
        }
        else {
            player = new Player_1.Player(this, node, options);
        }
        this.players.set(options.guildId, player);
        player.connect(options);
        return player;
    }
    ;
    /**
     * Removes a player from the Poru instance.
     * @param {string} guildId - Guild ID.
     * @returns {Promise<boolean>} A promise indicating a boolean which is true if an element in the Map existed and has been removed, or false if the element does not exist.
     */
    async removeConnection(guildId) {
        return await this.players.get(guildId)?.destroy() ?? false;
    }
    ;
    /**
     * Retrieves least used nodes.
     * @returns {Node[]} Array of least used nodes.
     */
    get leastUsedNodes() {
        return [...this.nodes.values()]
            .filter((node) => node.isConnected)
            .sort((a, b) => a.penalties - b.penalties);
    }
    /**
     * Resolves a track.
     * @param {ResolveOptions} options - Options for resolving tracks.
     * @param {Node} [node] - Node to use for resolution.
     * @returns {Promise<Response>} The response containing resolved tracks.
     */
    async resolve({ query, source, requester }, node) {
        if (!this.isActivated)
            throw new Error(`You have to init poru in your ready event`);
        if (!node)
            node = this.leastUsedNodes[0];
        if (!node)
            throw new Error("No nodes are available.");
        const response = (await node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent((this.startsWithMultiple(query, ["https://", "http://"]) ? '' : `${source || 'ytsearch'}:`) + query)}`)) ?? { loadType: "empty", data: {} };
        return new Response_1.Response(response, requester);
    }
    /**
     * Decodes a track.
     * @param {string} encodedTrackString - The encoded track string.
     * @param {Node} [node] - The node to decode on.
     * @returns {Promise<trackData>} The decoded track.
     */
    async decodeTrack(encodedTrackString, node) {
        if (!node)
            node = this.leastUsedNodes[0];
        return await node.rest.get(`/v4/decodetrack?encodedTrack=${encodeURIComponent(encodedTrackString)}`);
    }
    /**
     * Decodes multiple tracks.
     * @param {string[]} encodedTrackString - Array of encoded track strings.
     * @param {Node} [node] - The node to decode on.
     * @returns {Promise<trackData[]>} Array of decoded tracks.
     */
    async decodeTracks(encodedTrackString, node) {
        if (!node)
            node = this.leastUsedNodes[0];
        return await node.rest.post(`/v4/decodetracks`, encodedTrackString);
    }
    /**
      * Retrieves Lavalink info for a node.
      * @param {string} name - The name of the node.
      * @returns {Promise<NodeInfoResponse>} Information about the node.
      */
    async getLavalinkInfo(name) {
        const node = this.nodes.get(name);
        if (!node)
            throw new Error("Node not found!");
        return await node.rest.get(`/v4/info`);
    }
    /**
     * Retrieves Lavalink status for a node.
     * @param {string} name - The name of the node.
     * @returns {Promise<NodeStatsResponse>} The status of the node.
     */
    async getLavalinkStatus(name) {
        const node = this.nodes.get(name);
        if (!node)
            throw new Error("Node not found!");
        return await node.rest.get(`/v4/stats`);
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
    async getLyrics(encodedTrack, language) {
        const node = Array.from(this.nodes)?.find(([, node]) => node.isNodeLink)?.[1];
        if (!node)
            return null;
        // Just to be extra sure
        if (!node.isNodeLink)
            throw new Error("[Poru Exception] The node must be a Nodelink node.");
        if (!encodedTrack)
            throw new Error("[Poru Exception] A track must be playing right now or be supplied.");
        return await node.rest.get(`/v4/loadlyrics?encodedTrack=${encodeURIComponent(encodedTrack ?? "")}${language ? `&language=${encodeURIComponent(language)}` : ""}`);
    }
    ;
    /**
     * Retrieves the Lavalink version for a node.
     * @param {string} name - The name of the node.
     * @returns {Promise<string>} The version of the node.
     */
    async getLavalinkVersion(name) {
        const node = this.nodes.get(name);
        if (!node)
            throw new Error("Node not found!");
        return await node.rest.get(`/version`);
    }
    ;
    /**
     * Retrieves a player by guild ID.
     * @param {string} guildId - Guild ID.
     * @returns {Player} The player instance for the specified guild.
     */
    get(guildId) {
        return this.players.get(guildId) ?? null;
    }
    ;
    startsWithMultiple(s, words) {
        return words.some(w => s.startsWith(w));
    }
    ;
}
exports.Poru = Poru;
;
//# sourceMappingURL=Poru.js.map