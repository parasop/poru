import { Node } from "./Node";
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
export declare class Rest {
    private sessionId;
    private password;
    url: string;
    poru: Poru;
    constructor(poru: Poru, node: Node);
    setSessionId(sessionId: string): void;
    getAllPlayers(): Promise<unknown>;
    updatePlayer(options: playOptions): Promise<unknown>;
    destroyPlayer(guildId: string): Promise<void>;
    get(path: string): Promise<unknown>;
    patch(endpoint: string, options: any): Promise<unknown>;
    post(endpoint: string, options: any): Promise<unknown>;
    delete(endpoint: string): Promise<unknown>;
}
