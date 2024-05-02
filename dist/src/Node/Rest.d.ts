/// <reference types="node" />
import { ErrorResponses, Node } from "./Node";
import { Poru } from "../Poru";
import { trackData } from "../guild/Track";
import { FiltersOptions } from '../Player/Filters';
import { IVoiceServer } from "../Player/Connection";
export type PartialNull<T> = {
    [P in keyof T]: T[P] | null;
};
export interface playOptions {
    guildId: string;
    data: {
        track?: any;
        identifier?: string;
        startTime?: number;
        endTime?: number;
        volume?: number;
        position?: number;
        paused?: boolean;
        filters?: Partial<FiltersOptions>;
        voice?: IVoiceServer | PartialNull<IVoiceServer> | null;
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
export type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>> | Headers;
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
    isNodeLink: boolean;
    constructor(poru: Poru, node: Node);
    setSessionId(sessionId: string): void;
    /**
     * Gets all players in this specific session
     * @returns Returns a list of players in this specific session.
     */
    getAllPlayers(): Promise<PlayerObjectFromAPI[] | ErrorResponses | null>;
    /**
     * Updates a specific player in this session in the specified guild
     * @param options
     * @returns A player object from the API
     */
    updatePlayer(options: playOptions): Promise<PlayerObjectFromAPI | ErrorResponses | null>;
    destroyPlayer(guildId: string): Promise<null | ErrorResponses>;
    get<T = unknown>(path: RouteLike): Promise<T | null>;
    patch<T = unknown | null>(endpoint: RouteLike, body: any): Promise<T | null>;
    post<T = unknown>(endpoint: RouteLike, body: any): Promise<T | null>;
    delete<T = unknown>(endpoint: RouteLike): Promise<T | null>;
    protected get headers(): HeadersInit;
}
