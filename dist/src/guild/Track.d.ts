import { Poru } from "../Poru";
export interface trackData {
    encoded: string;
    info: trackInfo;
    pluginInfo: Record<string, unknown>;
    userData: Record<string, unknown>;
}
export interface trackInfo {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    position: number;
    title: string;
    uri: string | null;
    artworkUrl: string | null;
    isrc: string | null;
    sourceName: string;
}
interface trackInfoWithUndefinedObjects extends Omit<trackInfo, "uri" | "artworkUrl" | "isrc"> {
    uri: string | null | undefined;
    artworkUrl: string | null | undefined;
    isrc: string | null | undefined;
}
type trackInfoExtended = (trackInfo | trackInfoWithUndefinedObjects) & {
    requester: any;
};
export declare class Track {
    track: string;
    info: trackInfoExtended;
    pluginInfo: Record<string, unknown>;
    userData: Record<string, unknown>;
    constructor(data: trackData, requester?: any);
    /**
     * This function will resolve the track and return the track as resolved
     * @param {Poru} poru The poru instance
     * @returns {Promise<Track | null>} The resolved track
     */
    resolve(poru: Poru): Promise<Track | null>;
}
export {};
