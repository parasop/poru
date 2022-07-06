const WebSocket = require("ws");
const config = require("./config.json")

class Node {
    constructor(manager,options,node) {

        this.manager = manager
        this.name= options.name || null;
        this.host = options.host || "localhost"
        this.port = options.port || 2333
        this.url = `${options.secure ? 'wss' : 'ws'}://${options.host}:${options.port}`;
        this.password = options.password ||"youshallnotpass"
        this.secure = options.secure || false;
        this.ws = null;
        this.reconnectTime = node.reconnectTime || 5000;
        this.resumeKey = node.resumeKey || null;
        this.resumeTimeout = node.resumeTimeout || 60;
        this.reconnectAttempt;
        this.reconnects = 0;
        this.isConnected = false;
        this.destroyed = null;
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
   this.ws.on("open",this.#open.bind(this));
   this.ws.on("error", this.#error.bind(this));
   this.ws.on("message", this.#message.bind(this));
   this.ws.on("close", this.#close.bind(this));
  }


#open(){
    if (this.reconnectAttempt) {
        clearTimeout(this.reconnectAttempt);
        delete this.reconnectAttempt;
    } 

if (this.resumeKey){
this.send({
     op: "configureResuming", 
     key: (this.resumeKey).toString(), 
     timeout: this.resumeTimeout 
    });
    this.manager.emit("debug",this.name,`[Web Socket]  Resuming configured on Lavalink`)
}

this.manager.emit("nodeConnect", this);
this.isConnected = true;
this.manager.emit('debug', this.name, `[Web Socket] Connection ready ${this.url}`);
      
}

#message(payload) {
    if (Array.isArray(payload)) payload = Buffer.concat(payload);
    else if (payload instanceof ArrayBuffer) payload = Buffer.from(payload);

    const packet = JSON.parse(payload);
    if (packet.op && packet.op === "stats") {
        this.stats = { ...packet };
        delete this.stats.op;
    }
    const player = this.manager.players.get(packet.guildId);
    if (packet.guildId && player) player.emit(packet.op, packet);

    packet.node = this;
    this.manager.emit("debug",this.name,`[Web Socket] Lavalink Node Update : ${packet.op}  `)
    this.manager.emit("raw", packet);
}

    #close(event) {
    this.manager.emit("nodeDisconnect", event, this);
    this.manager.emit("debug",this.name,`[Web Socket] Connection with Lavalink closed with Error code : ${event||"Unkwon code"}`)
    if (event !== 1000){
        
     return this.reconnect();
    }
}


    #error(event) {
    if (!event) return "Unknown event";

    this.manager.emit("debug",this.name,`[Web Socket] Connection for Lavalink node has error code: ${event.code}`)
    this.manager.emit("nodeError", this, event);
    return this.reconnect();
}

destroy(){
    if(!this.isConnected) return;

    const players = this.manager.players.filter(p => p.node == this);
    if (players.size) players.forEach(p => p.destroy());
    this.ws.close(1000, "destroy");
    this.ws.removeAllListeners();
    this.ws = null;
    this.reconnect = 1;
    this.destroyed = true;
    this.manager.nodes.delete(this.host)
    this.manager.emit("nodeDestroy", this);


}

reconnect() {
    this.reconnectAttempt = setTimeout(() => {
        this.isConnected = false;
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



get penalties(){
    let penalties = 0;
    if (!this.isConnected) return penalties;
    penalties += this.stats.players;
    penalties += Math.round(Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10);
    if (this.stats.frameStats) {
        penalties += this.stats.frameStats.deficit;
        penalties += this.stats.frameStats.nulled * 2;
    }
    return penalties;
}


 }



 module.exports = Node;

