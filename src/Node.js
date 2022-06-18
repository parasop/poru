const WebSocket = require("ws");
const config = require("./config.json")

class Node {
    constructor(manager, options = { }) {

        this.manager = manager
        this.name= options.name || null;
        this.host = options.host || "localhost"
        this.port = options.port || 2333
        this.url = `${options.secure ? 'wss' : 'ws'}://${options.host}:${options.port}`;
        this.password = options.password ||"youshallnotpass"
        this.secure = options.secure || false;
        this.ws = null;
        this.reconnect = options.reconnect || 10000;
        this.reconnectTime = 50000;
        this.resumeKey = options.resumeKey || null;
        this._resumeTimeout = options.resumeTimeout || 60
        this.queue = [];
        this.isConnected = false;
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
        };


 }

 connect() {
    if (this.ws) this.ws.close();
    const headers = {
        Authorization: this.password,
        "Num-Shards": this.manager.shards || 1,
        "User-Id": this.manager.user,
        "Client-Name": config.client
   };
   if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;
   this.ws = new WebSocket(`ws${this.secure ? "s" : ""}:${this.host}:${this.port}/`, { headers });
   this.ws.on("open", this.open.bind(this));
   this.ws.on("error", this.error.bind(this));
   this.ws.on("message", this.message.bind(this));
   this.ws.on("close", this.close.bind(this));
 }


open(){
    if (this.reconnect) {
        clearTimeout(this.reconnect);
        delete this.reconnect;
    }

this.queue =[];
if (this.resumeKey) this.send({ op: "configureResuming", key: (this.resumeKey).toString(), timeout: this._resumeTimeout });
 this.manager.emit("nodeConnect", this);
this.isConnected = true;
}

message(payload) {
    // eslint-disable-next-line no-param-reassign
    if (Array.isArray(payload)) payload = Buffer.concat(payload);
    // eslint-disable-next-line no-param-reassign
    else if (payload instanceof ArrayBuffer) payload = Buffer.from(payload);

    const packet = JSON.parse(payload);
    if (packet.op && packet.op === "stats") {
        this.stats = { ...packet };
        delete this.stats.op;
    }
    const player = this.manager.players.get(packet.guildId);
    if (packet.guildId && player) player.emit(packet.op, packet);

    packet.node = this;
    /**
     * Fire up when raw packets / or sending raw data
     */
    this.manager.emit("raw", packet);
}

    close(event) {
    // if (!event) return "Unknown event";
    /**
     * Fire up when node disconnect
     * @event nodeClosed
     */
    this.manager.emit("nodeClose", event, this);
    if (event !== 1000) return this.reconnect();
}


    error(event) {
    if (!event) return "Unknown event";

    /**
     * Fire up when node return an error
     * @event nodeError
     */
    this.manager.emit("nodeError", event, this);
    return this.reconnect();
}

reconnect() {
    this.reconnect = setTimeout(() => {
        this.connected = false;
        this.ws.removeAllListeners();
        this.ws = null;
        this.manager.emit("nodeReconnect", this);
        this.connect();
    }, this.reconnectTime);
}

send(payload) {
    this.ws.send(JSON.stringify(payload), (error) => {
        if (error) return error;
        return null;
    });
}



 }



 module.exports = Node;

