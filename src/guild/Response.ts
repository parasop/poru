import { Track, trackData } from "./Track"

export type LoadType = "track" | "playlist" | "search" | "empty" | "error"

interface PlaylistInfo {
  type: "playlist",
  name: string
  selectedTrack: number
};

interface NoPlaylistInfo {
  type: "noPlaylist",
};


export interface LoadTrackResponseTrack {
  loadType: "track",
  data: trackData,
};

export interface LoadTrackResponseSearch {
  loadType: "search",
  data: trackData[],
};

export interface LoadTrackResponseEmpty {
  loadType: "empty",
  data: {}
};

export type Severity = "common" | "suspicious" | "fault"

export interface LoadTrackResponseError {
  loadType: "error",
  data: {
    message?: string,
    severity: Severity,
    cause: string
  }
};

export interface LoadTrackResponsePlaylist {
  loadType: "playlist",
  data: {
    /**
     * The info of the playlist
     */
    info: {
      /**
       * The name of the playlist
       */
      name: string,

      /**
       * The selected track of the playlist (-1 if no track is selected)
       */
      selectedTrack: number,
    },
    /**
     * Addition playlist info provided by plugins
     */
    pluginInfo: any,

    /**
     * The tracks of the playlist
     */
    tracks: trackData[]
  }
};

export type LoadTrackResponse = LoadTrackResponseTrack | LoadTrackResponseSearch | LoadTrackResponseEmpty | LoadTrackResponseError | LoadTrackResponsePlaylist

export class Response {
  public tracks: Track[]
  public loadType: LoadType
  public playlistInfo: PlaylistInfo | NoPlaylistInfo;

  constructor(response: LoadTrackResponse, requester: any) {
    switch (response.loadType) {
      case "playlist": {
        this.tracks = this.handleTracks(response.data.tracks, requester)
        this.playlistInfo = {
          ...response.data.info,
          type: "playlist"
        };

        break;
      }

      case "search":
      case "track": {
        this.tracks = this.handleTracks(response.data, requester)
        this.playlistInfo = {
          type: "noPlaylist"
        };

        break;
      };

      default: {
        this.tracks = [];
        this.playlistInfo = {
          type: "noPlaylist"
        };

        break;
      }
    };
    this.loadType = response.loadType
  };

  private handleTracks(data: trackData | trackData[], requester: any) {
    if (Array.isArray(data)) {
      return data.map((track) => new Track(track, requester))

    } else {
      return [new Track(data, requester)]
    };
  };
}