/// <reference types="node" />
import { Poru, PoruOptions, NodeGroup } from "../Poru";
import WebSocket from "ws";
import { Rest } from "./Rest";
import { Severity } from "../guild/Response";
export interface NodeStats {
    players: number;
    playingPlayers: number;
    uptime: number;
    memory: {
        free: number;
        used: number;
        allocated: number;
        reservable: number;
    };
    cpu: {
        cores: number;
        systemLoad: number;
        lavalinkLoad: number;
    };
    frameStats: {
        sent: number;
        nulled: number;
        deficit: number;
    } | null;
}
export type NodeLinkV2LoadTypes = "short" | "album" | "artist" | "show" | "episode" | "station" | "podcast";
export type NodeLinkGetLyrics = NodeLinkGetLyricsSingle | NodeLinkGetLyricsMultiple | NodeLinkGetLyricsEmpty | NodeLinkGetLyricsError;
export interface NodeLinkGetLyricsMultiple {
    loadType: "lyricsMultiple";
    data: NodeLinkGetLyricsData[];
}
export interface NodeLinkGetLyricsEmpty {
    loadType: "empty";
    data: {};
}
interface NodeLinkGetLyricsData {
    name: string;
    synced: boolean;
    data: {
        startTime?: number;
        endTime?: number;
        text: string;
    }[];
    rtl: boolean;
}
export interface NodeLinkGetLyricsSingle {
    loadType: "lyricsSingle";
    data: NodeLinkGetLyricsData;
}
export interface NodeLinkGetLyricsError {
    loadType: "error";
    data: {
        message: string;
        severity: Severity;
        cause: string;
        trace?: string;
    };
}
/**
 * This interface represents the LavaLink V4 Error Responses
 * @reference https://lavalink.dev/api/rest.html#error-responses
 */
export interface ErrorResponses {
    /**
     * The timestamp of the error in milliseconds since the Unix epoch
     */
    timestamp: number;
    /**
     * The HTTP status code
     */
    status: number;
    /**
     * The HTTP status code message
     */
    error: string;
    /**
     * The stack trace of the error when trace=true as query param has been sent
     * @optional
     */
    trace?: string;
    /**
     * The error message
     */
    message: string;
    /**
     * The path of the request
     */
    path: string;
}
export declare class Node {
    readonly name: string;
    isConnected: boolean;
    poru: Poru;
    readonly restURL: string;
    readonly socketURL: string;
    password: string;
    readonly secure: boolean;
    readonly regions: Array<string> | null;
    sessionId: string | null;
    rest: Rest;
    ws: WebSocket | null;
    readonly resumeKey: string | null;
    readonly resumeTimeout: number;
    readonly autoResume: boolean;
    readonly reconnectTimeout: number;
    reconnectTries: number;
    reconnectAttempt: NodeJS.Timeout | null;
    attempt: number;
    stats: NodeStats;
    options: NodeGroup;
    clientName: string;
    isNodeLink: boolean;
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
    connect(): Promise<boolean>;
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
    reconnect(): Promise<void>;
    /**
     * This function will make the node disconnect
     * @returns {Promise<void>} void
     */
    disconnect(): Promise<void>;
    /**
     * This function will get the penalties from the current node
     * @returns {number} The amount of penalties
     */
    get penalties(): number;
    /**
     * This function will get the RoutePlanner status
     * @returns {Promise<null>}
     */
    getRoutePlannerStatus(): Promise<null | ErrorResponses>;
    /**
     * This function will Unmark a failed address
     * @param {string} address The address to unmark as failed. This address must be in the same ip block.
     * @returns {null | ErrorResponses} This function will most likely error if you havn't enabled the route planner
     */
    unmarkFailedAddress(address: string): Promise<null | ErrorResponses>;
    /**
     * This function will get the upgrade event from the ws connection
     * @param {IncomingMessage} request The request from the upgraded WS connection
     */
    private upgrade;
    /**
     * This function will open up again the node
     * @returns {Promise<void>} The Promise<void>
     */
    private open;
    /**
     * This will send a message to the node
     * @param {string} payload The sent payload we recieved in stringified form
     * @returns {Promise<void>} Return void
     */
    private message;
    /**
     * This will close the connection to the node
     * @param {any} event any
     * @returns {void} void
     */
    private close;
    /**
     * This function will emit the error so that the user's listeners can get them and listen to them
     * @param {any} event any
     * @returns {void} void
     */
    private error;
}
export {};
