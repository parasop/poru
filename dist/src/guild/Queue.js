"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue extends Array {
    constructor() {
        super(...arguments);
    }
    get size() {
        return this.length;
    }
    first() {
        return this ? this[0] : 0;
    }
    add(track) {
        this.push(track);
        return this;
    }
    remove(index) {
        return this.splice(index, 1)[0];
    }
    clear() {
        return this.splice(0);
    }
    shuffle() {
        for (let i = this.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}
exports.default = Queue;
//# sourceMappingURL=Queue.js.map