import { Poru, PoruOptions, NodeGroup, EventData } from "../Poru";
import WebSocket from "ws";
import { Config as config } from "../config";
import { Rest } from "./Rest";
import { IncomingMessage } from "http";
import { LavaLinkLoadTypes, Severity } from "../guild/Response";

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
};

export type NodeLinkV2LoadTypes = "short" | "album" | "artist" | "show" | "episode" | "station" | "podcast" 
  
export type NodeLinkGetLyrics = NodeLinkGetLyricsSingle | NodeLinkGetLyricsMultiple | NodeLinkGetLyricsEmpty | NodeLinkGetLyricsError;

export interface NodeLinkGetLyricsMultiple {
    loadType: "lyricsMultiple";
    data: NodeLinkGetLyricsData[]
};

export interface NodeLinkGetLyricsEmpty {
    loadType: "empty",
    data: {}
};

interface NodeLinkGetLyricsData {
    name: string;
    synced: boolean;
    data: {
        startTime?: number;
        endTime?: number;
        text: string;
    }[];
    rtl: boolean;
};

export interface NodeLinkGetLyricsSingle {
    loadType: "lyricsSingle",
    data: NodeLinkGetLyricsData
};

export interface NodeLinkGetLyricsError {
    loadType: "error",
    data: {
        message: string;
        severity: Severity;
        cause: string;
        trace?: string;
    }
};

/**
 * Dispatched when you successfully connect to the Lavalink node
 */
interface LavalinkReadyPacket {
    op: "ready";
    resumed: boolean;
    sessionId: string;
};

/**
 * Dispatched every x seconds with the latest player state
 */
interface LavalinkPlayerUpdatePacket {
    op: "playerUpdate";
    guildId: string;
    state: {
        time: number;
        position: number;
        connected: true;
        ping: number;
    };
};

/**
 * Dispatched when the node sends stats once per minute
 */
interface LavalinkNodeStatsPacket extends NodeStats {
    op: "stats";
};

/**
 * Dispatched when player or voice events occur
 */
type LavalinkEventPacket = { op: "event"; guildId: string; } & EventData;

type LavalinkPackets = LavalinkReadyPacket | LavalinkPlayerUpdatePacket | LavalinkNodeStatsPacket | LavalinkEventPacket

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
};

export class Node {
    public readonly name: string;
    public isConnected: boolean;
    public poru: Poru;
    public readonly restURL: string;
    public readonly socketURL: string;
    public password: string;
    public readonly secure: boolean;
    public readonly regions: Array<string> | null;
    public sessionId: string | null;
    public rest: Rest;
    public ws: WebSocket | null;
    public readonly resumeKey: string | null;
    public readonly resumeTimeout: number;
    public readonly autoResume: boolean;
    public readonly reconnectTimeout: number;
    public reconnectTries: number;
    public reconnectAttempt: NodeJS.Timeout | null;
    public attempt: number;
    public stats: NodeStats;
    public options: NodeGroup;
    public clientName: string;
    public isNodeLink: boolean

    /**
     * The Node class that is used to connect to a lavalink node
     * @param poru Poru
     * @param node NodeGroup
     * @param options PoruOptions
     */
    constructor(poru: Poru, node: NodeGroup, options: PoruOptions) {
        this.name = node.name
        this.poru = poru;
        this.options = node;
        this.secure = node.secure || false;
        this.restURL = `http${node.secure ? "s" : ""}://${node.host}:${node.port}`;
        this.socketURL = `${node.secure ? "wss" : "ws"}://${node.host}:${node.port}/v4/websocket`;
        this.password = node.password || "youshallnotpass";
        this.regions = node.region || null;
        this.sessionId = null;
        this.rest = new Rest(poru, this);
        this.ws = null;
        this.resumeKey = options.resumeKey || null;
        this.resumeTimeout = options.resumeTimeout || 60;
        this.autoResume = options.autoResume || false;
        this.reconnectTimeout = options.reconnectTimeout || 5000;
        this.reconnectTries = options.reconnectTries || 5;
        this.reconnectAttempt = null;
        this.attempt = 0;
        this.isConnected = false;
        this.clientName = options.clientName || `${config.clientName}/${config.version}`;
        this.isNodeLink = false;
        this.stats = {
            players: 0,
            playingPlayers: 0,
            uptime: 0,
            memory: {
                free: 0,
                used: 0,
                allocated: 0,
                reservable: 0,
            },
            cpu: {
                cores: 0,
                systemLoad: 0,
                lavalinkLoad: 0,
            },
            frameStats: {
                sent: 0,
                nulled: 0,
                deficit: 0,
            }
        }
    };

