import { Poru } from "./Poru";
import { Node } from "./Node";
export declare class Player {
    emit(op: any, packet: any): void;
    connection: Map<string, this>;
    poru: Poru;
    node: Node;
    constructor(poru: any, node: any, options: any);
    restart(): void;
    destroy(): void;
    move(): void;
}
