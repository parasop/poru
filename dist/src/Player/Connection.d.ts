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
export declare class Connection {
    player: Player;
    sessionId: string | null;
    region: string | null;
    voice: IVoiceServer | null;
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
    setServersUpdate(data: any): void;
    /**
     * Set the state update
     * @param data The data from the state update
     */
    setStateUpdate(data: any): void;
}
