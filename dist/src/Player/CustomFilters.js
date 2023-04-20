"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customFilter = void 0;
const Filters_1 = require("./Filters");
class customFilter extends Filters_1.Filters {
    band;
    gain;
    slowmode;
    nightcore;
    vaporwave;
    _8d;
    bassboost;
    constructor(player) {
        super(player);
        this.player = player;
    }
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
    setVaporwave(val) {
        if (!this.player)
            return;
        this.vaporwave = val;
        if (val) {
            this.nightcore = false;
        }
        this.setTimescale(val ? { pitch: 0.5 } : null);
    }
    set8D(val) {
        if (!this.player)
            return;
        this._8d = val;
        this.setRotation(val ? { rotationHz: 0.2 } : null);
    }
}
exports.customFilter = customFilter;
//# sourceMappingURL=CustomFilters.js.map