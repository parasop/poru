/// <reference types="node" />
import { Node } from "./Node";
import { Player } from "./Player";
import { EventEmitter } from "events";
import { Response } from "./guild/Response";
import { Plugin } from "./Plugin";
import { Track } from "./guild/Track";
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
    autoResume: boolean;
    library: supportedLibraries;
    defaultPlatform: string;
    resumeKey?: string;
    resumeTimeout?: number;
    reconnectTimeout?: number | null;
    reconnectTries?: number | null;
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
    playerStart: (player: Player, track: Track) => void;
    /**
   * Emitted whenever track ends
   * @eventProperty
   */
    playerEnd: (player: Player, track: Track, LavalinkData?: unknown) => void;
    /**
    * Emitted when player compelete queue and going to disconnect
    * @eventProperty
    */
    playerDisconnect: (player: Player) => void;
    /**
   * Emitted when a track gets stuck while playing
   * @eventProperty
   */
    playerError: (player: Player, track: Track, data: any) => void;
    /**
    * Emitted when the websocket connection to Discord voice servers is closed
    * @eventProperty
    */
    playerClose: (player: Player, track: Track, data: any) => void;
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
    decodeTrack(track: string, node: Node): Promise<any>;
    decodeTracks(tracks: string[], node: Node): Promise<any>;
    getLavalinkInfo(name: string): Promise<any>;
    getLavalinkStatus(name: string): Promise<any>;
    get(guildId: string): Player;
}
