import {Track} from "./Track"
export type LoadType  = "TRACK_LOADED" | "PLAYLIST_LOADED" |"SEARCH_RESULT" | "NO_MATCHES" | "LOAD_FAILED"

interface PlaylistInfo {
    name:string;
    selectedTrack:number;
}

export class Response {
        public tracks:Track[]
        public loadType : LoadType
        public playlistInfo :PlaylistInfo
    constructor(data) {
      this.tracks = data?.tracks?.map((track) => new Track(track));
      this.loadType = data?.loadType;
      this.playlistInfo = data?.playlistInfo;
    }
  }