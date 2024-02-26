import { Track, trackData } from "./Track";
export type LoadType = "track" | "playlist" | "search" | "empty" | "error";
interface PlaylistInfo {
    name: string;
    selectedTrack: number;
}
export interface LoadTrackResponseTrack {
    loadType: "track";
    data: trackData;
}
export interface LoadTrackResponseSearch {
    loadType: "search";
    data: trackData[];
}
export interface LoadTrackResponseEmpty {
    loadType: "empty";
    data: {};
}
export type Severity = "common" | "suspicious" | "fault";
export interface LoadTrackResponseError {
    loadType: "error";
    data: {
        message?: string;
        severity: Severity;
        cause: string;
    };
}
export interface LoadTrackResponsePlaylist {
    loadType: "playlist";
    data: {
        /**
         * The info of the playlist
         */
        info: {
            /**
             * The name of the playlist
             */
            name: string;
            /**
             * The selected track of the playlist (-1 if no track is selected)
             */
            selectedTrack: number;
        };
        /**
         * Addition playlist info provided by plugins
         */
        pluginInfo: any;
        /**
         * The tracks of the playlist
         */
        tracks: trackData[];
    };
}
export type LoadTrackResponse = LoadTrackResponseTrack | LoadTrackResponseSearch | LoadTrackResponseEmpty | LoadTrackResponseError | LoadTrackResponsePlaylist;
export declare class Response {
    tracks: Track[];
    loadType: LoadType;
    playlistInfo: PlaylistInfo;
    constructor(response: LoadTrackResponse, requester: any);
    private handleTracks;
}
export {};
