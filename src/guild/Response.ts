import { NodeLinkV2LoadTypes } from "../Node/Node"
import { Track, trackData } from "./Track"

export type LavaLinkLoadTypes = "track" | "playlist" | "search" | "empty" | "error"
export type Severity = "common" | "suspicious" | "fault"

export interface PlaylistInfo {
  type: "playlist",
  name: string
  selectedTrack: number
};

export interface NoPlaylistInfo {
  type?: "noPlaylist",
  name?: null,
  selectedTrack?:0
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
  public loadType: LavaLinkLoadTypes
  public playlistInfo: PlaylistInfo | NoPlaylistInfo;

  constructor(response: LoadTrackResponse, requester: any) {
    response.loadType = this.convertNodelinkResponseToLavalink(response.loadType);

    const { loadType, data } = response;

    switch (loadType) {
      case "playlist": {
        this.tracks = this.handleTracks(data.tracks, requester)
        this.playlistInfo = {
          ...data.info,
          type: "playlist"
        };

        break;
      }

      case "search":
      case "track": {
        this.tracks = this.handleTracks(data, requester)
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
    
    this.loadType = loadType
  };

  private handleTracks(data: trackData | trackData[], requester: any) {
    if (Array.isArray(data)) {
      return data.map((track) => new Track(track, requester))

    } else {
      return [new Track(data, requester)]
    };
  };

  private convertNodelinkResponseToLavalink(loadType: NodeLinkV2LoadTypes | LavaLinkLoadTypes): LavaLinkLoadTypes {
    switch (loadType) {
        case "short": return "track";

        case "artist":
        case "episode":
        case "station":
        case "podcast":
        case "show":
        case "album": return "playlist";

        default: return loadType;
    };
  };
}