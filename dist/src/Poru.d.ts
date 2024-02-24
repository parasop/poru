/// <reference types="node" />
import { Node } from "./Node/Node";
import { Player } from "./Player/Player";
import { EventEmitter } from "events";
import { Response } from "./guild/Response";
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
}
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
    emit<K extends keyof PoruEvents>(event: K, ...args: Parameters<PoruEvents[K]>): boolean;
    off<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
}
export declare class Poru extends EventEmitter {
    readonly client: any;
    private readonly _nodes;
    options: PoruOptions;
    nodes: Map<string, Node>;
    players: Map<string, Player>;
    userId: string | null;
    version: Number;
    isActivated: boolean;
    send: Function | null;
    /**
     * This is the main class of Poru
     * @param client VoiceClient for Poru library to use to connect to lavalink node server (discord.js, eris, oceanic)
     * @param nodes Node
     * @param options PoruOptions
     * @returns Poru
     */
    constructor(client: any, nodes: NodeGroup[], options: PoruOptions);
    /**
     * This method is used to add a node to poru
     * @param client VoiceClient for Poru library to use to connect to lavalink node server (discord.js, eris, oceanic)
     * @returns void
     */
    init(client: any): this;
    /**
     * Voice State Update and Voice Server Update
     * @param {any} packet packet from discord api
     * @returns {void} void
     */
    packetUpdate(packet: any): void;
    /**
     * Add a node to poru instance
     * @param {NodeGroup} options NodeGroup
     * @returns {Node} Node
     */
    addNode(options: NodeGroup): Node;
    /**
     * Remove a node from poru instance
     * @param {string} identifier The Name of the node
     * @returns {boolean} A boolean indicating if the node was removed
     */
    removeNode(identifier: string): boolean;
    /**
     * Get a node from poru instance
     * @param {string} region Region of the node
     * @returns {Node[]} A array of nodes
     */
    getNodeByRegion(region: string): Node[];
    /**
     * Get a node from poru instance
     * @param {string?} identifier Node name
     * @returns {Node | Node[]} A Node or an array of nodes
     */
    getNode(identifier?: string): Node | Node[];
    /**
     * Creates a new player
     * @param {ConnectionOptions} options ConnectionOptions
     * @returns {Player} Returns the newly created player instance
     */
    createConnection(options: ConnectionOptions): Player;
    /**
     * Create a player from poru instance
     * @param {Node} node Node
     * @param {ConnectionOptions} options ConnectionOptions
     * @returns {Player} Returns the newly created player instance
     */
    private createPlayer;
    /**
     * Remove a player from poru instance
     * @param {string} guildId Guild ID
     *
     * @returns {Promise<boolean>} A bool indicating if the player was removed
     */
    removeConnection(guildId: string): Promise<boolean>;
    /**
     * Get a least used node from poru instance
     *
     * @returns {Node[]} A array of nodes
     */
    get leastUsedNodes(): Node[];
    /**
     * Resolve a track from poru instance
     * @param {ResolveOptions} param0  ResolveOptions
     * @param {Node | undefined} node Node or undefined
     * @returns {Promise<Response>} The Response of the resolved tracks
     */
    resolve({ query, source, requester }: ResolveOptions, node?: Node): Promise<Response>;
    /**
     * Decode a track from poru instance
     * @param track String
     * @param node Node
     * @returns
     */
    decodeTrack(track: string, node: Node): Promise<trackData>;
    /**
     * Decode tracks from poru instance
     * @param tracks String[]
     * @param node Node
     * @returns
     */
    decodeTracks(tracks: string[], node: Node): Promise<unknown>;
    /**
     * Get lavalink info from poru instance
     * @param name Node name
     * @returns
     */
    getLavalinkInfo(name: string): Promise<unknown>;
    /**
     * Get lavalink status from poru instance
     * @param name Node name
     * @returns
     */
    getLavalinkStatus(name: string): Promise<unknown>;
    /**
     * Get a player from poru instance
     * @param guildId Guild ID
     * @returns
     */
    get(guildId: string): Player;
}
