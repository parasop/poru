"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const ws_1 = __importDefault(require("ws"));
const config_1 = require("../config");
const Rest_1 = require("./Rest");
;
;
;
;
;
;
;
;
;
;
class Node {
    name;
    isConnected;
    poru;
    restURL;
    socketURL;
    password;
    secure;
    regions;
    sessionId;
    rest;
    ws;
    resumeKey;
    resumeTimeout;
    autoResume;
    reconnectTimeout;
    reconnectTries;
    reconnectAttempt;
    attempt;
    stats;
    options;
    clientName;
    isNodeLink;
    /**
     * The Node class that is used to connect to a lavalink node
     * @param poru Poru
     * @param node NodeGroup
     * @param options PoruOptions
     */
    constructor(poru, node, options) {
        this.name = node.name;
        this.poru = poru;
        this.options = node;
        this.secure = node.secure || false;
        this.restURL = `http${node.secure ? "s" : ""}://${node.host}:${node.port}`;
        this.socketURL = `${node.secure ? "wss" : "ws"}://${node.host}:${node.port}/v4/websocket`;
        this.password = node.password || "youshallnotpass";
        this.regions = node.region || null;
        this.sessionId = null;
        this.rest = new Rest_1.Rest(poru, this);
        this.ws = null;
        this.resumeKey = options.resumeKey || null;
        this.resumeTimeout = options.resumeTimeout || 60;
        this.autoResume = options.autoResume || false;
        this.reconnectTimeout = options.reconnectTimeout || 5000;
        this.reconnectTries = options.reconnectTries || 5;
        this.reconnectAttempt = null;
        this.attempt = 0;
        this.isConnected = false;
        this.clientName = options.clientName || `${config_1.Config.clientName}/${config_1.Config.version}`;
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
        };
    }
    ;
    /**
     * Connects to the lavalink node
     * @returns {void}
     */
    async connect() {
        return new Promise((resolve) => {
            if (this.isConnected)
                return resolve(true);
            if (this.ws)
                this.ws.close();
            if (!this.poru.nodes.get(this.options.name)) {
                this.poru.nodes.set(this.options.name, this);
            }
            ;
            if (!this.poru.userId)
                throw new Error("[Poru Error] No user id found in the Poru instance. Consider using a supported library.");
            const headers = {
                Authorization: this.password,
                "User-Id": this.poru.userId,
                "Client-Name": this.clientName,
            };
            if (this.resumeKey)
                headers["Resume-Key"] = this.resumeKey;
            this.ws = new ws_1.default(`${this.socketURL}`, { headers });
            this.ws.on("open", this.open.bind(this));
            this.ws.on("error", this.error.bind(this));
            this.ws.on("message", this.message.bind(this));
            this.ws.on("close", this.close.bind(this));
            this.ws.on("upgrade", (request) => this.upgrade(request));
            resolve(true);
        });
    }
    ;
    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    send(payload) {
        if (!this.isConnected || !this.ws)
            throw new Error("[Poru Error] The node is not connected");
        const data = JSON.stringify(payload);
        this.ws.send(data, (error) => {
            if (error)
                return error;
            return null;
        });
    }
    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    async reconnect() {
        this.reconnectAttempt = setTimeout(async () => {
            if (this.attempt > this.reconnectTries) {
                throw new Error(`[Poru Websocket] Unable to connect with ${this.options.name} node after ${this.reconnectTries} tries`);
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
    }
    ;
    /**
     * This function will make the node disconnect
     * @returns {Promise<void>} void
     */
    async disconnect() {
        if (!this.isConnected)
            return;
        this.poru.players.forEach(async (player) => {
            if (player.node == this) {
                await player.autoMoveNode();
            }
            ;
        });
        this.ws?.close(1000, "destroy");
        this.ws?.removeAllListeners();
        this.ws = null;
        this.poru.nodes.delete(this.options.name);
        this.poru.emit("nodeDisconnect", this);
    }
    ;
    /**
     * This function will get the penalties from the current node
     * @returns {number} The amount of penalties
     */
    get penalties() {
        let penalties = 0;
        if (!this.isConnected)
            return penalties;
        penalties += this.stats?.players ?? 0;
        penalties += Math.round(Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10);
        if (this.stats.frameStats) {
            penalties += this.stats.frameStats.deficit;
            penalties += this.stats.frameStats.nulled * 2;
        }
        ;
        return penalties;
    }
    ;
    /**
     * This function will get the RoutePlanner status
     * @returns {Promise<null>}
     */
    async getRoutePlannerStatus() {
        if (this.isNodeLink)
            return {
                timestamp: Date.now(),
                status: 404,
                error: "Not found.",
                message: "The specified node is a NodeLink. NodeLink's do not have the routeplanner feature.",
                path: "/v4/routeplanner/status",
                trace: new Error().stack
            };
        return await this.rest.get(`/v4/routeplanner/status`);
    }
    ;
    /**
     * This function will Unmark a failed address
     * @param {string} address The address to unmark as failed. This address must be in the same ip block.
     * @returns {null | ErrorResponses} This function will most likely error if you havn't enabled the route planner
     */
    async unmarkFailedAddress(address) {
        if (this.isNodeLink)
            return {
                timestamp: Date.now(),
                status: 404,
                error: "Not found.",
                message: "The specified node is a NodeLink. NodeLink's do not have the routeplanner feature.",
                path: "/v4/routeplanner/free/address",
                trace: new Error().stack
            };
        return this.rest.post(`/v4/routeplanner/free/address`, { address });
    }
    ;
    /**
     * This function will get the upgrade event from the ws connection
     * @param {IncomingMessage} request The request from the upgraded WS connection
     */
    upgrade(request) {
        // Checking if this node is a NodeLink or not
        this.isNodeLink = this.options.isNodeLink ?? Boolean(request.headers.isnodelink) ?? false;
    }
    ;
    /**
     * This function will open up again the node
     * @returns {Promise<void>} The Promise<void>
     */
    async open() {
        try {
            if (this.reconnectAttempt) {
                clearTimeout(this.reconnectAttempt);
                this.reconnectAttempt = null;
            }
            ;
            this.poru.emit("nodeConnect", this);
            this.isConnected = true;
            this.poru.emit("debug", this.options.name, `[Web Socket] Connection ready ${this.socketURL}`);
            if (this.autoResume)
                this.poru.players.forEach(async (player) => player.node === this ? await player.restart() : null);
        }
        catch (error) {
            this.poru.emit("debug", `[Web Socket] Error while opening the connection with the node ${this.options.name}.`, error);
        }
        ;
    }
    ;
    /**
     * This will send a message to the node
     * @param {string} payload The sent payload we recieved in stringified form
     * @returns {Promise<void>} Return void
     */
    async message(payload) {
        try {
            const packet = JSON.parse(payload);
            if (!packet?.op)
                return;
            this.poru.emit("raw", "Node", packet);
            this.poru.emit("debug", this.options.name, `[Web Socket] Lavalink Node Update : ${JSON.stringify(packet)} `);
            switch (packet.op) {
                case "ready":
                    {
                        this.rest.setSessionId(packet.sessionId);
                        this.sessionId = packet.sessionId;
                        this.poru.emit("debug", this.options.name, `[Web Socket] Ready Payload received ${JSON.stringify(packet)}`);
                        // If a resume key was set use it
                        if (this.resumeKey) {
                            await this.rest.patch(`/v4/sessions/${this.sessionId}`, { resumingKey: this.resumeKey, timeout: this.resumeTimeout });
                            this.poru.emit("debug", this.options.name, `[Lavalink Rest]  Resuming configured on Lavalink`);
                        }
                        ;
                        break;
                    }
                    ;
                // If the packet has stats about the node in it update them on the Node's class
                case "stats":
                    {
                        delete packet.op;
                        this.stats = packet;
                        break;
                    }
                    ;
                // If the packet is an event or playerUpdate emit the event to the player
                case "event":
                case "playerUpdate":
                    {
                        const player = this.poru.players.get(packet.guildId);
                        if (packet.guildId && player)
                            player.emit(packet.op, packet);
                        break;
                    }
                    ;
                default: break;
            }
            ;
        }
        catch (err) {
            this.poru.emit("debug", "[Web Socket] Error while parsing the payload.", err);
        }
        ;
    }
    ;
    /**
     * This will close the connection to the node
     * @param {any} event any
     * @returns {void} void
     */
    async close(event) {
        try {
            await this.disconnect();
            this.poru.emit("nodeDisconnect", this, event);
            this.poru.emit("debug", this.options.name, `[Web Socket] Connection closed with Error code: ${event || "Unknown code"}`);
            if (event !== 1000)
                await this.reconnect();
        }
        catch (error) {
            this.poru.emit("debug", "[Web Socket] Error while closing the connection with the node.", error);
        }
        ;
    }
    ;
    /**
     * This function will emit the error so that the user's listeners can get them and listen to them
     * @param {any} event any
     * @returns {void} void
     */
    error(event) {
        if (!event)
            return;
        this.poru.emit("nodeError", this, event);
        this.poru.emit("debug", `[Web Socket] Connection for Lavalink Node (${this.options.name}) has error code: ${event.code || event}`);
    }
    ;
}
exports.Node = Node;
;
//# sourceMappingURL=Node.js.map