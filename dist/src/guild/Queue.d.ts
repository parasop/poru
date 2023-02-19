import { Track } from "./Track";
export default class Queue extends Array {
    constructor();
    get size(): number;
    first(): any;
    add(track: Track): Queue;
    remove(index: number): any;
    clear(): any[];
    shuffle(): void;
}
