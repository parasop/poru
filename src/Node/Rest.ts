import { ErrorResponses, Node } from "./Node";
import { Poru } from "../Poru";
import { Track, trackData } from "../guild/Track";
import { FiltersOptions } from '../Player/Filters';
import { IVoiceServer } from "../Player/Connection";

export type PartialNull<T> = { [P in keyof T]: T[P] | null };

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
};


export interface PlayerObjectFromAPI {
    guildId: string;
    track: trackData;
    volume: number;
    paused: boolean;
    state: PlayerState;
    voice: IVoiceServer;
    filters: FiltersOptions;
};

export interface PlayerState {
    time: number;
    position: number;
    connected: boolean;
    ping: number;
};

export type RouteLike = `/${string}`;
export type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>> | Headers;

export enum RequestMethod {
    "Get" = "GET",
    "Delete" = "DELETE",
    "Post" = "POST",
    "Patch" = "PATCH",
    "Put" = "PUT",
}

export class Rest {
    private sessionId: string | null;
    private password: string;
    public url: string;
    public poru: Poru;
    public isNodeLink: boolean;

    constructor(poru: Poru, node: Node) {
        this.poru = poru;
        this.url = `http${node.secure ? "s" : ""}://${node.options.host}:${node.options.port}`;
        this.sessionId = node.sessionId;
        this.password = node.password;
        this.isNodeLink = node.isNodeLink;
    }

    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    };

    /**
     * Gets all players in this specific session
     * @returns Returns a list of players in this specific session.
     */
    public async getAllPlayers(): Promise<PlayerObjectFromAPI[] | ErrorResponses | null> {
        return await this.get(`/v4/sessions/${this.sessionId}/players`); // This will never be a string!
    }

    /**
     * Updates a specific player in this session in the specified guild
     * @param options 
     * @returns A player object from the API
     */
    public async updatePlayer(options: playOptions): Promise<PlayerObjectFromAPI | ErrorResponses | null> {
        return await this.patch(`/v4/sessions/${this.sessionId}/players/${options.guildId}?noReplace=false`, options.data);
    }

    public async destroyPlayer(guildId: string): Promise<null | ErrorResponses> {
        return await this.delete(`/v4/sessions/${this.sessionId}/players/${guildId}`);
    }

    public async get<T = unknown>(path: RouteLike): Promise<T | null> {
        try {
            const req = await globalThis.fetch(this.url + path, {
                method: RequestMethod.Get,
                headers: this.headers
            });

            return req.headers.get("content-type") === "application/json" ? await req.json() as T : await req.text() as T;
        } catch (e) {
            return null;
        }
    };

    public async patch<T = unknown | null>(endpoint: RouteLike, body: any): Promise<T | null> {
        try {
            const req = await globalThis.fetch(this.url + endpoint, {
                method: RequestMethod.Patch,
                headers: this.headers,
                body: JSON.stringify(body),
            });

            return await req.json() as T;
        } catch (e) {
            return null;
        }
    }

    public async post<T = unknown>(endpoint: RouteLike, body: any): Promise<T | null> {
        try {
            const req = await globalThis.fetch(this.url + endpoint, {
                method: RequestMethod.Post,
                headers: this.headers,
                body: JSON.stringify(body),
            });

            return await req.json() as T;
        } catch (e) {
            return null;
        }
    }

    public async delete<T = unknown>(endpoint: RouteLike): Promise<T | null> {
        try {
            const req = await globalThis.fetch(this.url + endpoint, {
                method: RequestMethod.Delete,
                headers: this.headers
            });

            return await req.json() as T;
        } catch (e) {
            return null;
        }
    };

    protected get headers(): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            Authorization: this.password,
        };

        if (this.isNodeLink) headers["Accept-Encoding"] = "br, gzip, deflate";

        return headers;
    }
}