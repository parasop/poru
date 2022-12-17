import { Node } from "./Node";
import { Player } from "./Player";
import { EventEmitter } from "events";
import { Config as config } from "./config";
import { fetch } from "undici";
import { Response } from "./guild/Response";
export interface NodeGroup {
  name: string;
  host: string;
  port: number;
  password: string;
  secure?: boolean;
  region?: any;
}

export interface PoruOptions {  
  autoResume: boolean;
  library: string;
  defaultPlatform: string;
  resumeKey?: string;
  resumeTimeout?: number;
  reconnectTimeout?: number | null;
  reconnectTries?: number | null;
}

export interface PlayerOptions {

}

export class Poru extends EventEmitter {
  public readonly client: any;
  public readonly _nodes: NodeGroup[];

  public options: PoruOptions;
  public nodes: Map<string, Node>;
  public players: Map<string, Player>;

  public userId: string | null;
  public version: string;
  public isActivated: boolean;
  public send: Function | null;

  constructor(client: any, nodes: NodeGroup[], options: PoruOptions) {
    super();
    this.client = client;
    this._nodes = nodes;
    this.nodes = new Map();
    this.players = new Map();
    this.options = options;
    this.userId = null;
    this.version = config.version;
    this.isActivated = false;
    this.send = null;
  }

  public init(client: any) {
    if (this.isActivated) return this;
    this.userId = client.user.id;
    this._nodes.forEach((node) => this.addNode(node));
    this.isActivated = true;

    switch (this.options.library) {
      case "discord.js": {
        this.send = (packet: any) => {
          const guild = client.guilds.cache.get(packet.d.guild_id);
          if (guild) guild.shard?.send(packet);
        };
        client.on("raw", async (packet: any) => {
          await this.packetUpdate(packet);
        });
        break;
      }
      case "eris": {
        this.send = (packet: any) => {
          const guild = client.guilds.get(packet.d.guild_id);
          if (guild) guild.shard.sendWS(packet?.op, packet?.d);
        };

        client.on("rawWS", async (packet: any) => {
          await this.packetUpdate(packet);
        });
        break;
      }
      case "oceanic": {
        this.send = (packet: any) => {
          const guild = client.guilds.get(packet.d.guild_id);
          if (guild) guild.shard.send(packet);
        };

        client.on("packet", async (packet: any) => {
          await this.packetUpdate(packet);
        });
        break;
      }
    }
  }

  private packetUpdate(packet: any) {
    if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t))
      return;
    const player = this.players.get(packet.d.guild_id);
    if (!player) return;

    if (packet.t === "VOICE_SERVER_UPDATE") {
        player.connection.setServersUpdate(packet.d);
    }
    if (packet.t === "VOICE_STATE_UPDATE") {
      if (packet.d.user_id !== this.userId) return;
       player.connection.setStateUpdate(packet.d);
    }
  }

  public addNode(options: NodeGroup): Node {
    const node = new Node(this, options, this.options);
    this.nodes.set(options.name, node);
    node.connect();
    return node;
  }

  public removeNode(identifier: string) {
    const node = this.nodes.get(identifier);
    if (!node) return;
    node.disconnect();
    this.nodes.delete(identifier);
  }

  public getNodeByRegion(region) {
    return [...this.nodes.values()]
      .filter(
        (node) =>
          node.isConnected && node.regions.includes(region.toLowerCase())
      )
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

  getNode(identifier: string = "auto") {
    if (!this.nodes.size) throw new Error(`No nodes avaliable currently`);

    //  if (identifier === "auto") return this.leastUsedNodes;

    const node = this.nodes.get(identifier);
    if (!node) throw new Error("The node identifier you provided is not found");
    if (!node.isConnected) node.connect();
    return node;
  }

  public createConnection(options) {
    const player = this.players.get(options.guildId);
    if (player) return player;

    if (this.leastUsedNodes.length === 0)
      throw new Error("[Poru Error] No nodes are avaliable");
    let node;
    if (options.region) {
      const region = this.getNodeByRegion(options.region)[0];
      node = this.nodes.get(
        region.name ||
          this.leastUsedNodes[0].name);
    } else {
      node = this.nodes.get(
        this.leastUsedNodes[0].name);
    }
    if (!node) throw new Error("[Poru Error] No nodes are avalible");

    return this.createPlayer(node, options);
  }

  private createPlayer(node, options) {
    const player = new Player(this, node, options);
    this.players.set(options.guildId, player);
    player.connect(options);
    return player;
  
  
  }

  public removeConnection(guildId) {
    this.players.get(guildId)?.destroy();
  }

  get leastUsedNodes() {
    return [...this.nodes.values()]
      .filter((node) => node.isConnected)
      .sort((a, b) => a.penalties - b.penalties);
  }




async resolve(query, source) {
  const node = this.leastUsedNodes[0];
  if (!node) throw new Error("No nodes are available.");
  const regex = /^https?:\/\//;

  if (regex.test(query)) {
    return node.rest.resolveQuery(`/v3/loadtracks?identifier=${encodeURIComponent(query)}`)
  } else {
    let track = `${source || "ytsearch"}:${query}`;
    return node.rest.resolveQuery(`/v3/loadtracks?identifier=${encodeURIComponent(track)}`)
  }
}



async fetchURL(node, track) {
    const result = await this.#fetch(
      node,
      "loadtracks",
      `identifier=${encodeURIComponent(track)}`
    );
    if (!result) throw new Error("[Poru Error] No tracks found.");
    return new Response(result);
  
}

async fetchTrack(node, query, source) {
      let track = `${source || "ytsearch"}:${query}`;
      const result = await this.#fetch(
        node,
        "v3/loadtracks",
        `identifier=${encodeURIComponent(track)}`
      );
      if (!result) throw new Error("[Poru Error] No tracks found.");
      return new Response(result);
  
}


#fetch(node, endpoint, param) {
  return fetch(
    `${node.restURL}/${endpoint}?${param}`,
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


