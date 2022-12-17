import { Poru, PoruOptions, NodeGroup } from "./Poru";
import WebSocket from "ws";
import { fetch } from "undici";
import { Config as config } from "./config";
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

export class Node {
  public isConnected: boolean;
  public poru: Poru;
  public readonly name: string;
  public readonly restURL: string;
  public readonly socketURL: string;
  public password: string;
  public readonly secure: boolean;
  public readonly regions: Array<string>;
  public readonly sessionId: string;
  public rest: Rest;
  public ws: WebSocket | null;
  public readonly resumeKey: string | null;
  public readonly resumeTimeout: number;
  public readonly autoResume: boolean;
  public readonly reconnectTimeout: number;
  public reconnectTries: number;
  public reconnectAttempt: any;
  public attempt: number;
  public stats: NodeStats | null;
  public options: NodeGroup;

  constructor(poru: Poru, node: NodeGroup, options: PoruOptions) {
    this.poru = poru;
    this.name = node.name;
    this.options = node;
    this.restURL = `http${node.secure ? "s" : ""}://${node.host}:${node.port}`;
    this.socketURL = `${this.secure ? "wss" : "ws"}://${node.host}:${node.port}/`;
    this.password = node.password || "youshallnotpass";
    this.secure = node.secure || false;
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
    this.stats = null;
  }

  public connect() {
    if (this.ws) this.ws.close();
    const headers = {
      Authorization: this.password,
      "User-Id": this.poru.userId,
      "Client-Name": config.clientName,
    };
    if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;
    this.ws = new WebSocket(this.socketURL, { headers });
    this.ws.on("open", this.open.bind(this));
    this.ws.on("error", this.error.bind(this));
    this.ws.on("message", this.message.bind(this));
    this.ws.on("close", this.close.bind(this));
  }

  public send(payload: any) {
    const data = JSON.stringify(payload);
    this.ws.send(data, (error) => {
      if (error) return error;
      return null;
    });
  }

  public reconnect() {
    this.reconnectAttempt = setTimeout(() => {
      if (this.attempt > this.reconnectTries) {
        throw new Error(
          `[Poru Websocket] Unable to connect with ${this.name} node after ${this.reconnectTries} tries`
        );
      }
      this.isConnected = false;
      this.ws?.removeAllListeners();
      this.ws = null;
      this.poru.emit("nodeReconnect", this);
      this.connect();
      this.attempt++;
    }, this.reconnectTimeout);
  }
  public disconnect() {
    if (!this.isConnected) return;

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

  get penalties(): number {
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

  private open() {
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
      `[Web Socket] Connection ready ${this.socketURL}`
    );

    if (this.autoResume) {
      for (const player of this.poru.players.values()) {
        if (player.node === this) {
          player.restart();
        }
      }
    }
  }

  private setStats(packet: NodeStats) {
    this.stats = packet;
  }

  private async message(payload: any) {
    const packet = JSON.parse(payload);
    if (!packet?.op) return;

    if (packet.op === "stats") {
      delete packet.op;
      this.setStats(packet);
    }
    if (packet.op === "ready") {
      this.rest.setSessionId(packet.sessionId);
    }
    const player = this.poru.players.get(packet.guildId);
    if (packet.guildId && player) player.emit(packet.op, packet);
   
    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Lavalink Node Update : ${packet.op}  `
    );
  }

  private close(event: any): void {
    this.disconnect();
    this.poru.emit("nodeDisconnect", this, event);
    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Connection with Lavalink closed with Error code : ${
        event || "Unknown code"
      }`
    );
    if (event !== 1000) this.reconnect();
  }

  private error(event: any): void {
    if (!event) return;
    this.poru.emit("nodeError", this, event);
    this.poru.emit(
      "debug",
      this.name,
      `[Web Socket] Connection for Lavalink node has error code: ${
        event.code || event
      }`
    );
  }

  public async getRoutePlannerStatus(): Promise<any> {
    return await this.makeRequest({
      endpoint: "/routeplanner/status",
      headers: {
        Authorization: this.password,
        "User-Agent": config.clientName,
      },
    });
  }

  public async unmarkFailedAddress(address: string): Promise<any> {
    return await this.makeRequest({
      endpoint: "/routeplanner/free/address",
      method: "POST",
      headers: {
        Authorization: this.password,
        "User-Agent": config.clientName,
        "Content-Type": "application/json",
      },
      body: { address },
    });
  }
  private async makeRequest(data) {
    const url = new URL(
      `http${this.secure ? "s" : ""}://${this.restURL}${data.endpoint}`
    );

    return await fetch(url.toString(), {
      method: data.method || "GET",
      headers: data.headers,
      ...(data?.body ? { body: JSON.stringify(data.body) } : {}),
    })
      .then((r) => r.json())
      .catch((e) => {
        throw new Error(
          `[Poru Error] Something went worng while trying to make request to ${this.name} node.\n  error: ${e}`
        );
      });
  }
}
