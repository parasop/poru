"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = void 0;
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
        this.karaoke = options?.karaoke || null;
        this.timescale = options?.timescale || null;
        this.tremolo = options?.tremolo || null;
        this.vibrato = options?.vibrato || null;
        this.rotation = options?.rotation || null;
        this.distortion = options?.distortion || null;
        this.channelMix = options?.channelMix || null;
        this.lowPass = options?.lowPass || null;
    }
    /**
     * Set equalizer bands for the currently playing track
     *
     * @param bands An array of bands to set the equalizer to
     * @returns
     */
    setEqualizer(bands) {
        this.equalizer = bands;
        this.updateFilters();
        return this;
    }
    /**
        * Change the karaoke Options applied to the currently playing track
        * @param karaoke An object that conforms to the KaraokeOptions type that defines a range of frequencies to mute
        * @returns The current filter instance
        */
    setKaraoke(karaoke) {
        this.karaoke = karaoke || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the timescale Options applied to the currently playing track
     * @param timescale An object that conforms to the TimescaleOptions type that defines the timescale to apply
     * @returns The current filter instance
     *
     */
    setTimescale(timescale) {
        this.timescale = timescale || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the tremolo Options applied to the currently playing track
     *
     * @param tremolo  An object that conforms to the TremoloOptions type that defines the tremolo to apply
     * @returns
     */
    setTremolo(tremolo) {
        this.tremolo = tremolo || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the vibrato Options applied to the currently playing track
     *
     * @param vibrato An object that conforms to the VibratoOptions type that defines the vibrato to apply
     * @returns
     */
    setVibrato(vibrato) {
        this.vibrato = vibrato || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the rotation Options applied to the currently playing track
     *
     * @param rotation An object that conforms to the RotationOptions type that defines the rotation to apply
     * @returns
     */
    setRotation(rotation) {
        this.rotation = rotation || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the distortion Options applied to the currently playing track
     *
     * @param distortion An object that conforms to the DistortionOptions type that defines the distortion to apply
     * @returns
     */
    setDistortion(distortion) {
        this.distortion = distortion || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the channel mix Options applied to the currently playing track
     *
     * @param mix An object that conforms to the ChannelMixOptions type that defines the channel mix to apply
     * @returns
     */
    setChannelMix(mix) {
        this.channelMix = mix || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the low pass Options applied to the currently playing track
     *
     * @param pass An object that conforms to the LowPassOptions type that defines the low pass to apply
     * @returns
     */
    setLowPass(pass) {
        this.lowPass = pass || null;
        this.updateFilters();
        return this;
    }
    /**
     * Change the filters of the currently playing track
     *
     * @param options An object that conforms to the FiltersOptions type that defines the filters to apply
     * @returns
     */
    setFilters(options) {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this, options) : new Filters(this.player, options);
        this.updateFilters();
        return this;
    }
    /**
     *
     * @returns The current filters applied to the currently playing track
     */
    clearFilters() {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this.player) : new Filters(this.player);
        this.updateFilters();
        return this;
    }
    /**
     *
     * @returns the updated filters applied to the currently playing track
     */
    updateFilters() {
        const { equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass, volume } = this;
        this.player.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: {
                filters: {
                    volume, equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass,
                }
            }
        });
        return this;
    }
}
exports.Filters = Filters;
//# sourceMappingURL=Filters.js.map