import { Player } from "./Player";
import { Filters } from "./Filters";
/**
 * The customFilters class that is used to apply filters to the currently playing track
 * @extends Filters
 */
export declare class customFilter extends Filters {
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
     * Set a custom bassboost value
     * @param val The value of the bassboost
     * @returns A promise that resolves into the updated customFilter class
     */
    setBassboost(val: number): Promise<customFilter>;
    /**
     * Set a custom slowmode filter
     * @param val The value of the band
     * @returns A promise that resolves into the updated customFilter class
     */
    setSlowmode(val: boolean): Promise<customFilter>;
    /**
     * Set a custom Nightcore filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    setNightcore(val: boolean): Promise<customFilter>;
    /**
     * Set a custom Vaporwave filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    setVaporwave(val: boolean): Promise<customFilter>;
    /**
     * Set a custom 8D filter
     * @param val Boolean
     * @returns A promise that resolves into the updated customFilter class
     */
    set8D(val: boolean): Promise<this>;
}
