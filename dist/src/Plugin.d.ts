import { Poru } from "./Poru";
export declare class Plugin {
    name: string;
    constructor(name: string);
    load(poru: Poru): void;
}
