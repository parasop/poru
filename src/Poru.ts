import { Node } from "./Node/Node";
import { Player } from "./Player/Player";
import { EventEmitter } from "events";
import { Config as config } from "./config";
import { Response, LoadTrackResponse } from "./guild/Response";
import { Plugin } from "./Plugin";
import { Track, trackData } from "./guild/Track";
import { Filters } from "./Player/Filters";

/**
 * @extends EventEmitter The main class of Poru
 */
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
    source?: supportedPlatforms | (string & {});
    requester?: any;
}

/**
 * @typedef {string} supportedLibraries
 */
export type supportedLibraries = "discord.js" | "eris" | "oceanic" | "other";
export type supportedPlatforms = "spsearch" | "dzsearch" | "amsearch" | "scsearch" | "ytsearch" | "ytmsearch";
export type TrackEndReason = 'finished' | 'loadFailed' | 'stopped' | 'replaced' | 'cleanup';
export type PlayerEventType = 'TrackStartEvent' | 'TrackEndEvent' | 'TrackExceptionEvent' | 'TrackStuckEvent' | 'WebSocketClosedEvent';

export interface PlayerEvent {
    op: 'event';
    type: PlayerEventType;
    guildId: string;
}

export interface TrackStartEvent extends PlayerEvent {
    type: 'TrackStartEvent';
    track: Track;
}

export interface TrackEndEvent extends PlayerEvent {
    type: 'TrackEndEvent';
    track: Track;
    reason: TrackEndReason;
}

export interface TrackStuckEvent extends PlayerEvent {
    type: 'TrackStuckEvent';
    track: Track;
    thresholdMs: number;
}

export interface TrackExceptionEvent extends PlayerEvent {
    type: 'TrackExceptionEvent';
    exception: any;
}

export interface WebSocketClosedEvent extends PlayerEvent {
    type: 'WebSocketClosedEvent';
    code: number;
    byRemote: boolean;
    reason: string;
};

/**
 * The event data
 * @typedef {TrackEndEvent | TrackStuckEvent | WebSocketClosedEvent | TrackStartEvent | TrackExceptionEvent} EventData
 */
export type EventData = TrackEndEvent | TrackStuckEvent | WebSocketClosedEvent | TrackStartEvent | TrackExceptionEvent;

export interface PoruOptions {
    plugins?: Plugin[];
    customPlayer?: Constructor<Player>;
    customFilter?: Constructor<Filters>;
    autoResume?: boolean;
    library: supportedLibraries;
    defaultPlatform?: supportedPlatforms;
    resumeKey?: string;
    resumeTimeout?: number;
    reconnectTimeout?: number | null;
    reconnectTries?: number | null;
    useCustomFilters?: boolean;
    send?: Function | null;
}

export interface ConnectionOptions {
    guildId: string;
    voiceChannel: string;
    textChannel: string;
    deaf?: boolean;
    mute?: boolean;
    region?: string;
}

export interface PoruEvents {
    /**
     * Emitted when data useful for debugging is produced
     * @eventProperty
     * @param args
     * @returns void
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
     * @param node
     * @param event
     * @returns void
     */
    nodeConnect: (node: Node) => void;

    /**
     * Emitted when data useful for debugging is produced
     * @eventProperty
     * @param node
     * @param event
     * @returns void
     */
    nodeDisconnect: (node: Node, event?: unknown) => void;

    /**
     * Emitted when poru try to reconnect with lavalink node while disconnected
     * @eventProperty
     * @param node
     * @returns void
     */
    nodeReconnect: (node: Node) => void;

    /**
     * Emitted when lavalink nodes get an error
     * @eventProperty
     * @param node
     * @param event
     * @returns void
     */
    nodeError: (node: Node, event: any) => void;

    /**
     * Emitted whenever player start playing new track
     * @eventProperty
     * @param player
     * @param track
     * @returns void
     * 
     */
    trackStart: (player: Player, track: Track) => void;

