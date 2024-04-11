import { Player } from "./Player";

/**
 * The Band interface that is used to define the band and gain of an equalizer band
 * @interface
 * @property {number} band The band to set the gain of
 * @property {number} gain The gain to set the band to
 * 
 */
interface Band {
    band: number;
    gain: number;
}

/**
 * The karaokeOptions interface that is used to define the karaoke options to apply to the currently playing track
 * @interface
 * @property {number} level The level of the karaoke effect to apply
 * @property {number} monoLevel The mono level of the karaoke effect to apply
 * @property {number} filterBand The filter band of the karaoke effect to apply
 * @property {number} filterWidth The filter width of the karaoke effect to apply
 * 
 */
interface karaokeOptions {
    level: number;
    monoLevel: number;
    filterBand: number;
    filterWidth: number;
}

/**
 * The timescaleOptions interface that is used to define the timescale options to apply to the currently playing track
 * @interface
 * @property {number} speed The speed of the timescale effect to apply
 * @property {number} pitch The pitch of the timescale effect to apply
 * @property {number} rate The rate of the timescale effect to apply
 * 
 */

interface timescaleOptions {
    speed?: number;
    pitch?: number;
    rate?: number;
}

/**
 * The tremoloOptions interface that is used to define the tremolo options to apply to the currently playing track
 * @interface
 * @property {number} frequency The frequency of the tremolo effect to apply
 * @property {number} depth The depth of the tremolo effect to apply
 */
interface tremoloOptions {
    frequency: number;
    depth: number;
}

/**
 * The vibratoOptions interface that is used to define the vibrato options to apply to the currently playing track
 * @interface
 * @property {number} frequency The frequency of the vibrato effect to apply
 * @property {number} depth The depth of the vibrato effect to apply
 * 
 */
interface vibratoOptions {
    frequency: number;
    depth: number;
}

/**
 * The rotationOptions interface that is used to define the rotation options to apply to the currently playing track
 * @interface
 * @property {number} rotationHz The rotation hz of the rotation effect to apply
 * 
 */
interface rotationOptions {
    rotationHz: number;
}

/**
 * The distortionOptions interface that is used to define the distortion options to apply to the currently playing track
 * @interface
 * @property {number} sinOffset The sin offset of the distortion effect to apply
 * @property {number} sinScale The sin scale of the distortion effect to apply
 * @property {number} cosOffset The cos offset of the distortion effect to apply
 * @property {number} cosScale The cos scale of the distortion effect to apply
 * @property {number} tanOffset The tan offset of the distortion effect to apply
 * @property {number} tanScale The tan scale of the distortion effect to apply
 * @property {number} offset The offset of the distortion effect to apply
 * @property {number} scale The scale of the distortion effect to apply
 * 
 */
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

/**
 * The channelMixOptions interface that is used to define the channelMix options to apply to the currently playing track
 * @interface
 * @property {number} leftToLeft The left to left of the channelMix effect to apply
 * @property {number} leftToRight The left to right of the channelMix effect to apply
 * @property {number} rightToLeft The right to left of the channelMix effect to apply
 * @property {number} rightToRight The right to right of the channelMix effect to apply
 * 
 */
export interface channelMixOptions {
    leftToLeft?: number;
    leftToRight?: number;
    rightToLeft?: number;
    rightToRight?: number;
}

/**
 * The FiltersOptions interface that is used to define the filters options to apply to the currently playing track
 * @interface
 * @property {number} volume The volume of the filters effect to apply
 * @property {Band[]} equalizer The equalizer of the filters effect to apply
 * @property {karaokeOptions} karaoke The karaoke of the filters effect to apply
 * @property {tremoloOptions} tremolo The tremolo of the filters effect to apply
 * @property {vibratoOptions} vibrato The vibrato of the filters effect to apply
 * @property {rotationOptions} rotation The rotation of the filters effect to apply
 * @property {distortionOptions} distortion The distortion of the filters effect to apply
 * @property {channelMixOptions} channelMix The channelMix of the filters effect to apply
 * @property {lowPassOptions} lowPass The lowPass of the filters effect to apply
 * @property {timescaleOptions} timescale The timescale of the filters effect to apply
 * 
 */
export interface FiltersOptions {
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
};

/**
 * The lowPassOptions interface that is used to define the lowPass options to apply to the currently playing track
 * @interface
 * @property {number} smoothing The smoothing of the lowPass effect to apply
 */
interface lowPassOptions {
    smoothing: number;
}

/**
 * The Filters class that is used to apply filters to the currently playing track
 */
export class Filters {
    public player: Player;
    public volume: number;
    public equalizer: Band[];
    public karaoke: karaokeOptions | undefined;
    public tremolo: tremoloOptions | undefined;
    public vibrato: vibratoOptions | undefined;
    public rotation: rotationOptions | undefined;
    public distortion: distortionOptions | undefined;
    public channelMix: channelMixOptions | undefined;
    public lowPass: lowPassOptions | undefined;
    public timescale: timescaleOptions | undefined;

