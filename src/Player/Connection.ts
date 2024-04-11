import { PartialNull } from "../Node/Rest";
import { Player } from "./Player";

export interface IVoiceServer {
    token: string;
    sessionId: string;
    endpoint?: string;
};

type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type THours = `${number}${number}`;
type TMinutes = `${number}${number}`;
type TSeconds = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;

/**
 * Discord Voice State Update Types
 * @reference https://discord.com/developers/docs/resources/voice#voice-state-object
 */
export interface SetStateUpdate {
    guild_id?: string;
    channel_id: string;
    user_id: string;
    member?: Record<string, unknown>
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp?: TDateISO
};

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
    public voice: IVoiceServer | PartialNull<IVoiceServer>;
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
    public async setServersUpdate(data: IVoiceServer): Promise<void> {
        if (!data.endpoint) throw new Error("[Poru Error] No Session id found.");

        this.voice.endpoint = data.endpoint;
        this.voice.token = data.token;
        this.region = data.endpoint.split(".").shift()?.replace(/[0-9]/g, "") || null;

        await this.player.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: { voice: this.voice },
        });

        this.player.poru.emit(
            "debug",
            this.player.node.name,
            `[Voice] <- [Discord] : Voice Server Update | Server: ${this.region} Guild: ${this.player.guildId}`
        );
    };

    /**
     * Set the state update
     * @param data The data from the state update
     */
    public setStateUpdate(data: SetStateUpdate) {
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
    };
};