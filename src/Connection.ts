import { Player } from "./Player";
import { Errors } from "./Error";

export interface IVoiceServer {
  token: string;
  sessionId: string;
  endpoint: string;
}

export class Connection {
  public player: Player;
  public sessionId: string | null;
  public region: string | null;
  public voiceServer: IVoiceServer | null;
  public self_mute: boolean;
  public self_deaf: boolean;

  constructor(player: Player) {
    this.player = player;
    this.sessionId = null;
    this.region = null;
    this.voiceServer = null;
    this.self_mute = false;
    this.self_deaf = false;

  }

  public setServersUpdate(data) {
    if (!data.endpoint) {
      throw new Error(Errors.sessionNotFound);
    }

    this.voiceServer = data;

    if (!this.sessionId) {
      throw new Error( Errors.sessionNotFound);
     }

    this.region =
      data.endpoint.split(".").shift()?.replace(/[0-9]/g, "") || null;
      
    this.player.node.send({
      op: "voiceUpdate",
      guildId: this.player.guildId,
      sessionId: this.sessionId,
      event: data,
    });
    this.player.poru.emit(
      "debug",
      this.player.node.name,
      `[Voice] <- [Discord] : Voice Server Update | Server: ${this.region} Guild: ${this.player.guildId}`
    );
  }
}
