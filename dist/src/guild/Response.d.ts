import { Track } from "./Track";
export type LoadType = "TRACK_LOADED" | "PLAYLIST_LOADED" | "SEARCH_RESULT" | "NO_MATCHES" | "LOAD_FAILED";
export interface LavalinkResponse {
    loadType: LoadType;
    playlistInfo: {
        name?: string;
        selectedTrack?: number;
    };
    tracks: Track[];
}
interface PlaylistInfo {
    name: string;
    selectedTrack: number;
}
export declare class Response {
    tracks: Track[];
    loadType: LoadType;
    playlistInfo: PlaylistInfo;
    constructor(data: any, requester: any);
}
export {};
