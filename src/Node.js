const WebSocket = require("ws");
const config = require("./config");
const { fetch } = require("undici");

class Node {
  constructor(poru, options, node) {
    this.poru = poru;
    this.name = options.name || null;
    this.host = options.host || "localhost";
    this.port = options.port || 2333;
    this.password = options.password || "youshallnotpass";
    this.secure = options.secure || false;
    this.url = `${this.secure ? "wss" : "ws"}://${this.host}:${this.port}/`;
    this.regions = options?.regions || [];
    this.ws = null;
    this.reconnectTimeout = node.reconnectTimeout || 5000;
    this.reconnectTries = node.reconnectTries || 5;
    this.reconnectAttempt = null;
    this.attempt = 0;
    this.resumeKey = node.resumeKey || null;
    this.resumeTimeout = node.resumeTimeout || 60;
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
      "Num-Shards": this.poru.shards || 1,
      "User-Id": this.poru.user,
      "Client-Name": config.clientName,
    };
    if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;
    this.ws = new WebSocket(this.url, { headers });
    this.ws.on("open", this.#open.bind(this));
    this.ws.on("error", this.#error.bind(this));
    this.ws.on("message", this.#message.bind(this));
    this.ws.on("close", this.#close.bind(this));
  }

  disconnect() {
    if (!this.isConnected) return;

    this.ws?.removeAllListeners();
    this.ws?.close();
    this.ws = null;
    this.isConnected = false;
  }

  destroy() {
    if (!this.isConnected) return;

    const players = this.poru.players.filter((p) => p.node == this);
    if (players.size) players.forEach((p) => p.destroy());
    this.ws.close(1000, "destroy");
    this.ws?.removeAllListeners();
    this.ws = null;
    this.reconnect = 1;
    this.destroyed = true;
    this.poru.nodes.delete(this.host);
    this.poru.emit("nodeDestroy", this);
  }

  reconnect() {
    this.reconnectAttempt = setTimeout(() => {
      if (this.attempt > this.reconnectTries) {
        throw new Error(
          `[Poru Websocket] Unable to connect with ${this.name} node after ${this.reconnectTries} tries`
        );
        A;
      }
      this.isConnected = false;
      this.ws?.removeAllListeners();
      this.ws = null;
      this.poru.emit("nodeReconnect", this);
      this.connect();
      this.attempt++;
    }, this.reconnectTimeout);
  }

  send(payload) {
    const data = JSON.stringify(payload);
    this.ws.send(data, (error) => {
      if (error) return error;
      return null;
    });
    this.poru.emit("raw", data, this.name);
  }

  get penalties() {
    let penalties = 0;
    if (!this.isConnected) return penalties;
    penalties += this.stats.players;
    penalties += Math.round(
      Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10
    );
    if (this.stats.frameStats) {
      penalties += this.stats.frameStats.deficit;
      penalties += this.stats.frameStats.nulled * 2;
    }
    return penalties;
  }

  #open() {
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
      this.poru.emit(
        "debug",
        this.name,
        `[Web Socket]  Resuming configured on Lavalink`
      );
    }

    this.poru.emit("nodeConnect", this);
    this.isConnected = true;
    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Connection ready ${this.url}`
    );

    if (config.autoResume) {
      for (const player of this.poru.players.values()) {
        if (player.node === this) {
          player.restart();
        }
      }
    }
  }

  #message(payload) {
    const packet = JSON.parse(payload);
    if (!packet?.op) return;

    if (packet.op === "stats") {
      this.stats = { ...packet };
      delete this.stats.op;
    }
    const player = this.poru.players.get(packet.guildId);
    if (packet.guildId && player) player.emit(packet.op, packet);
    packet.node = this;

    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Lavalink Node Update : ${packet.op}  `
    );
  }

  #close(event) {
    this.disconnect();
    this.poru.emit("nodeDisconnect", this, event);
    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Connection with Lavalink closed with Error code : ${event || "Unknown code"
      }`
    );
    if (event !== 1000) this.reconnect();
  }

  #error(event) {
    if (!event) return "Unknown event";

    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Connection for Lavalink node has error code: ${event.code || event
      }`
    );
    this.poru.emit("nodeError", this, event);
  }


  async getRoutePlannerStatus() {

    return await this.makeRequest({

      endpoint: "/routeplanner/status",
      headers: {
        Authorization: this.password,
        "User-Agent": config.clientName,
      }

    });
  }
  async unmarkFailedAddress(address) {


    return await this.makeRequest({
      endpoint: "/routeplanner/free/address",
      method: "POST",
      headers: {
        Authorization: this.password,
        "User-Agent": config.clientName,
        'Content-Type': 'application/json',

      },
      body: { address }
    });

  }
  async makeRequest(data) {

    const url = new URL(`http${this.secure ? "s" : ""}://${this.host}:${this.port}${data.endpoint}`)

    return await fetch(url.toString(), {
      method: data.method || "GET",
      headers: data.headers,
      ...data?.body ? { body: JSON.stringify(data.body) } : {}
    })
      .then((r) => r.json())
      .catch((e) => {
        console.log(e)
        throw new Error(
          `[Poru Error] Something went worng while trying to make request to ${this.name} node.\n  error: ${e}`
        );
      });
  }



}



module.exports = Node;
