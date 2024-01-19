import { Track } from "./Track";
export type LoadType = "track" | "playlist" | "search" | "empty" | "error";
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
    constructor(response: any, requester: any);
    handleTracks(data: any, requester: any): Track[];
}
export {};
