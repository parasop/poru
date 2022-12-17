import { trackInfo } from "./Track";
export default class Queue extends Array {
    constructor();
    get size(): number;
    first(): any;
    add(track: trackInfo): Queue;
    remove(index: number): any;
    clear(): any[];
    shuffle(): void;
}
