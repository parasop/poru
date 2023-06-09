import { Player } from "./Player";
import { Filters } from "./Filters";
/**
 * The customFilters class that is used to apply filters to the currently playing track
 * @extends Filters
 */
export declare class customFilter extends Filters {
    band: number;
    gain: number;
    slowmode: boolean;
    nightcore: boolean;
    vaporwave: boolean;
    _8d: boolean;
    bassboost: number;
    /**
     * The customFilters class that is used to apply filters to the currently playing track
     * @param player Player
     */
    constructor(player: Player);
    /**
     * Set the bassboost value
     * @param val The value of the bassboost
     * @returns
     */
    setBassboost(val: number): this;
    /**
     * Set slowmode filter
     * @param val The value of the band
     * @returns
     */
    setSlowmode(val: boolean): this;
    /**
     * Set Nightcore filter
     * @param val Boolean
     * @returns
     */
    setNightcore(val: boolean): boolean;
    /**
     * Set Vaporwave filter
     * @param val Boolean
     * @returns
     */
    setVaporwave(val: boolean): void;
    /**
     * Set 8D filter
     * @param val Boolean
     * @returns
     */
    set8D(val: boolean): void;
}
