import { Poru } from "../Poru";
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export interface trackData {
    encoded: string;
    info: trackInfo;
    pluginInfo: any,
    userData: any,
}

export interface trackInfo {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    position: number;
    title: string;
    uri?: string;
    artworkUrl?: string;
    isrc: string | null;
    sourceName: string;
}

interface trackInfoExtended extends trackInfo { requester: any; }

export class Track {
    public track: string;
    public info: trackInfoExtended;
    public pluginInfo: any;
    public userData: any;

    constructor(data: trackData, requester?: any) {
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
    public async resolve(poru: Poru): Promise<Track> {
        const query = [this.info.author, this.info.title]
            .filter((x) => !!x)
            .join(" - ");
        const result = await poru.resolve({ query, source: poru.options.defaultPlatform || "ytsearch", requester: this.info.requester });
        if (!result || !result.tracks.length) return;

        if (this.info.author) {
            const author = [this.info.author, `${this.info.author} - Topic`];
            const officialAudio = result.tracks.find(
                (track) =>
                    author.some((name) =>
                        new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)
                    ) ||
                    new RegExp(`^${escapeRegExp(this.info.title)}$`, "i").test(
                        track.info.title
                    )
            );
            if (officialAudio) {
                //this.info.identifier = officialAudio.info.identifier;
                this.track = officialAudio.track;
                return this;
            }
        }

        if (this.info.length) {
            const sameDuration = result.tracks.find(
                (track) =>
                    track.info.length >= (this.info.length ? this.info.length : 0) - 2000 &&
                    track.info.length <= (this.info.length ? this.info.length : 0) + 2000
            );

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