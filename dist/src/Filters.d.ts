import { Player } from "./Player";
interface Band {
    bands: number;
    gain: number;
}
interface karaokeOptions {
    level: number;
    monoLevel: number;
    filterBand: number;
    filterWidth: number;
}
interface timescaleOptions {
    speed?: number;
    pitch?: number;
    rate?: number;
}
interface tremoloOptions {
    frequency: number;
    depth: number;
}
interface vibratoOptions {
    frequency: number;
    depth: number;
}
interface rotationOptions {
    rotationHz: number;
}
interface distortionOptions {
    sinOffset?: number;
    sinScale?: number;
    cosOffset?: number;
    cosScale?: number;
    tanOffset?: number;
    tanScale?: number;
    offset?: number;
    scale?: number;
}
export interface channelMixOptions {
    leftToLeft?: number;
    leftToRight?: number;
    rightToLeft?: number;
    rightToRight?: number;
}
interface lowPassOptions {
    smoothing: number;
}
export declare class Filters {
    player: Player;
    volume: number;
    equalizer: Band[];
    karaoke: karaokeOptions;
    tremolo: tremoloOptions;
    vibrato: vibratoOptions;
    rotation: rotationOptions;
    distortion: distortionOptions;
    channelMix: channelMixOptions;
    lowPass: lowPassOptions;
    timescale: timescaleOptions;
    constructor(player: any);
    setEqualizer(bands: Band[]): Filters;
    /**
        * Change the karaoke Options applied to the currently playing track
        * @param karaoke An object that conforms to the KaraokeOptions type that defines a range of frequencies to mute
        * @returns The current filter instance
        */
    setKaraoke(karaoke?: karaokeOptions): Filters;
    setTimescale(timescale?: timescaleOptions): Filters;
    setTremolo(tremolo?: tremoloOptions): Filters;
    setVibrato(vibrato?: vibratoOptions): Filters;
    setRotation(rotation?: rotationOptions): Filters;
    setDistortion(distortion: distortionOptions): Filters;
    setChannelMix(mix: channelMixOptions): Filters;
    setLowPass(pass: lowPassOptions): Filters;
    clearFilters(): Filters;
    updateFilters(): Filters;
}
export {};
