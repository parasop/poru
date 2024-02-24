import { ErrorResponses, Node } from "./Node";
import { Poru } from "../Poru";
import { trackData } from "../guild/Track";
import { FiltersOptions } from '../Player/Filters';
import { IVoiceServer } from "../Player/Connection";
export interface playOptions {
    guildId: string;
    data: {
        track?: any;
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
export interface PlayerObjectFromAPI {
    guildId: string;
    track: trackData;
    volume: number;
    paused: boolean;
    state: PlayerState;
    voice: IVoiceServer;
    filters: FiltersOptions;
}
export interface PlayerState {
    time: number;
    position: number;
    connected: boolean;
    ping: number;
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
    getAllPlayers(): Promise<PlayerObjectFromAPI | ErrorResponses>;
    updatePlayer(options: playOptions): Promise<PlayerObjectFromAPI | ErrorResponses>;
    destroyPlayer(guildId: string): Promise<null | ErrorResponses>;
    get<T = unknown>(path: RouteLike): Promise<T>;
    patch<T = unknown | null>(endpoint: RouteLike, body: any): Promise<T>;
    post<T = unknown>(endpoint: RouteLike, body: any): Promise<T>;
    delete<T = unknown>(endpoint: RouteLike): Promise<T>;
}
