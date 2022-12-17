/// <reference types="node" />
import { Node } from "./Node";
import { Player } from "./Player";
import { EventEmitter } from "events";
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
export declare class Poru extends EventEmitter {
    #private;
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
    getNode(identifier?: string): Node;
    createConnection(options: any): Player;
    private createPlayer;
    removeConnection(guildId: any): void;
    get leastUsedNodes(): Node[];
    resolve(query: any, source: any): Promise<unknown>;
    fetchURL(node: any, track: any): Promise<Response>;
    fetchTrack(node: any, query: any, source: any): Promise<Response>;
    get(guildId: any): Player;
}
