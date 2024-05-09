"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customFilter = void 0;
const Filters_1 = require("./Filters");
/**
 * The customFilters class that is used to apply filters to the currently playing track
 * @extends Filters
 */
class customFilter extends Filters_1.Filters {
    slowmode;
    nightcore;
    vaporwave;
    _8d;
    bassboost;
    /**
     * The customFilters class that is used to apply filters to the currently playing track
     * @param player Player
     */
    constructor(player) {
        super(player);
        this.player = player;
        this.bassboost = 0;
        this._8d = false;
        this.vaporwave = false;
        this.nightcore = false;
        this.slowmode = false;
    }
    ;
    /**
     * Set a custom bassboost value
     * @param val The value of the bassboost
     * @returns A promise that resolves into the updated customFilter class
     */
    async setBassboost(val) {
        if (!this.player)
            return this;
        if (val < 0 && val > 6)
            throw Error('[Poru Error] Bassboost value must be between 0 to 5');
        this.bassboost = val;
        const num = (val - 1) * (1.25 / 9) - 0.25;
        await this.setEqualizer(Array(13).fill(0).map((n, i) => ({
            band: i,
            gain: num
        })));
        return this;
    }
    ;
    /**
     * Set a custom slowmode filter
     * @param val The value of the band
     * @returns A promise that resolves into the updated customFilter class
     */
    async setSlowmode(val) {
        if (!this.player)
            return this;
        this.slowmode = val;
        await this.setFilters(val ? { timescale: { speed: 0.5, pitch: 1.0, rate: 0.8 } } : await this.clearFilters());
        return this;
    }
    ;
    /**
     * Set a custom Nightcore filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    async setNightcore(val) {
        if (!this.player)
            return this;
        this.nightcore = val;
        await this.setTimescale(val ? { rate: 1.5 } : undefined);
        if (val) {
            this.vaporwave = false;
        }
        ;
        return this;
    }
    ;
    /**
     * Set a custom Vaporwave filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    async setVaporwave(val) {
        if (!this.player)
            return this;
        this.vaporwave = val;
        if (val) {
            this.nightcore = false;
        }
        ;
        await this.setTimescale(val ? { pitch: 0.5 } : undefined);
        return this;
    }
    ;
    /**
     * Set a custom 8D filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    async set8D(val) {
        if (!this.player)
            return this;
        this._8d = val;
        await this.setRotation(val ? { rotationHz: 0.2 } : undefined);
        return this;
    }
    ;
}
exports.customFilter = customFilter;
;
//# sourceMappingURL=CustomFilters.js.map