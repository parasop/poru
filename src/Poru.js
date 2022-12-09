const { EventEmitter } = require("events");
const { fetch } = require("undici");
const config = require("./config");
const Player = require("./Player");
const Node = require("./Node");
const Response = require("./guild/Response");
const Spotify = require("./platform/Spotify");
const AppleMusic = require("./platform/AppleMusic");
const Deezer = require("./platform/Deezer");
class Poru extends EventEmitter {
  constructor(client, nodes, options = {}) {
    super();
    if (!client)
      throw new Error("[Poru Error] You didn't provide a valid client");
    if (!nodes)
      throw new Error("[Poru Error] You didn't provide a lavalink node");

    this.client = client;
    this._nodes = nodes;
    this.nodes = new Map();
    this.players = new Map();
    this.isActive = false;
    this.user = null;
    this.options = options;
    this.version = config.version;

    this.spotify = new Spotify(this, this.options);
    this.apple = new AppleMusic(this, this.options);
    this.deezer = new Deezer(this, this.options);
    this.sendData = null;

  }

  init(client) {
    if (this.isActive) return this;
    this.user = client.user.id;
    this.apple.requestToken();
    if (!this.options.library) this.options.library = "discord.js";

    if (config.libraries.discordjs.includes(this.options.library)) {
      this.sendData = (data) => {
        const guild = client.guilds.cache.get(data.d.guild_id);
        if (guild) guild.shard?.send(data);
      };

      client.on("raw", async (packet) => {
        await this.packetUpdate(packet);
      });

    } else if (config.libraries.eris.includes(this.options.library)) {
      
      this.sendData = (data) => {
        const guild = client.guilds.get(data.d.guild_id);
        if (guild) guild.shard.ws.send(JSON.stringify({ op: data?.op, d: data?.d}));
      };

      client.on("rawWS", async (packet) => {
        await this.packetUpdate(packet);
      });

    } else if (config.libraries.oceanic.includes(this.options.library)) {

      this.sendData = (data) => {
        const guild = client.guilds.get(data.d.guild_id);
        if (guild) guild.shard.send(data);
      };

      client.on("packet", async (packet) => {
        await this.packetUpdate(packet);
      });


    }



    this._nodes.forEach((node) => this.addNode(node));
    this.isActive = true;
  }

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

  removeNode(identifier) {
    if (!identifier)
      throw new Error(
        `[Poru Error] Provide identifier as a parameter of removeNode`
      );
    const node = this.nodes.get(identifier);
    if (!node) return;
    node.destroy();
    this.nodes.delete(identifier);
  }

  get leastUsedNodes() {
    return [...this.nodes.values()]
      .filter((node) => node.isConnected)
      .sort((a, b) => a.penalties - b.penalties)
  }


  getNodeByRegion(region) {
    return [...this.nodes.values()]
      .filter((node) => node.isConnected && node.regions.includes(region.toLowerCase()))
      .sort((a, b) => a.penalties - b.penalties)
  }


  getNode(identifier = "best") {
    if (!this.nodes.size) throw new Error(`No nodes avaliable currently`);

    if (identifier === "best") return this.leastUsedNodes;

    const node = this.nodes.get(identifier);
    if (!node) throw new Error("The node identifier you provided is not found");
    if (!node.isConnected) node.connect();
    return node;
  }


  checkConnection(options) {
    let { guildId, voiceChannel, textChannel, shardId } = options;
    if (!guildId)
      throw new Error(`[Poru Connection] you have to Provide guildId`);
    if (!voiceChannel)
      throw new Error(`[Poru Connection] you have to  Provide voiceChannel`);
    if (!textChannel)
      throw new Error(`[Poru Connection] you have to  Provide textChannel`);

    if (typeof guildId !== "string")
      throw new Error(`[Poru Connection] guildId must be provided as a string`);
    if (typeof voiceChannel !== "string")
      throw new Error(
        `[Poru Connection] voiceChannel must be provided as a string`
      );
    if (typeof textChannel !== "string")
      throw new Error(
        `[Poru Connection] textChannel must be provided as a string`
      );
  }

