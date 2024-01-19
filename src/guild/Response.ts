import { request } from "http";
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
  constructor(response, requester) {
    this.tracks = this.handleTracks(response.data, requester);
    this.loadType = response?.loadType;
    this.playlistInfo = response.data?.playlistInfo;
  }


  handleTracks(data, requester) {

    if (Array.isArray(data)) {
      return data?.map((track) => new Track(track, requester))

    } else {

      return [new Track(data, requester)]

    }


  }
}