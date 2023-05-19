import { Track } from "./Track"
export default class Queue extends Array {
  constructor() {
    super(...arguments);
  }

  get size(): number {
    return this.length;
  }

  first() {
    return this ? this[0] : 0;
  }

  add(track: Track): Queue {
    this.push(track);
    return this;
  }

  remove(index: number) {
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


