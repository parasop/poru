"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const Track_1 = require("./Track");
class Response {
    tracks;
    loadType;
    playlistInfo;
    constructor(data, requester) {
        this.tracks = data?.tracks?.map((track) => new Track_1.Track(track, requester));
        this.loadType = data?.loadType;
        this.playlistInfo = data?.playlistInfo;
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map