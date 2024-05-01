import { PartialNull } from "../Node/Rest";
import { Player } from "./Player";
export interface IVoiceServer {
    token: string;
    sessionId: string;
    endpoint?: string;
}
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
    member?: Record<string, unknown>;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp?: TDateISO;
}
/**
  * The connection class
  * @class
  * @classdesc The connection class
  * @param {Player} player The player class
  * @hideconstructor
  *
 */
export declare class Connection {
    player: Player;
    sessionId: string | null;
    region: string | null;
    voice: IVoiceServer | PartialNull<IVoiceServer>;
    self_mute: boolean;
    self_deaf: boolean;
    /**
     * The connection class
     * @param player Player
     */
    constructor(player: Player);
    /**
     * Set the voice server update
     * @param data The data from the voice server update
     */
    setServersUpdate(data: IVoiceServer): Promise<void>;
    /**
     * Set the state update
     * @param data The data from the state update
     */
    setStateUpdate(data: SetStateUpdate): void;
}
export {};
