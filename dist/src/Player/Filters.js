"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = void 0;
;
/**
 * The Filters class that is used to apply filters to the currently playing track
 */
class Filters {
    player;
    volume;
    equalizer;
    karaoke;
    tremolo;
    vibrato;
    rotation;
    distortion;
    channelMix;
    lowPass;
    timescale;
    constructor(player, options) {
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
    async setEqualizer(bands) {
        this.equalizer = bands;
        await this.updateFilters();
        return this;
    }
    ;
    /**
        * Change the karaoke Options applied to the currently playing track
        * @param karaoke An object that conforms to the KaraokeOptions type that defines a range of frequencies to mute
        * @returns The current filter instance
        */
    async setKaraoke(karaoke) {
        this.karaoke = karaoke || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the timescale Options applied to the currently playing track
     * @param timescale An object that conforms to the TimescaleOptions type that defines the timescale to apply
     * @returns The current filter instance
     *
     */
    async setTimescale(timescale) {
        this.timescale = timescale || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the tremolo Options applied to the currently playing track
     *
     * @param tremolo  An object that conforms to the TremoloOptions type that defines the tremolo to apply
     * @returns
     */
    async setTremolo(tremolo) {
        this.tremolo = tremolo || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the vibrato Options applied to the currently playing track
     *
     * @param vibrato An object that conforms to the VibratoOptions type that defines the vibrato to apply
     * @returns
     */
    async setVibrato(vibrato) {
        this.vibrato = vibrato || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the rotation Options applied to the currently playing track
     *
     * @param rotation An object that conforms to the RotationOptions type that defines the rotation to apply
     * @returns
     */
    async setRotation(rotation) {
        this.rotation = rotation || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the distortion Options applied to the currently playing track
     *
     * @param distortion An object that conforms to the DistortionOptions type that defines the distortion to apply
     * @returns
     */
    async setDistortion(distortion) {
        this.distortion = distortion || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the channel mix Options applied to the currently playing track
     *
     * @param mix An object that conforms to the ChannelMixOptions type that defines the channel mix to apply
     * @returns
     */
    async setChannelMix(mix) {
        this.channelMix = mix || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the low pass Options applied to the currently playing track
     *
     * @param pass An object that conforms to the LowPassOptions type that defines the low pass to apply
     * @returns
     */
    async setLowPass(pass) {
        this.lowPass = pass || undefined;
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Change the filters of the currently playing track
     *
     * @param options An object that conforms to the FiltersOptions type that defines the filters to apply
     * @returns
     */
    async setFilters(options) {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this, options) : new Filters(this.player, options);
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Clears all of the filters to their default values
     * @returns The current filters applied to the currently playing track
     */
    async clearFilters() {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this.player) : new Filters(this.player);
        await this.updateFilters();
        return this;
    }
    ;
    /**
     * Updates all the filters applied to the currently playing track
     * @returns the updated filters applied to the currently playing track
     */
    async updateFilters() {
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
    }
    ;
}
exports.Filters = Filters;
;
//# sourceMappingURL=Filters.js.map