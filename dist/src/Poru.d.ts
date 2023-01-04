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
export declare interface Poru {
    /**
      * Emitted when data useful for debugging is produced
      * @eventProperty
      */
    on(event: 'debug', listener: (...args: any) => void): this;
    /**
     * Emitted when lavalink node is connected with poru
     * @eventProperty
     */
    on(event: 'nodeConnect', listener: (node: Node) => void): this;
    /**
    * Emitted when data useful for debugging is produced
    * @eventProperty
    */
    on(event: 'nodeDisconnect', listener: (node: Node) => void): this;
    /**
   * Emitted when poru try to reconnect with lavalink node while disconnected
   * @eventProperty
   */
    on(event: 'nodeReconnect', listener: (node: Node) => void): this;
    /**
   * Emitted when lavalink nodes get an error
   * @eventProperty
   */
    on(event: 'nodeError', listener: (node: Node, event: any) => void): this;
    /**
    * Emitted whenever player start playing new track
    * @eventProperty
    */
    on(event: 'playerStart', listener: (player: Player, track: Track) => void): this;
    /**
   * Emitted whenever track ends
   * @eventProperty
   */
    on(event: 'playerEnd', listener: (player: Player, track: Track) => void): this;
    /**
    * Emitted when player compelete queue and going to disconnect
    * @eventProperty
    */
    on(event: 'playerDisconnect', listener: (player: Player) => void): this;
    /**
   * Emitted when a track gets stuck while playing
   * @eventProperty
   */
    on(event: 'playerError', listener: (player: Player, track: Track, data: any) => void): this;
    /**
    * Emitted when the websocket connection to Discord voice servers is closed
    * @eventProperty
    */
    on(event: 'playerClose', listener: (player: Player, track: Track, data: any) => void): this;
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
    private packetUpdate;
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
