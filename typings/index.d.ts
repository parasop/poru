declare module'Poru' {

    import { EventEmitter } from 'events';
    import * as WebSocket from 'ws';


    export class Poru extends EventEmitter {
        constructor(client: typeof EventEmitter| any,nodes:[],options:{})

        public client :typeof EventEmitter | any
        public nodes :typeof Map
        public players :typeof Map 
        public voiceStates :typeof Map
        public voiceServers :typeof Map 
        public user : String
        public options: Object | any
        public shards :Number
        public sendData : Function
      

    

    public on(event: 'nodeConnect' | 'nodeReconnect', listener: (node: Object) => void): this
    public on(event: 'nodeDisconnect', listener: (event: any, node: Object) => void): this
    public on(event: 'nodeError', listener: (node: Object, event: any) => void): this
    public on(event: 'queueEnd', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any ) => void): this
    public on(event: 'trackStart' | 'trackEnd', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any) => void): this
    public on(event: 'trackEnd' | 'trackEnd', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any) => void): this
    public on(event: 'trackStuck' | 'trackError', listener: (player:typeof EventEmitter |any,track:Object,data:Object|any) => void): this
    public on(event: 'socketClosed', listener: (player:typeof EventEmitter |any,data:Object|any) => void): this



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
