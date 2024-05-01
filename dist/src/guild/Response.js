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
        switch (response.loadType) {
            case "playlist": {
                this.tracks = this.handleTracks(response.data.tracks, requester);
                this.playlistInfo = {
                    ...response.data.info,
                    type: "playlist"
                };
                break;
            }
            case "search":
            case "track":
                {
                    this.tracks = this.handleTracks(response.data, requester);
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
        this.loadType = response.loadType;
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
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map