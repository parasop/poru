const { EventEmitter } = require("events");
const { fetch } = require('undici');
const Player = require("./Player");
const Node = require("./Node");
const Response = require("./guild/Response");
const Spotify = require("./platform/Spotify")
const AppleMusic = require("./platform/AppleMusic")
const Deezer = require("./platform/Deezer")
class Poru extends EventEmitter {
    constructor(client, nodes, options = {}) {
        super();
        if (!client) throw new Error("[Poru Error] you did't provide a valid client");
        if (!nodes) throw new Error("[Poru Error] you did't provide a lavalink nodes");
        if (!options) throw new Error("[Poru Error] options must be provided!")
        this.client = client;
        this._nodes = nodes;
        this.nodes = new Map();
        this.players = new Map();
        this.voiceStates = new Map();
        this.voiceServers = new Map();
        this.user = null;
        this.options = options
        this.shards = options.shards || 1;
        this.sendData = null;
    }



    //create a node and connect it with lavalink
    addNode(options) {
        const node = new Node(this, options, this.options);
        if (options.name) {
            this.nodes.set(options.name || options.host, node);
            node.connect();
            return node;
        }
        this.nodes.set(options.host, node);
        node.connect();
        return node;
    }

    //remove node and destroy web socket connection
    removeNode(identifier) {
        const node = this.nodes.get(identifier);
        if (!node) return;
        node.destroy();
        this.nodes.delete(identifier)
    }
    //create  connection with discord voice channel
    createConnection(data = {}) {
        const player = this.players.get(data.guild.id || data.guild);
        if (player) {
            return player;
        }
        this.sendData({
            op: 4,
            d: {
                guild_id: data.guild.id || data.guild,
                channel_id: data.voiceChannel.id || data.voiceChannel,
                self_mute: data.selfMute || false,
                self_deaf: data.selfDeaf || true,
            },
        });
        return this.#Player(data);
    }



    init(client) {

        this.user = client.user.id;
        this.sendData = (data) => {
            const guild = client.guilds.cache.get(data.d.guild_id);
            if (guild) guild.shard.send(data);
        }
        client.on("raw", async packet => {
            await this.packetUpdate(packet);
        })

        this._nodes.forEach((node) => this.addNode(node));


        if (this.options.spotify && this.options.spotify.clientID && this.options.spotify.clientSecret) {
            this.spotify = new Spotify(this, this.options)
        }
        if (this.options.apple) {
            if (!this.options.apple.playlistLimit) {
                throw new Error("[Poru Apple Music] playlistLimit must be provided")
            }
            this.apple = new AppleMusic(this, this.options)
        }
        if (this.options.deezer) {
            if (!this.options.deezer.playlistLimit) {
                throw new Error("[Poru Deezer Music] playlistLimit must be provided")

            }
            this.deezer = new Deezer(this, this.options)
       
        }
        console.log(`Thanks for using Poru`)
    }


    setServersUpdate(data) {
        let guild = data.guild_id
        this.voiceServers.set(guild, data);
        const server = this.voiceServers.get(guild);
        const state = this.voiceStates.get(guild);
        if (!server) return false;
        const player = this.players.get(guild);
        if (!player) return false;

        player.connect({
            sessionId: state ? state.session_id : player.voiceUpdateState.sessionId,
            event: server,
        });

        return true;
    }

    setStateUpdate(data) {
        if (data.user_id !== this.user) return;
        if (data.channel_id) {
            const guild = data.guild_id;

            this.voiceStates.set(data.guild_id, data);
            const server = this.voiceServers.get(guild);
            const state = this.voiceStates.get(guild);
            if (!server) return false;
            const player = this.players.get(guild);
            if (!player) return false;

            player.connect({
                sessionId: state ? state.session_id : player.voiceUpdateState.sessionId,
                event: server,
            });

            return true;
        }
        this.voiceServers.delete(data.guild_id);
        this.voiceStates.delete(data.guild_id);
    }

    packetUpdate(packet) {
        if (!['VOICE_STATE_UPDATE', 'VOICE_SERVER_UPDATE'].includes(packet.t)) return;
        const player = this.players.get(packet.d.guild_id);
        if (!player) return;

        if (packet.t === "VOICE_SERVER_UPDATE") {
            this.setServersUpdate(packet.d);
        }
        if (packet.t === "VOICE_STATE_UPDATE") {
            this.setStateUpdate(packet.d);
        }
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

    #Player(data) {
        const guild = data.guild.id || data.guild;
        const Nodes = this.nodes.get(guild);
        if (Nodes) return Nodes;
        if (this.leastUsedNodes.length === 0) throw new Error("[Poru Error] No nodes are avaliable");
        const node = this.nodes.get(this.leastUsedNodes[0].name
            || this.leastUsedNodes[0].host);
        if (!node) throw new Error("[Poru Error] No nodes are avalible");

        // eslint-disable-next-line new-cap
        const player = new Player(this, node, data);
        this.players.set(guild, player);
        player.connect()
        return player;
    }




    async resolve(track,source) {

        const node = this.leastUsedNodes[0];
        if (!node) throw new Error("No nodes are available.");

        if (this.spotify && this.spotify.check(track)) {
            return await this.spotify.resolve(track);
        }else if (this.apple && this.apple.check(track)) {
            return await this.apple.resolve(track);
        }else if (this.deezer && this.deezer.check(track)) {
            return await this.deezer.resolve(track);
        }



        const regex = /^https?:\/\//;
        if (!regex.test(track)) {
            // eslint-disable-next-line no-param-reassign
            track = `${source || "ytsearch"}:${track}`;
        }
        const result = await this.#fetch(node, "loadtracks", `identifier=${encodeURIComponent(track)}`);

        if (!result) throw new Error("[Poru Error] No tracks found.");
        return new Response(result);
    }


    async decodeTrack(track) {
        const node = this.leastUsedNodes[0];
        if (!node) throw new Error("No nodes are available.");
        const result = await this.#fetch(node, "decodetrack", `track=${track}`);
        if (result.status === 500) return null;
        return result;
    }

    #fetch(node, endpoint, param) {
        return fetch(`http${node.secure ? "s" : ""}://${node.host}:${node.port}/${endpoint}?${param}`, {
            headers: {
                Authorization: node.password,

            },
        })
            .then((r) => r.json())
            .catch((e) => {
                throw new Error(`[Poru Error] Failed to fetch from the lavalink.\n  error: ${e}`);
            });
    }

    get(guildId) {
        return this.players.get(guildId);
    }
}

module.exports = Poru
