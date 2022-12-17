"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const ws_1 = __importDefault(require("ws"));
const undici_1 = require("undici");
const config_1 = require("./config");
const Rest_1 = require("./Rest");
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
    constructor(poru, node, options) {
        this.poru = poru;
        this.name = node.name;
        this.options = node;
        this.restURL = `http${node.secure ? "s" : ""}://${node.host}:${node.port}`;
        this.socketURL = `${this.secure ? "wss" : "ws"}://${node.host}:${node.port}/`;
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
    connect() {
        if (this.ws)
            this.ws.close();
        const headers = {
            Authorization: this.password,
            "User-Id": this.poru.userId,
            "Client-Name": config_1.Config.clientName,
        };
        if (this.resumeKey)
            headers["Resume-Key"] = this.resumeKey;
        this.ws = new ws_1.default(this.socketURL, { headers });
        this.ws.on("open", this.open.bind(this));
        this.ws.on("error", this.error.bind(this));
        this.ws.on("message", this.message.bind(this));
        this.ws.on("close", this.close.bind(this));
    }
    send(payload) {
        const data = JSON.stringify(payload);
        this.ws.send(data, (error) => {
            if (error)
                return error;
            return null;
        });
    }
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
    disconnect() {
        if (!this.isConnected)
            return;
        this.poru.players.forEach((player) => {
            if (player.node == this) {
                player.move();
            }
        });
        this.ws.close(1000, "destroy");
        this.ws?.removeAllListeners();
        this.ws = null;
        //    this.reconnect = 1;
        this.poru.nodes.delete(this.name);
        this.poru.emit("nodeDisconnect", this);
    }
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
    open() {
        if (this.reconnectAttempt) {
            clearTimeout(this.reconnectAttempt);
            delete this.reconnectAttempt;
        }
        if (this.resumeKey) {
            this.send({
                op: "configureResuming",
                key: this.resumeKey.toString(),
                timeout: this.resumeTimeout,
            });
            this.poru.emit("debug", this.name, `[Web Socket]  Resuming configured on Lavalink`);
        }
        this.poru.emit("nodeConnect", this);
        this.isConnected = true;
        this.poru.emit("debug", this.name, `[Web Socket] Connection ready ${this.socketURL}`);
        if (this.autoResume) {
            for (const player of this.poru.players.values()) {
                if (player.node === this) {
                    player.restart();
                }
            }
        }
    }
    setStats(packet) {
        this.stats = packet;
    }
    async message(payload) {
        const packet = JSON.parse(payload);
        if (!packet?.op)
            return;
        if (packet.op === "stats") {
            delete packet.op;
            this.setStats(packet);
        }
        if (packet.op === "ready") {
            this.rest.setSessionId(packet.sessionId);
        }
        const player = this.poru.players.get(packet.guildId);
        if (packet.guildId && player)
            player.emit(packet.op, packet);
        this.poru.emit("debug", this.name, `[Web Socket] Lavalink Node Update : ${packet.op}  `);
    }
    close(event) {
        this.disconnect();
        this.poru.emit("nodeDisconnect", this, event);
        this.poru.emit("debug", this.name, `[Web Socket] Connection with Lavalink closed with Error code : ${event || "Unknown code"}`);
        if (event !== 1000)
            this.reconnect();
    }
    error(event) {
        if (!event)
            return;
        this.poru.emit("nodeError", this, event);
        this.poru.emit("debug", this.name, `[Web Socket] Connection for Lavalink node has error code: ${event.code || event}`);
    }
    async getRoutePlannerStatus() {
        return await this.makeRequest({
            endpoint: "/routeplanner/status",
            headers: {
                Authorization: this.password,
                "User-Agent": config_1.Config.clientName,
            },
        });
    }
    async unmarkFailedAddress(address) {
        return await this.makeRequest({
            endpoint: "/routeplanner/free/address",
            method: "POST",
            headers: {
                Authorization: this.password,
                "User-Agent": config_1.Config.clientName,
                "Content-Type": "application/json",
            },
            body: { address },
        });
    }
    async makeRequest(data) {
        const url = new URL(`http${this.secure ? "s" : ""}://${this.restURL}${data.endpoint}`);
        return await (0, undici_1.fetch)(url.toString(), {
            method: data.method || "GET",
            headers: data.headers,
            ...(data?.body ? { body: JSON.stringify(data.body) } : {}),
        })
            .then((r) => r.json())
            .catch((e) => {
            throw new Error(`[Poru Error] Something went worng while trying to make request to ${this.name} node.\n  error: ${e}`);
        });
    }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map