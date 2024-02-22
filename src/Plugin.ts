import { Poru } from "./Poru";

export class Plugin {
    name: string
    /**
     * @param name The name of the plugin
     */
    constructor(name: string) {
        this.name = name
    }

    public load(poru: Poru): void { }
}