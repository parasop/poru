import { Poru,PoruOptions,NodeGroup } from "./Poru";
import WebScoket from "ws";
import {fetch} from "undici";
import { Options } from "undici/types/connector";

export class Node {

    public readonly isConnected:boolean;
    public readonly poru:Poru;
    public readonly name: string;
    public readonly url:string;
    public readonly secure:boolean;
    public readonly regions:Array<string>;
    public readonly ws:WebScoket | null;
    public readonly resumeKey: string | null;
    public readonly resumeTimeout : number;
    public readonly reconnectTimeout: number;
    public readonly reconnectTries : number;
    public readonly reconnectAttempt : number;
    public readonly attempt : number;
    
    constructor(poru:Poru,node:NodeGroup,options:PoruOptions) {
        this.poru = poru;
        this.name = node.name;
        this.url = `${node.secure ? "wss" : "ws"}://${node.host}:${node.port}/`;
        this.secure = node.secure || false;
        this.regions = node.region || null;
        this.ws = null;
        this.resumeKey =   options.resumeKey || null;
        this.resumeTimeout = options.resumeTimeout || 60;
     
        this.reconnectTimeout = options.reconnectTimeout || 5000;
        this.reconnectTries = options.reconnectTries || 5;
        this.reconnectAttempt = 0;
        this.attempt = 0;
        this.isConnected = false;
       


    }



    public connect(){

    }

    public destroy(){

    }
}