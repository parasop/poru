"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customFilter = void 0;
const Filters_1 = require("./Filters");
/**
 * The customFilters class that is used to apply filters to the currently playing track
 * @extends Filters
 */
class customFilter extends Filters_1.Filters {
    band;
    gain;
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
    }
    /**
     * Set the bassboost value
     * @param val The value of the bassboost
     * @returns
     */
    setBassboost(val) {
        if (!this.player)
            return;
        if (val < 0 && val > 6)
            throw Error('bassboost value must be between 0 to 5');
        this.bassboost = val;
        let num = (val - 1) * (1.25 / 9) - 0.25;
        this.setEqualizer(Array(13).fill(0).map((n, i) => ({
            band: i,
            gain: num
        })));
        return this;
    }
    /**
     * Set slowmode filter
     * @param val The value of the band
     * @returns
     */
    setSlowmode(val) {
        if (!this.player)
            return;
        this.slowmode = val;
        this.setFilters(val
            ? {
                timescale: {
                    speed: 0.5,
                    pitch: 1.0,
                    rate: 0.8,
                },
            }
            : this.clearFilters());
    }
    /**
     * Set Nightcore filter
     * @param val Boolean
     * @returns
     */
    setNightcore(val) {
        if (!this.player)
            return;
        this.nightcore = val;
        this.setTimescale(val ? { rate: 1.5 } : null);
        if (val) {
            this.vaporwave = false;
        }
        return val;
    }
    /**
     * Set Vaporwave filter
     * @param val Boolean
     * @returns
     */
    setVaporwave(val) {
        if (!this.player)
            return;
        this.vaporwave = val;
        if (val) {
            this.nightcore = false;
        }
        this.setTimescale(val ? { pitch: 0.5 } : null);
    }
    /**
     * Set 8D filter
     * @param val Boolean
     * @returns
     */
    set8D(val) {
        if (!this.player)
            return;
        this._8d = val;
        this.setRotation(val ? { rotationHz: 0.2 } : null);
    }
}
exports.customFilter = customFilter;
//# sourceMappingURL=CustomFilters.js.map