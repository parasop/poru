import { Poru } from "../Poru";
export interface trackData {
    track: string;
    info: trackInfo;
}
export interface trackInfo {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    title: string;
    uri: string;
    sourceName: string;
    image?: string;
}
export declare class Track {
    track: string;
    info: trackInfo;
    constructor(data: trackData);
    resolve(poru: Poru): Promise<this>;
}
