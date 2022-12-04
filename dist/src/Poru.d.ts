/// <reference types="node" />
import { Node } from "./Node";
import { Player } from "./Player";
import { EventEmitter } from "events";
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
    getNode(identifier?: string): Node;
    removeConnection(guildId: any): void;
}
