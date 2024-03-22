"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue extends Array {
    /**
     * Returns the number of tracks in the queue.
     * @type {number}
     */
    get size() {
        return this.length;
    }
    /**
     * Returns the first track in the queue.
     * @returns {Track | undefined} The first track in the queue, or undefined if the queue is empty.
     */
    first() {
        return this[0];
    }
    /**
     * Adds a track to the queue.
     * @param {Track} track - The track to add to the queue.
     * @returns {Queue} The queue with the added track.
     */
    add(track) {
        this.push(track);
        return this;
    }
    /**
    /**
     * Removes a track from the queue by its index.
     * @param {number} index - The index of the track to remove.
     * @returns {Track | undefined} The removed track, or undefined if the index is out of range.
     */
    remove(index) {
        return this.splice(index, 1)[0];
    }
    /**
      * Clears the entire queue.
      * @returns {Track[]} An array containing all the cleared tracks, or an empty array if the queue was already empty.
      */
    clear() {
        return this.splice(0);
    }
    /**
     * Shuffles the tracks in the queue.
     * @returns {void} This method does not return anything.
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