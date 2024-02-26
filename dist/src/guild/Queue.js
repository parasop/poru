"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue extends Array {
    constructor() {
        super(...arguments);
    }
    /**
     * This get function will return how many Tracks there are in the queue
     */
    get size() {
        return this.length;
    }
    /**
     * This function will show you the first track in the queue
     * @returns {Track | undefined} The first track in the queue or if there are none undefined
     */
    first() {
        return this[0];
    }
    /**
     * This function will add a track to the queue
     * @param {Track} track The Track to add to the queue
     * @returns {Queue} Returns the queue with the added track
     */
    add(track) {
        this.push(track);
        return this;
    }
    /**
     * This function will remove a Track from the Queue
     * @param {number} index The Track to remove trough it's index
     * @returns {Track | undefined} Returns the track. If there was no track at the specified index then it will return undefined
     *
     * @attention This is zero based. So if there is one track in the queue then the index should be 0
     */
    remove(index) {
        return this.splice(index, 1)[0];
    }
    /**
     * This function will clear the entire player's queue
     * @returns All of the cleared tracks or none if there were none to clear
     */
    clear() {
        return this.splice(0);
    }
    /**
     * Shuffles the currnent queue
     * @returns {void} Returns nothing
     *
     */
    shuffle() {
        for (let i = this.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}
exports.default = Queue;
;
//# sourceMappingURL=Queue.js.map