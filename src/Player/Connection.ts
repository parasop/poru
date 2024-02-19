import { Player } from "./Player";

export interface IVoiceServer {
    token: string;
    sessionId: string;
    endpoint: string;
}

/**
  * The connection class
  * @class
  * @classdesc The connection class
  * @param {Player} player The player class
  * @hideconstructor
  * 
 */
export class Connection {
    public player: Player;
    public sessionId: string | null;
    public region: string | null;
    public voice: IVoiceServer | null;
    public self_mute: boolean;
    public self_deaf: boolean;

    /**
     * The connection class
     * @param player Player
     */
    constructor(player: Player) {
        this.player = player;
        this.sessionId = null;
        this.region = null;
        this.voice = {
            sessionId: null,
            token: null,
            endpoint: null,
        };
        this.self_mute = false;
        this.self_deaf = false;
    }

    /**
     * Set the voice server update
     * @param data The data from the voice server update
     */
    public setServersUpdate(data) {
        if (!data.endpoint) throw new Error("NO Session id found");

        this.voice.endpoint = data.endpoint;
        this.voice.token = data.token;

        this.region =
            data.endpoint.split(".").shift()?.replace(/[0-9]/g, "") || null;

        this.player.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: { voice: this.voice },
        });
        this.player.poru.emit(
            "debug",
            this.player.node.name,
            `[Voice] <- [Discord] : Voice Server Update | Server: ${this.region} Guild: ${this.player.guildId}`
        );
    }

    /**
     * Set the state update
     * @param data The data from the state update
     */
    setStateUpdate(data) {
        const { session_id, channel_id, self_deaf, self_mute } = data;
        if (
            this.player.voiceChannel &&
            channel_id &&
            this.player.voiceChannel !== channel_id
        ) {
            this.player.voiceChannel = channel_id;
        }

        this.self_deaf = self_deaf;
        this.self_mute = self_mute;
        this.voice.sessionId = session_id || null;
        //  this.player.poru.emit('debug', this.player.node.name, `[Voice] <- [Discord] : State Update Received | Channel: ${this.player.voiceChannel} Session ID: ${session_id} Guild: ${this.player.guildId}`);
    }
}
