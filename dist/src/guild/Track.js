"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
class Track {
    track;
    info;
    constructor(data, requester) {
        this.track = data.track;
        this.info = {
            identifier: data.info.identifier,
            isSeekable: data.info.isSeekable,
            author: data.info.author,
            length: data.info.length,
            isStream: data.info.isStream,
            sourceName: data.info.sourceName,
            title: data.info.title,
            uri: data.info.uri,
            image: data.info.image || `https://i.ytimg.com/vi/${data.info.identifier}/maxresdefault.jpg` || null,
            requester
        };
    }
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
                this.info.identifier = officialAudio.info.identifier;
                this.track = officialAudio.track;
                return this;
            }
        }
        if (this.info.length) {
            const sameDuration = result.tracks.find((track) => track.info.length >= (this.info.length ? this.info.length : 0) - 2000 &&
                track.info.length <= (this.info.length ? this.info.length : 0) + 2000);
            if (sameDuration) {
                this.info.identifier = sameDuration.info.identifier;
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