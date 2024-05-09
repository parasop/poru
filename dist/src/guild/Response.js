"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const Track_1 = require("./Track");
;
;
;
;
;
;
;
class Response {
    tracks;
    loadType;
    playlistInfo;
    constructor(response, requester) {
        response.loadType = this.convertNodelinkResponseToLavalink(response.loadType);
        const { loadType, data } = response;
        switch (loadType) {
            case "playlist": {
                this.tracks = this.handleTracks(data.tracks, requester);
                this.playlistInfo = {
                    ...data.info,
                    type: "playlist"
                };
                break;
            }
            case "search":
            case "track":
                {
                    this.tracks = this.handleTracks(data, requester);
                    this.playlistInfo = {
                        type: "noPlaylist"
                    };
                    break;
                }
                ;
            default: {
                this.tracks = [];
                this.playlistInfo = {
                    type: "noPlaylist"
                };
                break;
            }
        }
        ;
        this.loadType = loadType;
    }
    ;
    handleTracks(data, requester) {
        if (Array.isArray(data)) {
            return data.map((track) => new Track_1.Track(track, requester));
        }
        else {
            return [new Track_1.Track(data, requester)];
        }
        ;
    }
    ;
    convertNodelinkResponseToLavalink(loadType) {
        switch (loadType) {
            case "short": return "track";
            case "artist":
            case "episode":
            case "station":
            case "podcast":
            case "show":
            case "album": return "playlist";
            default: return loadType;
        }
        ;
    }
    ;
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map