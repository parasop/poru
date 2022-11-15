import { Poru } from "./Poru";
import { Node } from "./Node";
export class Player {
  emit(op: any, packet: any) {
    throw new Error("Method not implemented.");
  }

  public connection: Map<string, this>;

  public poru: Poru;
  public node: Node;

  constructor(poru, node, options) {
    this.poru = poru;
    this.node = node;
    this.connection = new Map();
  }

  public restart() {}
  public destroy() {}
  public move() {}
}