  createConnection(options) {

    this.checkConnection(options);
    const player = this.players.get(options.guildId);
    if (player) return player;

    if (this.leastUsedNodes.length === 0)
      throw new Error("[Poru Error] No nodes are avaliable");
    let node;
    if (options.region) {

      const region = this.getNodeByRegion(options.region)[0];
      node = this.nodes.get(region.name || this.leastUsedNodes[0].name || this.leastUsedNodes[0].host)
    } else {
      node = this.nodes.get(
        this.leastUsedNodes[0].name || this.leastUsedNodes[0].host
      );
    }
    if (!node) throw new Error("[Poru Error] No nodes are avalible");

    return this.#createPlayer(node, options);
  }

  removeConnection(guildId) {
    this.players.get(guildId)?.destroy();
  }

  #createPlayer(node, options) {
    if (this.players.has(options.guildId))
      return this.players.get(options.guildId);

    const player = new Player(this, node, options);
    this.players.set(options.guildId, player);
    player.connect(options);
    return player;
  }


  packetUpdate(packet) {
    if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t)) return;
    const player = this.players.get(packet.d.guild_id);
    if (!player) return;

    if (packet.t === "VOICE_SERVER_UPDATE") {
      player.connection.setServersUpdate(packet.d);
    }
    if (packet.t === "VOICE_STATE_UPDATE") {
      if (packet.d.user_id !== this.user) return;
      player.connection.setStateUpdate(packet.d);
    }
  }

  async resolve(query, source) {
    const node = this.leastUsedNodes[0];
    if (!node) throw new Error("No nodes are available.");
    const regex = /^https?:\/\//;

    if (regex.test(query)) {
      return this.fetchURL(node, query);
    } else {
      return this.fetchTrack(node, query, source);
    }
  }


  async fetchURL(node, track) {
    if (this.spotify.check(track)) {
      return await this.spotify.resolve(track);
    } else if (this.apple.check(track)) {
      return await this.apple.resolve(track);
    } else if (this.deezer.check(track)) {
      return await this.deezer.resolve(track);
    } else {
      const result = await this.#fetch(
        node,
        "loadtracks",
        `identifier=${encodeURIComponent(track)}`
      );
      if (!result) throw new Error("[Poru Error] No tracks found.");
      return new Response(result);
    }
  }

  async fetchTrack(node, query, source) {
    switch (source) {
      case "spotify": {
        return this.spotify.fetch(query);
      }
      case "applemusic": {
        return this.apple.fetch(query);
      }
      case "deezer": {
        return this.deezer.fetch(query);
      }
      default: {
        let track = `${source || "ytsearch"}:${query}`;
        const result = await this.#fetch(
          node,
          "loadtracks",
          `identifier=${encodeURIComponent(track)}`
        );
        if (!result) throw new Error("[Poru Error] No tracks found.");
        return new Response(result);
      }
    }
  }

  async decodeTrack(track) {
    const node = this.leastUsedNodes[0];
    if (!node) throw new Error("No nodes are available.");
    const result = await this.#fetch(node, "decodetrack", `track=${track}`);
    if (result.status === 500) return null;
    return result;
  }

  #fetch(node, endpoint, param) {
    return fetch(
      `http${node.secure ? "s" : ""}://${node.host}:${node.port
      }/${endpoint}?${param}`,
      {
        headers: {
          Authorization: node.password,
        },
      }
    )
      .then((r) => r.json())
      .catch((e) => {
        throw new Error(
          `[Poru Error] Failed to fetch from the lavalink.\n  error: ${e}`
        );
      });
  }

  get(guildId) {
    return this.players.get(guildId);
  }
}

module.exports = Poru;
