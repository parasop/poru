import { Player } from "./Player";
export interface IVoiceServer {
    token: string;
    sessionId: string;
    endpoint: string;
}
export declare class Connection {
    player: Player;
    sessionId: string | null;
    region: string | null;
    voice: IVoiceServer | null;
    self_mute: boolean;
    self_deaf: boolean;
    constructor(player: Player);
    setServersUpdate(data: any): void;
    setStateUpdate(data: any): void;
}
