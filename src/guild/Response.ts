import { LoadTrackResponse } from "../Poru";
import { Track, trackData } from "./Track"

export type LoadType = "track" | "playlist" | "search" | "empty" | "error"

export interface LavalinkResponse {
    loadType: LoadType;
    playlistInfo: {
        name?: string;
        selectedTrack?: number;
    }
    tracks: Track[]
}


interface PlaylistInfo {
    name: string;
    selectedTrack: number;
}

export class Response {
    public tracks: Track[]
    public loadType: LoadType
    public playlistInfo: PlaylistInfo
    constructor(response: LoadTrackResponse, requester: any) {
        switch (response.loadType) {
            case "playlist": {
                this.tracks = response.data.tracks.map((track) => new Track(track, requester));
                this.playlistInfo = response.data.info;
                break;
            };

            case "track": {
                this.tracks = this.handleTracks(response.data, requester);
                break;
            };

            case "search": {
                this.tracks = this.handleTracks(response.data, requester);
                break;
            };
            
            default: break;
        };
        this.loadType = response.loadType;
    };

    private handleTracks(data: trackData | trackData[], requester: any) {
        if (Array.isArray(data)) {
            return data.map((track) => new Track(track, requester))

        } else {
            return [new Track(data, requester)]
        };
    };
};