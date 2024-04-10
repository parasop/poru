import { Player } from "./Player";
import { Filters, FiltersOptions } from "./Filters";

/**
 * The customFilters class that is used to apply filters to the currently playing track
 * @extends Filters
 */
export class customFilter extends Filters {
    public slowmode: boolean;
    public nightcore: boolean;
    public vaporwave: boolean;
    public _8d: boolean;
    public bassboost: number;

    /**
     * The customFilters class that is used to apply filters to the currently playing track
     * @param player Player
     */
    constructor(player: Player) {
        super(player);
        this.player = player;
        this.bassboost = 0;
        this._8d = false;
        this.vaporwave = false;
        this.nightcore = false;
        this.slowmode = false;
    };

    /**
     * Set a custom bassboost value
     * @param val The value of the bassboost
     * @returns A promise that resolves into the updated customFilter class
     */
    public async setBassboost(val: number): Promise<customFilter> {
        if (!this.player) return this;
        if (val < 0 && val > 6) throw Error('[Poru Error] Bassboost value must be between 0 to 5')

        this.bassboost = val;

        const num = (val - 1) * (1.25 / 9) - 0.25;

        await this.setEqualizer(Array(13).fill(0).map((n, i) => ({
            band: i,
            gain: num
        })));

        return this;
    };

    /**
     * Set a custom slowmode filter
     * @param val The value of the band
     * @returns A promise that resolves into the updated customFilter class
     */
    public async setSlowmode(val: boolean): Promise<customFilter>  {
        if (!this.player) return this;
        this.slowmode = val;

       await this.setFilters(val ? { timescale: { speed: 0.5, pitch: 1.0, rate: 0.8 } } as FiltersOptions : await this.clearFilters());
       return this;
    };

    /**
     * Set a custom Nightcore filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    public async setNightcore(val: boolean): Promise<customFilter> {
        if (!this.player) return this;
        this.nightcore = val;

        await this.setTimescale(val ? { rate: 1.5 } : undefined);

        if (val) {
            this.vaporwave = false;
        };

        return this;
    };

    /**
     * Set a custom Vaporwave filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    public async setVaporwave(val: boolean): Promise<customFilter> {
        if (!this.player) return this;
        this.vaporwave = val;

        if (val) {
            this.nightcore = false;
        };

        await this.setTimescale(val ? { pitch: 0.5 } : undefined);
        return this;
    };

    /**
     * Set a custom 8D filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    public async set8D(val: boolean) {
        if (!this.player) return this;
        this._8d = val;

        await this.setRotation(val ? { rotationHz: 0.2 } : undefined);
        return this;
    };
};
