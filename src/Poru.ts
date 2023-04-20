import { Node } from "./Node/Node";
import { Player } from "./Player/Player";
import { EventEmitter } from "events";
import { Config as config } from "./config";
import { Response } from "./guild/Response";
import { Plugin } from "./Plugin";
import { Track } from "./guild/Track";
import { Filters } from "./Player/Filters";

export type Constructor<T> = new (...args: any[]) => T;

export interface NodeGroup {
  name: string;
  host: string;
  port: number;
  password: string;
  secure?: boolean;
  region?: string[];
}

export interface ResolveOptions {
  query: string;
  source?: string;
  requester?: any;
}

export type supportedLibraries = "discord.js" | "eris" | "oceanic" | "other";

export interface PoruOptions {
  plugins?: Plugin[];
  customPlayer?: Constructor<Player>;
  customFilter?: Constructor<Filters>;
  autoResume: boolean;
  library: supportedLibraries;
  defaultPlatform: string;
  resumeKey?: string;
  resumeTimeout?: number;
  reconnectTimeout?: number | null;
  reconnectTries?: number | null;
  useCustomFilters?: boolean;
  send: Function | null;
}

export interface ConnectionOptions {
  guildId: string;
  voiceChannel: string;
  textChannel: string;
  deaf: boolean;
  mute: boolean;
  region?: string;
}

export interface PoruEvents {
  /**
   * Emitted when data useful for debugging is produced
   * @eventProperty
   */
  debug: (...args: any) => void;

  /**
   *
   * @param topic from what section the event come
   * @param args
   * Emitted when a Response is come
   * @eventProperty
   */
  raw: (topic: string, ...args: unknown[]) => void;

  /**
   * Emitted when lavalink node is connected with poru
   * @eventProperty
   */
  nodeConnect: (node: Node) => void;

  /**
   * Emitted when data useful for debugging is produced
   * @eventProperty
   */
  nodeDisconnect: (node: Node, event?: unknown) => void;

  /**
   * Emitted when poru try to reconnect with lavalink node while disconnected
   * @eventProperty
   */
  nodeReconnect: (node: Node) => void;

  /**
   * Emitted when lavalink nodes get an error
   * @eventProperty
   */
  nodeError: (node: Node, event: any) => void;

  /**
   * Emitted whenever player start playing new track
   * @eventProperty
   */
  trackStart: (player: Player, track: Track) => void;

  /**
   * Emitted whenever track ends
   * @eventProperty
   */
  trackEnd: (player: Player, track: Track, LavalinkData?: unknown) => void;

  /**
   * Emitted when player's queue  is compeleted and going to disconnect
   * @eventProperty
   */
  queueEnd: (player: Player) => void;

  /**
   * Emitted when a track gets stuck while playing
   * @eventProperty
   */
  trackError: (player: Player, track: Track, data: any) => void;

  /**
   * Emitted when a player got updates
   * @eventProperty
   */
  playerUpdate: (player: Player) => void;

  /**
   * Emitted when a player destroy
   * @eventProperty
   */
  playerDestroy: (player: Player) => void;

  /**
   * Emitted when the websocket connection to Discord voice servers is closed
   * @eventProperty
   */
  socketClose: (player: Player, track: Track, data: any) => void;
}

export declare interface Poru {
  on<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
  once<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
  emit<K extends keyof PoruEvents>(
    event: K,
    ...args: Parameters<PoruEvents[K]>
  ): boolean;
  off<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
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

    if (this.options.plugins) {
      this.options.plugins.forEach((plugin) => {
        if (!(plugin instanceof Plugin))
          throw new RangeError(
            `Some of your Plugin does not extend Poru's Plugin.`
          );

        plugin.load(this);
      });
    }
    if (!this.options.library) this.options.library = "discord.js";

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
          if (guild) guild.shard.send(packet?.op, packet?.d);
        };

        client.on("packet", async (packet: any) => {
          await this.packetUpdate(packet);
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

  public packetUpdate(packet: any) {
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

  public getNodeByRegion(region: string) {
    return [...this.nodes.values()]
      .filter(
        (node) =>
          node.isConnected && node.regions?.includes(region?.toLowerCase())
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

    if (identifier === "auto") return this.leastUsedNodes;

    const node = this.nodes.get(identifier);
    if (!node) throw new Error("The node identifier you provided is not found");
    if (!node.isConnected) node.connect();
    return node;
  }

  public createConnection(options: ConnectionOptions): Player {
    if (!this.isActivated)
      throw new Error(`You have to init poru in your ready event`);
    const player = this.players.get(options.guildId);
    if (player) return player;

    if (this.leastUsedNodes.length === 0)
      throw new Error("[Poru Error] No nodes are avaliable");
    let node;

    if (options.region) {
      const region = this.getNodeByRegion(options.region)[0];
      node = this.nodes.get(region.name || this.leastUsedNodes[0].name);
    } else {
      node = this.nodes.get(this.leastUsedNodes[0].name);
    }
    if (!node) throw new Error("[Poru Error] No nodes are avalible");

    return this.createPlayer(node, options);
  }

  private createPlayer(node: Node, options: ConnectionOptions) {
    let player;
    if (this.options.customPlayer) {
      player = new this.options.customPlayer(this, node, options);
    } else {
      player = new Player(this, node, options);
    }

    this.players.set(options.guildId, player);
    player.connect(options);
    return player;
  }

  public removeConnection(guildId: string) {
    this.players.get(guildId)?.destroy();
  }

  get leastUsedNodes() {
    return [...this.nodes.values()]
      .filter((node) => node.isConnected)
      .sort((a, b) => a.penalties - b.penalties);
  }

  async resolve({ query, source, requester }: ResolveOptions, node?: Node) {
    if (!this.isActivated)
      throw new Error(`You have to init poru in your ready event`);

    if (!node) node = this.leastUsedNodes[0];
    if (!node) throw new Error("No nodes are available.");
    const regex = /^https?:\/\//;

    if (regex.test(query)) {
      let response = await node.rest.get(
        `/v3/loadtracks?identifier=${encodeURIComponent(query)}`
      );
      return new Response(response, requester);
    } else {
      let track = `${source || "ytsearch"}:${query}`;
      let response = await node.rest.get(
        `/v3/loadtracks?identifier=${encodeURIComponent(track)}`
      );
      return new Response(response, requester);
    }
  }

  async decodeTrack(track: string, node: Node) {
    if (!node) node = this.leastUsedNodes[0];

    return node.rest.get(
      `/v3/decodetrack?encodedTrack=${encodeURIComponent(track)}`
    );
  }

  async decodeTracks(tracks: string[], node: Node) {
    return await node.rest.post(`/v3/decodetracks`, tracks);
  }

  async getLavalinkInfo(name: string) {
    let node = this.nodes.get(name);
    return await node.rest.get(`/v3/info`);
  }

  async getLavalinkStatus(name: string) {
    let node = this.nodes.get(name);
    return await node.rest.get(`/v3/stats`);
  }

  /* Temp removed

async getLavalinkVersion(name:string){
  let node = this.nodes.get(name)
  return await node.rest.get(`/version`)

}
*/

  get(guildId: string) {
    return this.players.get(guildId);
  }
}
