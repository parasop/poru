"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
class Track {
    track;
    info;
    pluginInfo;
    userData;
    constructor(data, requester) {
        this.track = data.encoded;
        this.pluginInfo = data.pluginInfo,
            this.userData = data.userData,
            this.info = {
                isrc: data.info.isrc || null,
                uri: data.info.uri || null,
                artworkUrl: data.info.artworkUrl || null,
                ...data.info,
                requester
            };
    }
    /**
     * This function will resolve the track and return the track as resolved
     * @param {Poru} poru The poru instance
     * @returns {Promise<Track>} The resolved track
     */
    async resolve(poru) {
        const query = [this.info.author, this.info.title]
            .filter((x) => !!x)
            .join(" - ");
        const result = await poru.resolve({ query, source: poru.options.defaultPlatform || "ytsearch", requester: this.info.requester });
        if (!result || !result.tracks.length)
            return;
        if (this.info.author) {
            const author = [this.info.author, `${this.info.author} - Topic`];
            const officialAudio = result.tracks.find((track) => author.some((name) => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)) ||
                new RegExp(`^${escapeRegExp(this.info.title)}$`, "i").test(track.info.title));
            if (officialAudio) {
                //this.info.identifier = officialAudio.info.identifier;
                this.track = officialAudio.track;
                return this;
            }
        }
        if (this.info.length) {
            const sameDuration = result.tracks.find((track) => track.info.length >= (this.info.length ? this.info.length : 0) - 2000 &&
                track.info.length <= (this.info.length ? this.info.length : 0) + 2000);
            if (sameDuration) {
                //this.info.identifier = sameDuration.info.identifier;
                this.track = sameDuration.track;
                return this;
            }
        }
        this.info.identifier = result.tracks[0].info.identifier;
        this.track = result.tracks[0].track;
        return this;
    }
}
exports.Track = Track;
//# sourceMappingURL=Track.js.map