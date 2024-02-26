import { Track } from "./Track";
export default class Queue extends Array<Track> {
    constructor();
    /**
     * This get function will return how many Tracks there are in the queue
     */
    get size(): number;
    /**
     * This function will show you the first track in the queue
     * @returns {Track | undefined} The first track in the queue or if there are none undefined
     */
    first(): Track | undefined;
    /**
     * This function will add a track to the queue
     * @param {Track} track The Track to add to the queue
     * @returns {Queue} Returns the queue with the added track
     */
    add(track: Track): Queue;
    /**
     * This function will remove a Track from the Queue
     * @param {number} index The Track to remove trough it's index
     * @returns {Track | undefined} Returns the track. If there was no track at the specified index then it will return undefined
     *
     * @attention This is zero based. So if there is one track in the queue then the index should be 0
     */
    remove(index: number): Track | undefined;
    /**
     * This function will clear the entire player's queue
     * @returns All of the cleared tracks or none if there were none to clear
     */
    clear(): Track[] | [];
    /**
     * Shuffles the currnent queue
     * @returns {void} Returns nothing
     *
     */
    shuffle(): void;
}
