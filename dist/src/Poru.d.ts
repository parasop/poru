/// <reference types="node" />
import { Node } from "./Node";
import { Player } from "./Player";
import { EventEmitter } from "events";
import { Response } from "./guild/Response";
import { Plugin } from "./Plugin";
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
export interface PoruOptions {
    plugins?: Plugin[];
    autoResume: boolean;
    library: string;
    defaultPlatform: string;
    resumeKey?: string;
    resumeTimeout?: number;
    reconnectTimeout?: number | null;
    reconnectTries?: number | null;
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
    getNodeByRegion(region: any): Node[];
    getNode(identifier?: string): Node | Node[];
    createConnection(options: any): Player;
    private createPlayer;
    removeConnection(guildId: any): void;
    get leastUsedNodes(): Node[];
    resolve({ query, source, requester }: ResolveOptions, node?: Node): Promise<Response>;
    decodeTrack(track: string, node: Node): Promise<unknown>;
    decodeTracks(tracks: string[], node: Node): Promise<unknown>;
    getLavalinkInfo(name: string): Promise<unknown>;
    getLavalinkStatus(name: string): Promise<unknown>;
    get(guildId: any): Player;
}
