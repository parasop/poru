import { Poru, PoruOptions, NodeGroup } from "../Poru";
import WebSocket from "ws";
import { Config as config } from "../config";
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
  public sessionId: string;
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
  /**
   * The Node class that is used to connect to a lavalink node
   * @param poru Poru
   * @param node NodeGroup
   * @param options PoruOptions
   */
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
  /**
   * Connects to the lavalink node
   * @returns {void}
   */
  public connect(): void {
    if (this.ws) this.ws.close();
    if(!this.poru.nodes.get(this.name)){
      this.poru.nodes.set(this.name,this)
    }
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
  /**
   * Handles the message event
   * @param payload any
   * @returns {void}
   */
  public send(payload: any): void {
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
  public reconnect(): void {
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
        player.AutoMoveNode();
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

  private setStats(packet: NodeStats) {
    this.stats = packet;
  }

  private async message(payload: any) {
    const packet = JSON.parse(payload);
    if (!packet?.op) return;

    this.poru.emit("raw", "Node", packet)
    this.poru.emit("debug", this.name, `[Web Socket] Lavalink Node Update : ${JSON.stringify(packet)} `);

    if (packet.op === "stats") {
      delete packet.op;
      this.setStats(packet);
    }
    if (packet.op === "ready") {
      this.rest.setSessionId(packet.sessionId);
      this.sessionId = packet.sessionId;
      this.poru.emit("debug", this.name, `[Web Socket] Ready Payload received ${JSON.stringify(packet)}`)
      if (this.resumeKey) {
        this.rest.patch(`/v3/sessions/${this.sessionId}`, { resumingKey: this.resumeKey, timeout: this.resumeTimeout })
        this.poru.emit("debug", this.name, `[Lavalink Rest]  Resuming configured on Lavalink`
        );
      }

    }
    const player = this.poru.players.get(packet.guildId);
    if (packet.guildId && player) player.emit(packet.op, packet);
  }

  private close(event: any): void {
    this.disconnect();
    this.poru.emit("nodeDisconnect", this, event);
    this.poru.emit("debug", this.name, `[Web Socket] Connection closed with Error code : ${event || "Unknown code"
      }`
    );
    if (event !== 1000) this.reconnect();
  }

  private error(event: any): void {
    if (!event) return;
    this.poru.emit("nodeError", this, event);
    this.poru.emit(
      "debug", `[Web Socket] Connection for Lavalink Node (${this.name}) has error code: ${event.code || event
      }`
    );
  }

  public async getRoutePlannerStatus(): Promise<any> {
    return await this.rest.get(`/v3/routeplanner/status`)
  }

  public async unmarkFailedAddress(address: string): Promise<any> {
    return this.rest.post(`/v3/routeplanner/free/address`, { address })

  }

}
