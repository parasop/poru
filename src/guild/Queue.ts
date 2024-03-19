import { Track } from "./Track"

export default class Queue extends Array<Track> {
    /**
     * Returns the number of tracks in the queue.
     * @type {number}
     */
    public get size(): number {
        return this.length;
    }

    /**
     * Returns the first track in the queue.
     * @returns {Track | undefined} The first track in the queue, or undefined if the queue is empty.
     */
    public first(): Track | undefined {
        return this[0];
    }

    /**
     * Adds a track to the queue.
     * @param {Track} track - The track to add to the queue.
     * @returns {Queue} The queue with the added track.
     */
    public add(track: Track): this {
        this.push(track);
        return this;
    }

    /**
    /**
     * Removes a track from the queue by its index.
     * @param {number} index - The index of the track to remove.
     * @returns {Track | undefined} The removed track, or undefined if the index is out of range.
     */
    public remove(index: number): Track | undefined {
        return (this as Track[]).splice(index, 1)[0];
    }

   /**
     * Clears the entire queue.
     * @returns {Track[]} An array containing all the cleared tracks, or an empty array if the queue was already empty.
     */
    public clear(): Track[] | [] {
        return (this as Track[]).splice(0);
    }

    /**
     * Shuffles the tracks in the queue.
     * @returns {void} This method does not return anything.
     */
    public shuffle(): void {
        for (let i = this.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
};