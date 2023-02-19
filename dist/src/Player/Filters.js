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
    constructor(player) {
        this.player = player;
        (this.volume = 1.0),
            (this.equalizer = []);
        this.karaoke = null;
        this.timescale = null;
        this.tremolo = null;
        this.vibrato = null;
        this.rotation = null;
        this.distortion = null;
        this.channelMix = null;
        this.lowPass = null;
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