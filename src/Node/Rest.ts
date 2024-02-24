import { ErrorResponses, Node } from "./Node";
import { fetch } from "undici";
import { Poru } from "../Poru";
import { Track, trackData } from "../guild/Track";
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

export enum RequestMethod {
    "Get" = "GET",
    "Delete" = "DELETE",
    "Post" = "POST",
    "Patch" = "PATCH",
    "Put" = "PUT",
}

export class Rest {
    private sessionId: string;
    private password: string;
    public url: string;
    public poru: Poru;

    constructor(poru: Poru, node: Node) {
        this.poru = poru;
        this.url = `http${node.secure ? "s" : ""}://${node.options.host}:${node.options.port}`;
        this.sessionId = node.sessionId;
        this.password = node.password;
    }

    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    public async getAllPlayers(): Promise<PlayerObjectFromAPI | ErrorResponses> {
        return await this.get(`/v4/sessions/${this.sessionId}/players`);
    }

    public async updatePlayer(options: playOptions): Promise<PlayerObjectFromAPI | ErrorResponses> {
        return await this.patch(`/v4/sessions/${this.sessionId}/players/${options.guildId}?noReplace=false`, options.data);
    }

    public async destroyPlayer(guildId: string): Promise<null | ErrorResponses> {
        return await this.delete(`/v4/sessions/${this.sessionId}/players/${guildId}`);
    }

    public async get<T = unknown>(path: RouteLike) {
        try {
            let req = await fetch(this.url + path, {
                method: RequestMethod.Get,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
            });
            return await req.json() as T;
        } catch (e) {
            return null;
        }
    }

    public async patch<T = unknown | null>(endpoint: RouteLike, body: any): Promise<T> {
        try {
            let req = await fetch(this.url + endpoint, {
                method: RequestMethod.Patch,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
                body: JSON.stringify(body),
            });

            return await req.json() as T;
        } catch (e) {
            return null;
        }
    }

    public async post<T = unknown>(endpoint: RouteLike, body: any): Promise<T> {
        try {
            let req = await fetch(this.url + endpoint, {
                method: RequestMethod.Post,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
                body: JSON.stringify(body),
            });

            return await req.json() as T;
        } catch (e) {
            return null;
        }
    }

    public async delete<T = unknown>(endpoint: RouteLike): Promise<T> {
        try {
            let req = await fetch(this.url + endpoint, {
                method: RequestMethod.Delete,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
            });

            return await req.json() as T;
        } catch (e) {
            return null;
        }
    }
}