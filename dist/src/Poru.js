"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poru = void 0;
const Node_1 = require("./Node/Node");
const Player_1 = require("./Player/Player");
const events_1 = require("events");
const config_1 = require("./config");
const Response_1 = require("./guild/Response");
;
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
     * This is the main class of Poru
     * @param client VoiceClient for Poru library to use to connect to lavalink node server (discord.js, eris, oceanic)
     * @param nodes Node
     * @param options PoruOptions
     * @returns Poru
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
     * This method is used to add a node to poru
     * @param client VoiceClient for Poru library to use to connect to lavalink node server (discord.js, eris, oceanic)
     * @returns void
     */
    init(client) {
        if (this.isActivated)
            return this;
        this.userId = client.user.id;
        this._nodes.forEach((node) => this.addNode(node));
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
                    const guild = client.guilds.cache.get(packet.d.guild_id);
                    if (guild)
                        guild.shard?.send(packet);
                };
                client.on("raw", async (packet) => {
                    this.packetUpdate(packet);
                });
                break;
            }
            case "eris": {
                this.send = (packet) => {
                    const guild = client.guilds.get(packet.d.guild_id);
                    if (guild)
                        guild.shard.sendWS(packet?.op, packet?.d);
                };
                client.on("rawWS", async (packet) => {
                    this.packetUpdate(packet);
                });
                break;
            }
            case "oceanic": {
                this.send = (packet) => {
                    const guild = client.guilds.get(packet.d.guild_id);
                    if (guild)
                        guild.shard.send(packet?.op, packet?.d);
                };
                client.on("packet", async (packet) => {
                    this.packetUpdate(packet);
                });
                break;
            }
            case "other": {
                if (!this.send)
                    throw new Error("Send function is required in Poru Options");
                this.send = this.options.send;
                break;
            }
        }
    }
    /**
     * Voice State Update and Voice Server Update
     * @param {any} packet packet from discord api
     * @returns {void} void
     */
    packetUpdate(packet) {
        if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t))
            return;
        const player = this.players.get(packet.d.guild_id);
        if (!player)
            return;
        if (packet.t === "VOICE_SERVER_UPDATE") {
            player.connection.setServersUpdate(packet.d);
        }
        if (packet.t === "VOICE_STATE_UPDATE") {
            if (packet.d.user_id !== this.userId)
                return;
            player.connection.setStateUpdate(packet.d);
        }
    }
    /**
     * Add a node to poru instance
     * @param {NodeGroup} options NodeGroup
     * @returns {Node} Node
     */
    addNode(options) {
        const node = new Node_1.Node(this, options, this.options);
        this.nodes.set(options.name, node);
        node.connect();
        return node;
    }
    /**
     * Remove a node from poru instance
     * @param {string} identifier The Name of the node
     * @returns {boolean} A boolean indicating if the node was removed
     */
    removeNode(identifier) {
        const node = this.nodes.get(identifier);
        if (!node)
            return;
        node.disconnect();
        return this.nodes.delete(identifier);
    }
    /**
     * Get a node from poru instance
     * @param {string} region Region of the node
     * @returns {Node[]} A array of nodes
     */
    getNodeByRegion(region) {
        return [...this.nodes.values()]
            .filter((node) => node.isConnected && node.regions?.includes(region?.toLowerCase()))
            .sort((a, b) => {
            const aLoad = a.stats.cpu
                ? (a.stats.cpu.systemLoad / a.stats.cpu.cores) * 100
                : 0;
            const bLoad = b.stats.cpu
                ? (b.stats.cpu.systemLoad / b.stats.cpu.cores) * 100
                : 0;
            return aLoad - bLoad;
        });
    }
    /**
     * Get a node from poru instance
     * @param {string?} identifier Node name
     * @returns {Node | Node[]} A Node or an array of nodes
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
     * Creates a new player
     * @param {ConnectionOptions} options ConnectionOptions
     * @returns {Player} Returns the newly created player instance
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
    /**
     * Create a player from poru instance
     * @param {Node} node Node
     * @param {ConnectionOptions} options ConnectionOptions
     * @returns {Player} Returns the newly created player instance
     */
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
    /**
     * Remove a player from poru instance
     * @param {string} guildId Guild ID
     *
     * @returns {Promise<boolean>} A bool indicating if the player was removed
     */
    async removeConnection(guildId) {
        return await this.players.get(guildId)?.destroy();
    }
    ;
    /**
     * Get a least used node from poru instance
     *
     * @returns {Node[]} A array of nodes
     */
    get leastUsedNodes() {
        return [...this.nodes.values()]
            .filter((node) => node.isConnected)
            .sort((a, b) => a.penalties - b.penalties);
    }
    /**
     * Resolve a track from poru instance
     * @param {ResolveOptions} param0  ResolveOptions
     * @param {Node | undefined} node Node or undefined
     * @returns {Promise<Response>} The Response of the resolved tracks
     */
    async resolve({ query, source, requester }, node) {
        if (!this.isActivated)
            throw new Error(`You have to init poru in your ready event`);
        if (!node)
            node = this.leastUsedNodes[0];
        if (!node)
            throw new Error("No nodes are available.");
        const regex = /^https?:\/\//;
        if (regex.test(query)) {
            let response = await node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent(query)}`);
            return new Response_1.Response(response, requester);
        }
        else {
            let track = `${source || "ytsearch"}:${query}`;
            let response = await node.rest.get(`/v4/loadtracks?identifier=${encodeURIComponent(track)}`);
            return new Response_1.Response(response, requester);
        }
    }
    /**
     * Decode a track from poru instance
     * @param track String
     * @param node Node
     * @returns
     */
    async decodeTrack(track, node) {
        if (!node)
            node = this.leastUsedNodes[0];
        return node.rest.get(`/v4/decodetrack?encodedTrack=${encodeURIComponent(track)}`);
    }
    /**
     * Decode tracks from poru instance
     * @param tracks String[]
     * @param node Node
     * @returns
     */
    async decodeTracks(tracks, node) {
        return await node.rest.post(`/v4/decodetracks`, tracks);
    }
    /**
     * Get lavalink info from poru instance
     * @param name Node name
     * @returns
     */
    async getLavalinkInfo(name) {
        let node = this.nodes.get(name);
        return await node.rest.get(`/v4/info`);
    }
    /**
     * Get lavalink status from poru instance
     * @param name Node name
     * @returns
     */
    async getLavalinkStatus(name) {
        let node = this.nodes.get(name);
        return await node.rest.get(`/v4/stats`);
    }
    /* Temp removed
  
  async getLavalinkVersion(name:string){
    let node = this.nodes.get(name)
    return await node.rest.get(`/version`)
  
  }
  */
    /**
     * Get a player from poru instance
     * @param guildId Guild ID
     * @returns
     */
    get(guildId) {
        return this.players.get(guildId);
    }
}
exports.Poru = Poru;
//# sourceMappingURL=Poru.js.map