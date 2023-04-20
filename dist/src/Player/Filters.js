"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = void 0;
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
    setTimescale(timescale) {
        this.timescale = timescale || null;
        this.updateFilters();
        return this;
    }
    setTremolo(tremolo) {
        this.tremolo = tremolo || null;
        this.updateFilters();
        return this;
    }
    setVibrato(vibrato) {
        this.vibrato = vibrato || null;
        this.updateFilters();
        return this;
    }
    setRotation(rotation) {
        this.rotation = rotation || null;
        this.updateFilters();
        return this;
    }
    setDistortion(distortion) {
        this.distortion = distortion || null;
        this.updateFilters();
        return this;
    }
    setChannelMix(mix) {
        this.channelMix = mix || null;
        this.updateFilters();
        return this;
    }
    setLowPass(pass) {
        this.lowPass = pass || null;
        this.updateFilters();
        return this;
    }
    setFilters(options) {
        this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this, options) : new Filters(this, options);
        this.updateFilters();
        return this;
    }
    clearFilters() {
        this.player.filters = new Filters(this.player);
        this.updateFilters();
        return this;
    }
    updateFilters() {
        const { equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass, volume } = this;
        this.player.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: { filters: { volume, equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass,
                } }
        });
        return this;
    }
}
exports.Filters = Filters;
//# sourceMappingURL=Filters.js.map