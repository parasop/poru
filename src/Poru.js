const { EventEmitter } = require("events");
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));const Player = require("./Player");
const Node = require("./Node");
const Response = require("./guild/Response");

class Poru extends EventEmitter {
    constructor(client, nodes, options = {}) {
        super();
        if (!client) throw new Error("[Poru Error] you did't provide a valid client");
        if (!nodes) throw new Error("[Poru Error] you did't provide a lavalink nodes");

        this.client = client;
        this.player = options.player || Player;
        this._nodes = nodes;
        this.nodes = new Map();
        this.players = new Map();
        this.voiceStates = new Map();
        this.voiceServers = new Map();
        this.user = null;
        this.shards = options.shards || 1;
        this.sendWS = null;
    }



    //create a node and connect it with lavalink
    createNode(options) {
        const node = new Node(this, options);
        if (options.name) {
            this.nodes.set(options.name || options.host, node);
            node.connect();
            return node;
        }
        this.nodes.set(options.host, node);
        node.connect();
        return node;
    }

    deleteNode(identifier){
        const node = this.nodes.get(identifier);
        if (!node) return;
        node.destroy();
        this.nodes.delete(identifier)
      }
    //create  connection with discord voice channel
    createConnection(data = {}, options = {}) {
        const player = this.players.get(data.guild.id || data.guild);
        if (player){
            return player;
        }
        this.sendWS({
            op: 4,
            d: {
                guild_id: data.guild.id || data.guild,
                channel_id: data.voiceChannel.id || data.voiceChannel,
                self_mute: options.selfMute || false,
                self_deaf: options.selfDeaf || true,
            },
        });
        return this.Player(data);
    }



    init(client) {

        this.user =client.user.id;
        this.sendWS = (data) => {
            const guild = client.guilds.cache.get(data.d.guild_id);
            if (guild) guild.shard.send(data);
        }
           // eslint-disable-next-line no-underscore-dangle
        this._nodes.forEach((node) => this.createNode(node));
        console.log(`Thanks for using Poru`)
    }

    voiceServersUpdate(data) {
        this.voiceServers.set(data.guild_id, data);
        return this.connectionProcess(data.guild_id);
    }

    voiceStateUpdate(data) {
        if (data.user_id !== this.user) return;
        if (data.channel_id) {
            this.voiceStates.set(data.guild_id, data);
            // eslint-disable-next-line consistent-return
            return this.connectionProcess(data.guild_id);
        }
        this.voiceServers.delete(data.guild_id);
        this.voiceStates.delete(data.guild_id);
    }

    packetUpdate(packet) {
        if (packet.t === "VOICE_SERVER_UPDATE"){ 
            this.voiceServersUpdate(packet.d);
        }

        if (packet.t === "VOICE_STATE_UPDATE"){
             this.voiceStateUpdate(packet.d);
        }
    }

    connectionProcess(guildId) {
        const server = this.voiceServers.get(guildId);
        const state = this.voiceStates.get(guildId);
        if (!server) return false;
        const player = this.players.get(guildId);
        if (!player) return false;

        player.connect({
            sessionId: state ? state.session_id : player.voiceUpdateState.sessionId,
            event: server,
        });
        return true;
    }


    get leastUsedNodes() {
        return [...this.nodes.values()]
            .filter((node) => node.isConnected)
            .sort((a, b) => {
                const aLoad = a.stats.cpu ? (a.stats.cpu.systemLoad / a.stats.cpu.cores) * 100 : 0;
                const bLoad = b.stats.cpu ? (b.stats.cpu.systemLoad / b.stats.cpu.cores) * 100 : 0;
                return aLoad - bLoad;
            });
    }

    Player(data) {
        const guild = data.guild.id || data.guild;
        const Nodes = this.nodes.get(guild);
        if (Nodes) return Nodes;
        if (this.leastUsedNodes.length === 0) throw new Error("No nodes are avaliable");
        const node = this.nodes.get(this.leastUsedNodes[0].name
            || this.leastUsedNodes[0].host);
        if (!node) throw new Error("No nodes are avalible");

        // eslint-disable-next-line new-cap
        const player = new this.player(node, data, this);
        this.players.set(guild, player);

        return player;
    }

    async search(track, source) {
        const node = this.leastUsedNodes[0];
        if (!node) throw new Error("No nodes are available.");
        const regex = /^https?:\/\//;
        if (!regex.test(track)) {
            // eslint-disable-next-line no-param-reassign
            track = `${source || "yt"}search:${track}`;
        }
        const result = await this.request(node, "loadtracks", `identifier=${encodeURIComponent(track)}`);
      //  this.emit("error", result);
        if (!result) throw new Error("No tracks found.");
        return new Response(result);
    }


    async resolve(track, source) {
        const node = this.leastUsedNodes[0];
        if (!node) throw new Error("No nodes are available.");
        const regex = /^https?:\/\//;
        if (!regex.test(track)) {
            // eslint-disable-next-line no-param-reassign
            track = `${source || "yt"}search:${track}`;
        }
        const result = await this.request(node, "loadtracks", `identifier=${encodeURIComponent(track)}`);
      //  this.emit("error", result);
        if (!result) throw new Error("No tracks found.");
        return new Response(result);
    }


    async decodeTrack(track) {
        const node = this.leastUsedNodes[0];
        if (!node) throw new Error("No nodes are available.");
        const result = await this.request(node, "decodetrack", `track=${track}`);
        this.emit("error", result);
        if (result.status === 500) return null;
        return result;
    }

    request(node, endpoint, param) {
        return fetch(`http${node.secure ? "s" : ""}://${node.host}:${node.port}/${endpoint}?${param}`, {
            headers: {
                Authorization: node.password,
            },
        })
            .then((r) => r.json())
            .catch((e) => {
                throw new Error(`[Poru Error] Failed to request to the lavalink.\n  error: ${e}`);
            });
    }

    get(guildId) {
        return this.players.get(guildId);
    }
}

module.exports = Poru