    /**
     * Emitted whenever track ends
     * @eventProperty
     * @param player
     * @param track
     * @param data
     * @returns void
     */
    trackEnd: (player: Player, track: Track, data: TrackEndEvent) => void;

    /**
     * Emitted when player's queue  is completed and going to disconnect
     * @eventProperty
     * @param player
     * @returns void
     * 
     */
    queueEnd: (player: Player) => void;

    /**
     * Emitted when a track gets stuck while playing
     * @eventProperty
     * @param player
     * @param track
     * @param data
     * @returns void
     */
    trackError: (player: Player, track: Track, data: TrackStuckEvent | TrackExceptionEvent) => void;

    /**
     * Emitted when a player got updates
     * @eventProperty
     * @param player
     * @returns void
     */
    playerUpdate: (player: Player) => void;

    /**
     * Emitted when a player got created
     * @eventProperty
     * @param player
     * @returns void
     */
    playerCreate: (player: Player) => void;

    /**
     * 
     * Emitted when a player destroy
     * @eventProperty
     * @param player
     * @returns void
     */
    playerDestroy: (player: Player) => void;

    /**
     * Emitted when the websocket connection to Discord voice servers is closed
     * @eventProperty
     * @param player
     * @param track
     * @param data
     * @returns void
     */
    socketClose: (player: Player, track: Track, data: WebSocketClosedEvent) => void;
}

