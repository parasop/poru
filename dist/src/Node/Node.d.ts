import { Poru, PoruOptions, NodeGroup } from "../Poru";
import WebSocket from "ws";
import { Rest } from "./Rest";
export interface NodeStats {
    players: number;
    playingPlayers: number;
    memory: {
        reservable: number;
        used: number;
        free: number;
        allocated: number;
    };
    frameStats: {
        sent: number;
        deficit: number;
        nulled: number;
    };
    cpu: {
        cores: number;
        systemLoad: number;
        lavalinkLoad: number;
    };
    uptime: number;
}
export declare class Node {
    isConnected: boolean;
    poru: Poru;
    readonly name: string;
    readonly restURL: string;
    readonly socketURL: string;
    password: string;
    readonly secure: boolean;
    readonly regions: Array<string>;
    sessionId: string;
    rest: Rest;
    ws: WebSocket | null;
    readonly resumeKey: string | null;
    readonly resumeTimeout: number;
    readonly autoResume: boolean;
    readonly reconnectTimeout: number;
    reconnectTries: number;
    reconnectAttempt: any;
    attempt: number;
    stats: NodeStats | null;
    options: NodeGroup;
    /**
     * The Node class that is used to connect to a lavalink node
     * @param poru Poru
     * @param node NodeGroup
     * @param options PoruOptions
     */
    constructor(poru: Poru, node: NodeGroup, options: PoruOptions);
    /**
     * Connects to the lavalink node
     * @returns {void}
     */
    connect(): void;
    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    send(payload: any): void;
    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    reconnect(): void;
    disconnect(): void;
    get penalties(): number;
    private open;
    private setStats;
    private message;
    private close;
    private error;
    getRoutePlannerStatus(): Promise<any>;
    unmarkFailedAddress(address: string): Promise<any>;
}
