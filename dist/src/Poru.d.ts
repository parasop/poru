/// <reference types="node" />
import { Node } from "./Node/Node";
import { Player } from "./Player/Player";
import { EventEmitter } from "events";
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
    emit<K extends keyof PoruEvents>(event: K, ...args: Parameters<PoruEvents[K]>): boolean;
    off<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
}
export declare class Poru extends EventEmitter {
    readonly client: any;
    readonly _nodes: NodeGroup[];
    options: PoruOptions;
    nodes: Map<string, Node>;
    players: Map<string, Player>;
    userId: string | null;
    version: string;
    isActivated: boolean;
    send: Function | null;
    constructor(client: any, nodes: NodeGroup[], options: PoruOptions);
    init(client: any): this;
    packetUpdate(packet: any): void;
    addNode(options: NodeGroup): Node;
    removeNode(identifier: string): void;
    getNodeByRegion(region: string): Node[];
    getNode(identifier?: string): Node | Node[];
    createConnection(options: ConnectionOptions): Player;
    private createPlayer;
    removeConnection(guildId: string): void;
    get leastUsedNodes(): Node[];
    resolve({ query, source, requester }: ResolveOptions, node?: Node): Promise<Response>;
    decodeTrack(track: string, node: Node): Promise<unknown>;
    decodeTracks(tracks: string[], node: Node): Promise<unknown>;
    getLavalinkInfo(name: string): Promise<unknown>;
    getLavalinkStatus(name: string): Promise<unknown>;
    get(guildId: string): Player;
}
