import { Poru } from "./Poru";

export class Plugin {
    name:string
    constructor(name:string){
        this.name = name
    }
    public load(poru: Poru): void { }
  
  }