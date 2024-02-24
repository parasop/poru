import { Poru } from "../Poru";
export interface trackData {
    encoded: string;
    info: trackInfo;
    pluginInfo: any;
    userData: any;
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
interface trackInfoExtended extends trackInfo {
    requester: any;
}
export declare class Track {
    track: string;
    info: trackInfoExtended;
    pluginInfo: any;
    userData: any;
    constructor(data: trackData, requester?: any);
    /**
     * This function will resolve the track and return the track as resolved
     * @param {Poru} poru The poru instance
     * @returns {Promise<Track>} The resolved track
     */
    resolve(poru: Poru): Promise<Track>;
}
export {};