    constructor(player: Player, options?: Partial<FiltersOptions>) {
        this.player = player;
        (this.volume = 1.0),
            (this.equalizer = []);
        this.karaoke = options?.karaoke || undefined;
        this.timescale = options?.timescale || undefined;
        this.tremolo = options?.tremolo || undefined;
        this.vibrato = options?.vibrato || undefined;
        this.rotation = options?.rotation || undefined;
        this.distortion = options?.distortion || undefined;
        this.channelMix = options?.channelMix || undefined;
        this.lowPass = options?.lowPass || undefined;
    }
    /**
     * Set equalizer bands for the currently playing track
     * 
     * @param bands An array of bands to set the equalizer to
     * @returns 
     */
    public async setEqualizer(bands: Band[]): Promise<Filters> {
        this.equalizer = bands;
        await this.updateFilters();
        return this;
    };

    /**
        * Change the karaoke Options applied to the currently playing track
        * @param karaoke An object that conforms to the KaraokeOptions type that defines a range of frequencies to mute
        * @returns The current filter instance
        */
    public async setKaraoke(karaoke?: karaokeOptions): Promise<Filters> {
        this.karaoke = karaoke || undefined;
        await this.updateFilters();
        return this;
    };

    /**
     * Change the timescale Options applied to the currently playing track
     * @param timescale An object that conforms to the TimescaleOptions type that defines the timescale to apply
     * @returns The current filter instance
     * 
     */
    public async setTimescale(timescale?: timescaleOptions): Promise<Filters> {
        this.timescale = timescale || undefined;
        await this.updateFilters();
        return this;
    };

    /**
     * Change the tremolo Options applied to the currently playing track
     * 
     * @param tremolo  An object that conforms to the TremoloOptions type that defines the tremolo to apply
     * @returns 
     */
    public async setTremolo(tremolo?: tremoloOptions): Promise<Filters> {
        this.tremolo = tremolo || undefined;
        await this.updateFilters();
        return this;
    };

    /**
     * Change the vibrato Options applied to the currently playing track
     * 
     * @param vibrato An object that conforms to the VibratoOptions type that defines the vibrato to apply
     * @returns 
     */
    public async setVibrato(vibrato?: vibratoOptions): Promise<Filters> {
        this.vibrato = vibrato || undefined;
        await this.updateFilters();
        return this;
    };

    /**
     * Change the rotation Options applied to the currently playing track
     * 
     * @param rotation An object that conforms to the RotationOptions type that defines the rotation to apply
     * @returns 
     */
    public async setRotation(rotation?: rotationOptions): Promise<Filters> {
        this.rotation = rotation || undefined;
        await this.updateFilters();

        return this;
    };

    /**
     * Change the distortion Options applied to the currently playing track
     * 
     * @param distortion An object that conforms to the DistortionOptions type that defines the distortion to apply
     * @returns 
     */
    public async setDistortion(distortion: distortionOptions): Promise<Filters> {
        this.distortion = distortion || undefined;
        await this.updateFilters();

        return this;
    };

    /**
     * Change the channel mix Options applied to the currently playing track
     * 
     * @param mix An object that conforms to the ChannelMixOptions type that defines the channel mix to apply
     * @returns 
     */
    public async setChannelMix(mix: channelMixOptions): Promise<Filters> {
        this.channelMix = mix || undefined;
        await this.updateFilters();

        return this;
    };

    /**
     * Change the low pass Options applied to the currently playing track
     * 
     * @param pass An object that conforms to the LowPassOptions type that defines the low pass to apply
     * @returns 
     */
    public async setLowPass(pass: lowPassOptions): Promise<Filters> {
        this.lowPass = pass || undefined;
        await this.updateFilters();

        return this;
    };

    /**
     * Change the filters of the currently playing track
     * 
     * @param options An object that conforms to the FiltersOptions type that defines the filters to apply
     * @returns 
     */
    public async setFilters(options: Filters | FiltersOptions): Promise<Filters> {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this, options) : new Filters(this.player, options);
        await this.updateFilters();

        return this;
    };

    /**
     * Clears all of the filters to their default values
     * @returns The current filters applied to the currently playing track
     */
    public async clearFilters(): Promise<Filters> {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this.player) : new Filters(this.player);
        await this.updateFilters()
        return this;
    };

    /**
     * Updates all the filters applied to the currently playing track
     * @returns the updated filters applied to the currently playing track
     */
    public async updateFilters(): Promise<Filters> {
        const { equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass, volume } = this;

        await this.player.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: {
                filters: {
                    volume, equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass,
                }
            }
        });

        return this;
    };
};