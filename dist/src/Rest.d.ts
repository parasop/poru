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
    resolveQuery(endpoint: any): Promise<unknown>;
    patch(url: string, options: any): Promise<unknown>;
    delete(url: string): Promise<unknown>;
    get(path: string): Promise<unknown>;
}
