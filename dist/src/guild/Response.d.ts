import { Track, trackData } from "./Track";
export type LavaLinkLoadTypes = "track" | "playlist" | "search" | "empty" | "error";
export type Severity = "common" | "suspicious" | "fault";
export interface PlaylistInfo {
    type: "playlist";
    name: string;
    selectedTrack: number;
}
export interface NoPlaylistInfo {
    type?: "noPlaylist";
    name?: null;
    selectedTrack?: 0;
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
    loadType: LavaLinkLoadTypes;
    playlistInfo: PlaylistInfo | NoPlaylistInfo;
    constructor(response: LoadTrackResponse, requester: any);
    private handleTracks;
    private convertNodelinkResponseToLavalink;
}
