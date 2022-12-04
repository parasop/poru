import { Poru } from "./Poru";
import { Node } from "./Node";
import { trackData } from "./guild/Track";
import { Connection } from "./Connection";

export class Player {
  emit(op: any, packet: any) {
    throw new Error("Method not implemented.");
  }

  public poru: Poru;
  public node: Node;
  public guildId: string;
  public volume: number;
  public isPaused: boolean;
  public position: number;
  public connection: Connection;
  public voiceChannel: string;
  public isConnected: boolean;
  public mute: boolean;
  public deaf: boolean;
  constructor(poru, node, options) {
    this.poru = poru;
    this.node = node;
    this.guildId = null;
    this.voiceChannel = null;
    this.deaf = options.deaf;
    this.mute = options.mute;
    this.connection = new Connection(this);
    this.volume = 100;
    this.isPaused = false;
    this.position = 0;
    this.isConnected = false;
  }

  public play(track: trackData) {
    let player = this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: {
        encodedTrack: track.track,
        identifier: track.info.identifier,
        startTime: 0,
        endTime: track.info.length,
        volume: this.volume,
        position: this.position,
        paused: this.isPaused,
        filters: {},
        voice: this.connection.voiceServer,
      },
    });
  }
  public connect(options: this = this) {
    let { guildId, voiceChannel, deaf, mute } = options;
    this.send({
      guild_id: guildId,
      channel_id: voiceChannel,
      self_deaf: deaf || true,
      self_mute: mute || false,
    });

    this.isConnected = true;
    this.poru.emit(
      "debug",
      this.guildId,
      `[Poru Player] Player has been connected`
    );
  }

  public restart() {}
  public destroy() {}
  public move() {}

  public send(data) {
    this.poru.send({ op: 4, d: data });
  }
}
