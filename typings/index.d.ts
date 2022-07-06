import { EventEmitter, WebSocket } from "ws";

declare module'Poru' {

    import { EventEmitter } from 'events';

    export class Poru extends EventEmitter {
        constructor(client: typeof EventEmitter| any,nodes:[],options:{})

        public  client :typeof EventEmitter | any
        public  nodes :typeof Map
        public  players :typeof Map 
        public  voiceStates :typeof Map
        public  voiceServers :typeof Map 
        public  user : String
        public  options: Object | any
        public  shards :Number
        public  sendData : Function
      

    

    public  on(event: 'nodeConnect' | 'nodeReconnect', listener: (node: Object) => void): this
    public  on(event: 'nodeDisconnect', listener: (event: any, node: Object) => void): this
    public  on(event: 'nodeError', listener: (node: Object, event: any) => void): this
    public  on(event: 'queueEnd', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any ) => void): this
    public  on(event: 'trackStart' | 'trackEnd', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any) => void): this
    public  on(event: 'trackEnd' | 'trackEnd', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any) => void): this
    public  on(event: 'trackStuck' | 'trackError', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any) => void): this
    public  on(event: 'socketClosed', listener: (player:typeof EventEmitter |any,data:Object|any) => void): this



    addNode(options:Object)

    removeNode(identifier:String)

    createConnection(data:Object)

    init(client:typeof EventEmitter|any)

    leastUsedNodes()

    resolve(track:String, source:String)
    
    decodeTrack(tarck:String)

    get(guildID:String)

  }

}


export class Node {
        constructor(manager:typeof EventEmitter|any,options:object,node:object)

        public manager: EventEmitter
        public name: string
        public host: string
        public port : number
        public url : string
        public password: string
        public secure: boolean
        public ws: WebSocket
        public reconnectTime : number
        public resumeKey:string|number;
        public resumeTimeout: number
        public reconnectAttempt:number;
        public reconnects:number;
        public isConnected:boolean;
        public destroyed:boolean;
        public stats:Object


        connect():void

        destroy(): void

        reconnect(): void

        send(playload:Object): void | Object | String

        get penalties():Number

}


export class Player extends EventEmitter {
        constructor(manager:EventEmitter,node:Map<any, any>|Object, options:Object)

        
        public  manager:EventEmitter

        public  queue:Array<any> |any

        public  node: Map<any, any>|Object|Any;

        public  filters: any

        public  guild:String

        public  voiceChannel:any

        public  textChannel:any;

        public  isConnected: boolean;

        public  isPlaying:boolean;

        public  isPause:boolean;

        public  trackRepeat:boolean;

        public  queueRepeat:boolean;

        public  loop:Number;

        public  position :Number;

        public  volume :Number;

        public  currentTrack:Object

        public  previousTrack:Object;

        public  voiceUpdateState:any;


        play()
        
        stop()

        pause(pause:Boolean)

        seekTo(position:Number)

        setVolume(volume:Number)

        TrackRepeat();

        QueueRepeat();

        DisableRepeat();

        setTextChannel(channel:any)

        setVoiceChannel(channel:any)

        connect(data:any)

        reconnect()

        disconnect()

        destroy()

        autoplay(toggle:Boolean)

}