import { Node } from "./Node";
import { Poru } from "../Poru";
export interface playOptions {
    guildId: string;
    data: {
        encodedTrack?: string | null;
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
    getAllPlayers(): Promise<unknown>;
    updatePlayer(options: playOptions): Promise<unknown>;
    destroyPlayer(guildId: string): Promise<void>;
    get(path: RouteLike): Promise<unknown>;
    patch(endpoint: RouteLike, body: any): Promise<unknown>;
    post(endpoint: RouteLike, body: any): Promise<unknown>;
    delete(endpoint: RouteLike): Promise<unknown>;
}
