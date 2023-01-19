import { Node } from "./Node";
import { fetch, Response } from "undici";
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

export type RouteLike = `/${string}`;

export enum RequestMethod {
  "Get" = "GET",
  "Delete" = "DELETE",
  "Post" = "POST",
  "Patch" = "PATCH",
  "Put" = "PUT",
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
    return this.get(`/v3/sessions/${this.sessionId}/players`);
  }

  public async updatePlayer(options: playOptions) {
    return await this.patch(
      `/v3/sessions/${this.sessionId}/players/${options.guildId}/?noReplace=false`,
      options.data
    );
  }

  public async destroyPlayer(guildId: string) {
    await this.delete(`/v3/sessions/${this.sessionId}/players/${guildId}`);
  }

  public async get(path: RouteLike) {
    let req = await fetch(this.url + path, {
      method: RequestMethod.Get,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
    });
    return await this.parseResponse(req);
  }

  public async patch(endpoint: RouteLike, body) {
    let req = await fetch(this.url + endpoint, {
      method: RequestMethod.Patch,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
      body: JSON.stringify(body),
    });

    return await this.parseResponse(req);
  }
  public async post(endpoint: RouteLike, body) {
    let req = await fetch(this.url + endpoint, {
      method: RequestMethod.Post,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
      body: JSON.stringify(body),
    });

    return await this.parseResponse(req);
  }

  public async delete(endpoint: RouteLike) {
    let req = await fetch(this.url + endpoint, {
      method: RequestMethod.Delete,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.password,
      },
    });

    return await this.parseResponse(req);
  }

  private async parseResponse(req: Response) {
    try {
      this.poru.emit("raw", "Rest", await req.json());
      return await req.json();
    } catch (e) {
      return null;
    }
  }
}