    /**
     * Connects to the lavalink node
     * @returns {void}
     */
    public async connect(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isConnected) return resolve(true);
            if (this.ws) this.ws.close();
            if (!this.poru.nodes.get(this.options.name)) {
                this.poru.nodes.set(this.options.name, this)
            };
            if (!this.poru.userId) throw new Error("[Poru Error] No user id found in the Poru instance. Consider using a supported library.")

            const headers: { [key: string]: string } = {
                Authorization: this.password,
                "User-Id": this.poru.userId,
                "Client-Name": this.clientName,
            };

            if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;

            this.ws = new WebSocket(`${this.socketURL}`, { headers });
            this.ws.on("open", this.open.bind(this));
            this.ws.on("error", this.error.bind(this));
            this.ws.on("message", this.message.bind(this));
            this.ws.on("close", this.close.bind(this));
            this.ws.on("upgrade", (request) => this.upgrade(request))
            resolve(true);
        })
    };

    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    public send(payload: any): void {
        if (!this.isConnected || !this.ws) throw new Error("[Poru Error] The node is not connected");
        const data = JSON.stringify(payload);
        this.ws.send(data, (error: any) => {
            if (error) return error;
            return null;
        });
    }

    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    public async reconnect(): Promise<void> {
        this.reconnectAttempt = setTimeout(async () => {
            if (this.attempt > this.reconnectTries) {
                throw new Error(
                    `[Poru Websocket] Unable to connect with ${this.options.name} node after ${this.reconnectTries} tries`
                );
            }

            // Delete the ws instance
            this.isConnected = false;
            this.ws?.removeAllListeners();
            this.ws = null;

            // Try to reconnect
            this.poru.emit("nodeReconnect", this);
            await this.connect();
            this.attempt++;

        }, this.reconnectTimeout);
    };

    /**
     * This function will make the node disconnect
     * @returns {Promise<void>} void
     */
    public async disconnect(): Promise<void> {
        if (!this.isConnected) return;

        this.poru.players.forEach(async (player) => {
            if (player.node == this) {
                await player.autoMoveNode();
            };
        });

        this.ws?.close(1000, "destroy");
        this.ws?.removeAllListeners();
        this.ws = null;
        this.poru.nodes.delete(this.options.name);
        this.poru.emit("nodeDisconnect", this);
    };

    /**
     * This function will get the penalties from the current node
     * @returns {number} The amount of penalties
     */
    public get penalties(): number {
        let penalties = 0;

        if (!this.isConnected) return penalties;

        penalties += this.stats?.players ?? 0;
        penalties += Math.round(Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10);

        if (this.stats.frameStats) {
            penalties += this.stats.frameStats.deficit;
            penalties += this.stats.frameStats.nulled * 2;
        };

        return penalties;
    };

    /**
     * This function will get the RoutePlanner status
     * @returns {Promise<null>}
     */
    public async getRoutePlannerStatus(): Promise<null | ErrorResponses> {
        if (this.isNodeLink) return {
            timestamp: Date.now(),
            status: 404,
            error: "Not found.",
            message: "The specified node is a NodeLink. NodeLink's do not have the routeplanner feature.",
            path: "/v4/routeplanner/status",
            trace: new Error().stack
        } satisfies ErrorResponses;

        return await this.rest.get<null | ErrorResponses>(`/v4/routeplanner/status`)
    };

    /**
     * This function will Unmark a failed address
     * @param {string} address The address to unmark as failed. This address must be in the same ip block.
     * @returns {null | ErrorResponses} This function will most likely error if you havn't enabled the route planner
     */
    public async unmarkFailedAddress(address: string): Promise<null | ErrorResponses> {
        if (this.isNodeLink) return {
            timestamp: Date.now(),
            status: 404,
            error: "Not found.",
            message: "The specified node is a NodeLink. NodeLink's do not have the routeplanner feature.",
            path: "/v4/routeplanner/free/address",
            trace: new Error().stack
        } satisfies ErrorResponses;

        return this.rest.post<null | ErrorResponses>(`/v4/routeplanner/free/address`, { address })
    };

    /**
     * This function will get the upgrade event from the ws connection
     * @param {IncomingMessage} request The request from the upgraded WS connection
     */
    private upgrade(request: IncomingMessage) {
        // Checking if this node is a NodeLink or not
        this.isNodeLink = this.options.isNodeLink ?? Boolean(request.headers.isnodelink) ?? false;
    };

    /**
     * This function will open up again the node
     * @returns {Promise<void>} The Promise<void>
     */
    private async open(): Promise<void> {
        try {
            if (this.reconnectAttempt) {
                clearTimeout(this.reconnectAttempt);
                this.reconnectAttempt = null;
            };
    
            this.poru.emit("nodeConnect", this);
            this.isConnected = true;
            this.poru.emit("debug", this.options.name, `[Web Socket] Connection ready ${this.socketURL}`);

            if (this.autoResume) this.poru.players.forEach(async (player) => player.node === this ? await player.restart() : null);
        } catch (error) {
            this.poru.emit("debug", `[Web Socket] Error while opening the connection with the node ${this.options.name}.`, error)
        };
    };

    /**
     * This will send a message to the node
     * @param {string} payload The sent payload we recieved in stringified form
     * @returns {Promise<void>} Return void
     */
    private async message(payload: string): Promise<void> {
        try {
            const packet = JSON.parse(payload) as LavalinkPackets;
            if (!packet?.op) return;

            this.poru.emit("raw", "Node", packet)
            this.poru.emit("debug", this.options.name, `[Web Socket] Lavalink Node Update : ${JSON.stringify(packet)} `);

            switch (packet.op) {
                case "ready": {
                    this.rest.setSessionId(packet.sessionId);
                    this.sessionId = packet.sessionId;
                    this.poru.emit("debug", this.options.name, `[Web Socket] Ready Payload received ${JSON.stringify(packet)}`);

                    // If a resume key was set use it
                    if (this.resumeKey) {
                        await this.rest.patch(`/v4/sessions/${this.sessionId}`, { resumingKey: this.resumeKey, timeout: this.resumeTimeout });
                        this.poru.emit("debug", this.options.name, `[Lavalink Rest]  Resuming configured on Lavalink`);
                    };

                    break;
                };

                // If the packet has stats about the node in it update them on the Node's class
                case "stats": {
                    delete (packet as NodeStats & { op: string | undefined }).op;

                    this.stats = packet;

                    break;
                };

                // If the packet is an event or playerUpdate emit the event to the player
                case "event":
                case "playerUpdate": {
                    const player = this.poru.players.get(packet.guildId);
                    if (packet.guildId && player) player.emit(packet.op, packet);

                    break;
                };

                default: break;
            };
        } catch (err) {
            this.poru.emit("debug", "[Web Socket] Error while parsing the payload.", err);
        };
    };

    /**
     * This will close the connection to the node
     * @param {any} event any
     * @returns {void} void
     */
    private async close(event: any): Promise<void> {
        try {
            await this.disconnect();
            this.poru.emit("nodeDisconnect", this, event);
            this.poru.emit("debug", this.options.name, `[Web Socket] Connection closed with Error code: ${event || "Unknown code"}`);
    
            if (event !== 1000) await this.reconnect();   
        } catch (error) {
            this.poru.emit("debug", "[Web Socket] Error while closing the connection with the node.", error);
        };
    };

    /**
     * This function will emit the error so that the user's listeners can get them and listen to them
     * @param {any} event any
     * @returns {void} void
     */
    private error(event: any): void {
        if (!event) return;

        this.poru.emit("nodeError", this, event);
        this.poru.emit("debug", `[Web Socket] Connection for Lavalink Node (${this.options.name}) has error code: ${event.code || event}`);
    };
};