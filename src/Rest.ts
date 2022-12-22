import { Node } from "./Node";
import { fetch } from "undici";
import { Poru } from "./Poru";

export interface playOptions {
  guildId: string;
  data: {
    encodedTrack?: string;
    identifier?: string;
    startTime?: number;
    endTime?: number;
    volume?: number;
    position?: number;
    paused?: Boolean;
    filters?: Object;
    voice?: any;
  };
}

export class Rest {
  private sessionId: string;
  private password: string;
  public url: string;
  public poru: Poru;

  constructor(poru: Poru, node: Node) {
    this.poru = poru;
    this.url = `http${node.secure ? "s" : ""}://${node.options.host}:${node.options.port}`;
    this.sessionId = node.sessionId;
    this.password = node.password;
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  getAllPlayers() {
    return this.get(`/v3/${this.sessionId}/players`);
  }

  public async updatePlayer(options: playOptions) {
    return this.patch(
      `/v3/sessions/${this.sessionId}/players/${options.guildId}/?noReplace=false`,
      options.data
    );
  }

  public async destroyPlayer(guildId: string) {
    this.delete(`/v3/sessions/${this.sessionId}/players/${guildId}`);
  }

 
  public async get(path: string) {
    let req = await fetch(this.url + path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
    });
    return await req.json();
  }

  public async patch(endpoint: string, options) {
    let req = await fetch(this.url + endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
      body: JSON.stringify(options),
    });

    return await req.json();
  }
  public async post(endpoint: string, options) {
    let req = await fetch(this.url + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
      body: JSON.stringify(options),
    });

    return await req.json();
  }

  public async delete(endpoint: string) {
    let req = await fetch(this.url + endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
    });

    return {};
  }

  
}
