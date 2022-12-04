import { Node } from "./Node";
import { fetch } from "undici";
import { Poru } from "./Poru";
import { IVoiceServer } from "./Connection";

export interface playOptions {
  guildId: string;
data :{  
encodedTrack: string;
  identifier: string;
  startTime: number;
  endTime: number;
  volume: number;
  position: number;
  paused: Boolean;
  filters: Object;
  voice: IVoiceServer;
}
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

  public async updatePlayer(options: playOptions) {
 
    let req = await fetch(
      this.url + `/v3/sessions/${this.sessionId}/players/${options.guildId}/?noReplace=true`,
      {
        method: "PATCH",
        headers: {
          Authorization: this.password,
        },
        body: JSON.stringify(options.data),
      }
    );

    return await req.json();
  }

  getAllPlayers() {
    return this.get(`/v3/${this.sessionId}/players`, "GET");
  }

  public async get(path: string, method: string) {
    let req = await fetch(this.url + path, {
      method: method,
      headers: {
        Authorization: this.password,
      },
    });

    return await req.json();
  }
}
