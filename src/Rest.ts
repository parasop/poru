import { Node } from "./Node";
import { fetch } from "undici";
import { Poru } from "./Poru";
import { IVoiceServer } from "./Connection";

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
    this.url = `http${node.secure ? "s" : ""}://${node.options.host}:${
      node.options.port
    }`;
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
      this.url +
        `/v3/sessions/${this.sessionId}/players/${options.guildId}/?noReplace=false`,
      options.data
    );
  }

  public async destroyPlayer(guildId: string) {
    this.delete(this.url + `/v3/sessions/${this.sessionId}/players/${guildId}`);
  }

  public async resolveQuery(endpoint){

    return this.get(endpoint)

  }

  public async patch(url: string, options) {
    let req = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
      body: JSON.stringify(options),
    });

    return await req.json();
  }

  public async delete(url: string) {
    let req = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
    });

    return await req.json();
  }

  public async get(path: string) {
    let req = await fetch(this.url + path, {
      method: "GET",
      headers: {
        Authorization: this.password,
      },
    });

    return await req.json();
  }
}
