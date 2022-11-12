import {Node} from "./Node";
import { Config as config} from "./config";
export interface NodeGroup {
    name :string;
    host:string;
    port: number;
    secure?: boolean;
    region?: any;
}

export interface PoruOptions {
    library:string;
    defaultPlatform:string;
}

class Poru {

    public readonly client : any;
    public readonly _nodes : NodeGroup[]
    
    public options : PoruOptions;
    public nodes: Map<string, Node>;
    public userId : string | null;
    public version : string
    public isActivated : boolean;
    public send : Function| null;
    constructor(client:any,nodes:NodeGroup[],options:PoruOptions){
    

        this.client = client;
        this._nodes = nodes;
        this.nodes = new Map();
        this.options = options;
        this.userId = null;
        this.version = config.version;
        this.isActivated = false;
        this.send = null;
    }



public init(client:any){

if (this.isActivated) return this;
this.userId = client.user.id;


    switch(this.options.library){
            
        case 'discord.js':
        {
        this.send = (packet :any) => {
                const guild = client.guilds.cache.get(packet.d.guild_id);
                if (guild) guild.shard?.send(packet);
              };
              client.on("raw", async (packet:any) => {
                await this.packetUpdate(packet);
              });



        } 
    }
}

    private packetUpdate(packet:any) {
        
    
}







}









export default Poru