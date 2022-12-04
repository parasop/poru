"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    emit(op, packet) {
        throw new Error("Method not implemented.");
    }
    connection;
    poru;
    node;
    constructor(poru, node, options) {
        this.poru = poru;
        this.node = node;
        this.connection = new Map();
    }
    restart() { }
    destroy() { }
    move() { }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map