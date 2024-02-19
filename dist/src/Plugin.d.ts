import { Poru } from "./Poru";
export declare class Plugin {
    name: string;
    /**
     * @param name The name of the plugin
     */
    constructor(name: string);
    load(poru: Poru): void;
}
