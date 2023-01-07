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
export type RouteLike = `/${string}`;
export declare enum RequestMethod {
    "Get" = "GET",
    "Delete" = "DELETE",
    "Post" = "POST",
    "Patch" = "PATCH",
    "Put" = "PUT"
}
export declare class Rest {
    private sessionId;
    private password;
    url: string;
    poru: Poru;
    constructor(poru: Poru, node: Node);
    setSessionId(sessionId: string): void;
    getAllPlayers(): Promise<any>;
    updatePlayer(options: playOptions): Promise<any>;
    destroyPlayer(guildId: string): Promise<void>;
    get(path: RouteLike): Promise<any>;
    patch(endpoint: RouteLike, body: any): Promise<any>;
    post(endpoint: RouteLike, body: any): Promise<any>;
    delete(endpoint: RouteLike): Promise<any>;
    private parseResponse;
}
