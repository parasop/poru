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
class Node {
    isConnected;
    poru;
    name;
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
    /**
     * The Node class that is used to connect to a lavalink node
     * @param poru Poru
     * @param node NodeGroup
     * @param options PoruOptions
     */
    constructor(poru, node, options) {
        this.poru = poru;
        this.name = node.name;
        this.options = node;
        this.restURL = `http${node.secure ? "s" : ""}://${node.host}:${node.port}`;
        this.socketURL = `${this.secure ? "wss" : "ws"}://${node.host}:${node.port}/v4/websocket`;
        this.password = node.password || "youshallnotpass";
        this.secure = node.secure || false;
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
        this.stats = null;
    }
    /**
     * Connects to the lavalink node
     * @returns {void}
     */
    connect() {
        if (this.ws)
            this.ws.close();
        if (!this.poru.nodes.get(this.name)) {
            this.poru.nodes.set(this.name, this);
        }
        const headers = {
            Authorization: this.password,
            "User-Id": this.poru.userId,
            "Client-Name": config_1.Config.clientName,
        };
        if (this.resumeKey)
            headers["Resume-Key"] = this.resumeKey;
        this.ws = new ws_1.default(`${this.socketURL}`, { headers });
        this.ws.on("open", this.open.bind(this));
        this.ws.on("error", this.error.bind(this));
        this.ws.on("message", this.message.bind(this));
        this.ws.on("close", this.close.bind(this));
    }
    /**
     * Handles the message event
     * @param payload any
     * @returns {void}
     */
    send(payload) {
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
    reconnect() {
        this.reconnectAttempt = setTimeout(() => {
            if (this.attempt > this.reconnectTries) {
                throw new Error(`[Poru Websocket] Unable to connect with ${this.name} node after ${this.reconnectTries} tries`);
            }
            this.isConnected = false;
            this.ws?.removeAllListeners();
            this.ws = null;
            this.poru.emit("nodeReconnect", this);
            this.connect();
            this.attempt++;
        }, this.reconnectTimeout);
    }
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
        this.ws.close(1000, "destroy");
        this.ws?.removeAllListeners();
        this.ws = null;
        //    this.reconnect = 1;
        this.poru.nodes.delete(this.name);
        this.poru.emit("nodeDisconnect", this);
    }
    /**
     * This function will get the penalties from the current node
     * @returns {number} The amount of penalties
     */
    get penalties() {
        let penalties = 0;
        if (!this.isConnected)
            return penalties;
        penalties += this.stats.players;
        penalties += Math.round(Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10);
        if (this.stats.frameStats) {
            penalties += this.stats.frameStats.deficit;
            penalties += this.stats.frameStats.nulled * 2;
        }
        return penalties;
    }
    /**
     * This function will open up again the node
     * @returns {Promise<void>} The Promise<void>
     */
    async open() {
        if (this.reconnectAttempt) {
            clearTimeout(this.reconnectAttempt);
            delete this.reconnectAttempt;
        }
        this.poru.emit("nodeConnect", this);
        this.isConnected = true;
        this.poru.emit("debug", this.name, `[Web Socket] Connection ready ${this.socketURL}`);
        if (this.autoResume) {
            for (const player of this.poru.players.values()) {
                if (player.node === this) {
                    await player.restart();
                }
            }
        }
    }
    /**
     * This function will set the stats accordingly from the NodeStats
     * @param {NodeStats} packet The NodeStats
     * @returns {void} void
     */
    setStats(packet) {
        this.stats = packet;
    }
    /**
     * This will send a message to the node
     * @param {any} payload any
     * @returns {Promise<void>} void
     */
    async message(payload) {
        const packet = JSON.parse(payload);
        if (!packet?.op)
            return;
        this.poru.emit("raw", "Node", packet);
        this.poru.emit("debug", this.name, `[Web Socket] Lavalink Node Update : ${JSON.stringify(packet)} `);
        if (packet.op === "stats") {
            delete packet.op;
            this.setStats(packet);
        }
        if (packet.op === "ready") {
            this.rest.setSessionId(packet.sessionId);
            this.sessionId = packet.sessionId;
            this.poru.emit("debug", this.name, `[Web Socket] Ready Payload received ${JSON.stringify(packet)}`);
            if (this.resumeKey) {
                await this.rest.patch(`/v4/sessions/${this.sessionId}`, { resumingKey: this.resumeKey, timeout: this.resumeTimeout });
                this.poru.emit("debug", this.name, `[Lavalink Rest]  Resuming configured on Lavalink`);
            }
        }
        const player = this.poru.players.get(packet.guildId);
        if (packet.guildId && player)
            player.emit(packet.op, packet);
    }
    /**
     * This will close the connection to the node
     * @param {any} event any
     * @returns {void} void
     */
    close(event) {
        this.disconnect();
        this.poru.emit("nodeDisconnect", this, event);
        this.poru.emit("debug", this.name, `[Web Socket] Connection closed with Error code : ${event || "Unknown code"}`);
        if (event !== 1000)
            this.reconnect();
    }
    /**
     * This function will emit the error so that the user's listeners can get them and listen to them
     * @param {any} event any
     * @returns {void} void
     */
    error(event) {
        if (!event)
            return;
        this.poru.emit("nodeError", this, event);
        this.poru.emit("debug", `[Web Socket] Connection for Lavalink Node (${this.name}) has error code: ${event.code || event}`);
    }
    /**
     * This function will get the RoutePlanner status
     * @returns {Promise<null>}
     */
    async getRoutePlannerStatus() {
        return await this.rest.get(`/v4/routeplanner/status`);
    }
    /**
     * This function will Unmark a failed address
     * @param {string} address The address to unmark as failed. This address must be in the same ip block.
     * @returns {null | ErrorResponses} This function will most likely error if you havn't enabled the route planner
     */
    async unmarkFailedAddress(address) {
        return this.rest.post(`/v4/routeplanner/free/address`, { address });
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map