/**
 * @extends EventEmitter
 * @interface Poru
 * @param {PoruOptions} options
 * @param {NodeGroup[]} nodes
 * @param {string} userId
 * @param {string} version
 * @param {boolean} isActivated
 * @param {Function} send
 * @param {Map<string, Node>} nodes
 * @param {Map<string, Player>} players
 * @returns Poru
 */
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
    private readonly _nodes: NodeGroup[];
    public options: PoruOptions;
    public nodes: Map<string, Node>;
    public players: Map<string, Player>;
    public userId: string | null;
    public version: Number;
    public isActivated: boolean;
    public send: Function | null;

    /**
     * This is the main class of Poru
     * @param client VoiceClient for Poru library to use to connect to lavalink node server (discord.js, eris, oceanic)
     * @param nodes Node
     * @param options PoruOptions
     * @returns Poru
     */
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
    /**
     * This method is used to add a node to poru
     * @param client VoiceClient for Poru library to use to connect to lavalink node server (discord.js, eris, oceanic)
     * @returns void
     */
    public init(client: any) {
        if (this.isActivated) return this;
        this.userId = client.user.id;
        this._nodes.forEach((node) => this.addNode(node));
        this.isActivated = true;

        if (this.options.plugins) {
            this.options.plugins.forEach((plugin) => {

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
                    this.packetUpdate(packet);
                });
                break;
            }
            case "eris": {
                this.send = (packet: any) => {
                    const guild = client.guilds.get(packet.d.guild_id);
                    if (guild) guild.shard.sendWS(packet?.op, packet?.d);
                };

                client.on("rawWS", async (packet: any) => {
                    this.packetUpdate(packet);
                });
                break;
            }
            case "oceanic": {
                this.send = (packet: any) => {
                    const guild = client.guilds.get(packet.d.guild_id);
                    if (guild) guild.shard.send(packet?.op, packet?.d);
                };

                client.on("packet", async (packet: any) => {
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

    /**
     * Add a node to poru instance
     * @param {NodeGroup} options NodeGroup
     * @returns {Node} Node
     */
    public addNode(options: NodeGroup): Node {
        const node = new Node(this, options, this.options);
        this.nodes.set(options.name, node);
        node.connect();
        return node;
    }

    /**
     * Remove a node from poru instance
     * @param {string} identifier The Name of the node
     * @returns {boolean} A boolean indicating if the node was removed
     */
    public removeNode(identifier: string): boolean {
        const node = this.nodes.get(identifier);
        if (!node) return;
        node.disconnect();
        return this.nodes.delete(identifier);
    }

    /**
     * Get a node from poru instance
     * @param {string} region Region of the node
     * @returns {Node[]} A array of nodes
     */
    public getNodeByRegion(region: string): Node[] {
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

    /**
     * Get a node from poru instance
     * @param {string?} identifier Node name
     * @returns {Node | Node[]} A Node or an array of nodes
     */
    public getNode(identifier: string = "auto"): Node | Node[] {
        if (!this.nodes.size) throw new Error(`No nodes available currently`);

        if (identifier === "auto") return this.leastUsedNodes;

        const node = this.nodes.get(identifier);
        if (!node) throw new Error("The node identifier you provided is not found");
        if (!node.isConnected) node.connect();
        return node;
    }

    /**
     * Creates a new player
     * @param {ConnectionOptions} options ConnectionOptions
     * @returns {Player} Returns the newly created player instance
     */
    public createConnection(options: ConnectionOptions): Player {
        if (!this.isActivated)
            throw new Error(`You have to init poru in your ready event`);
        const player = this.players.get(options.guildId);
        if (player) return player;

        if (this.leastUsedNodes.length === 0)
            throw new Error("[Poru Error] No nodes are available");
        let node: Node;

        if (options.region) {
            const region = this.getNodeByRegion(options.region)[0];
            node = this.nodes.get(region.name || this.leastUsedNodes[0].name);
        } else {
            node = this.nodes.get(this.leastUsedNodes[0].name);
        }
        if (!node) throw new Error("[Poru Error] No nodes are available");

        return this.createPlayer(node, options);
    }

    /**
     * Create a player from poru instance
     * @param {Node} node Node
     * @param {ConnectionOptions} options ConnectionOptions
     * @returns {Player} Returns the newly created player instance
     */
    private createPlayer(node: Node, options: ConnectionOptions): Player {
        let player: Player;
        if (this.options.customPlayer) {
            player = new this.options.customPlayer(this, node, options);
        } else {
            player = new Player(this, node, options);
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
    public async removeConnection(guildId: string): Promise<boolean> {
        return await this.players.get(guildId)?.destroy();
    };

    /**
     * Get a least used node from poru instance
     * 
     * @returns {Node[]} A array of nodes
     */
    get leastUsedNodes(): Node[] {
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
    public async resolve({ query, source, requester }: ResolveOptions, node?: Node): Promise<Response> {
        if (!this.isActivated)
            throw new Error(`You have to init poru in your ready event`);

        if (!node) node = this.leastUsedNodes[0];
        if (!node) throw new Error("No nodes are available.");
        const regex = /^https?:\/\//;

        if (regex.test(query)) {
            let response = await node.rest.get<LoadTrackResponse>(
                `/v4/loadtracks?identifier=${encodeURIComponent(query)}`
            );
            return new Response(response, requester);
        } else {
            let track = `${source || "ytsearch"}:${query}`;
            let response = await node.rest.get<LoadTrackResponse>(
                `/v4/loadtracks?identifier=${encodeURIComponent(track)}`
            );
            return new Response(response, requester);
        }
    }

    /**
     * Decode a track from poru instance
     * @param track String
     * @param node Node
     * @returns 
     */
    public async decodeTrack(track: string, node: Node) {
        if (!node) node = this.leastUsedNodes[0];

        return node.rest.get<trackData>(
            `/v4/decodetrack?encodedTrack=${encodeURIComponent(track)}`
        );
    }

    /**
     * Decode tracks from poru instance
     * @param tracks String[]
     * @param node Node
     * @returns 
     */
    public async decodeTracks(tracks: string[], node: Node) {
        return await node.rest.post(`/v4/decodetracks`, tracks);
    }

    /**
     * Get lavalink info from poru instance
     * @param name Node name
     * @returns 
     */
    public async getLavalinkInfo(name: string) {
        let node = this.nodes.get(name);
        return await node.rest.get(`/v4/info`);
    }

    /**
     * Get lavalink status from poru instance
     * @param name Node name
     * @returns 
     */
    public async getLavalinkStatus(name: string) {
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
    get(guildId: string) {
        return this.players.get(guildId);
    }
}