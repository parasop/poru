/// <reference types="node" />
/// <reference types="node" />
import { Node, NodeLinkGetLyrics, NodeStats } from "./Node/Node";
import { EndSpeakingEventVoiceReceiverData, Player, StartSpeakingEventVoiceReceiverData } from "./Player/Player";
import { EventEmitter } from "events";
import { Response } from "./guild/Response";
import { Plugin } from "./Plugin";
import { Track, trackData } from "./guild/Track";
import { Filters } from "./Player/Filters";
import { IVoiceServer, SetStateUpdate } from "./Player/Connection";
export type Constructor<T> = new (...args: any[]) => T;
export interface NodeGroup {
    name: string;
    host: string;
    port: number;
    password: string;
    secure?: boolean;
    region?: string[];
    isNodeLink?: boolean;
}
export type Packet = PacketVoiceStateUpdate | PacketVoiceServerUpdate | AnyOtherPacket;
interface PacketVoiceStateUpdate {
    op: number;
    d: SetStateUpdate;
    t: "VOICE_STATE_UPDATE";
}
interface PacketVoiceServerUpdate {
    op: number;
    d: IVoiceServer;
    t: "VOICE_SERVER_UPDATE";
}
interface AnyOtherPacket {
    op: number;
    d: any;
    t: string;
}
export interface ResolveOptions {
    query: string;
    source?: supportedPlatforms | (string & {});
    requester?: any;
}
export type supportedLibraries = "discord.js" | "eris" | "oceanic" | "other";
export type supportedPlatforms = "spsearch" | "dzsearch" | "amsearch" | "scsearch" | "ytsearch" | "ytmsearch";
export type TrackEndReason = 'finished' | 'loadFailed' | 'stopped' | 'replaced' | 'cleanup';
export type PlayerEventType = 'TrackStartEvent' | 'TrackEndEvent' | 'TrackExceptionEvent' | 'TrackStuckEvent' | 'WebSocketClosedEvent';
/**
 * Represents an event related to a player.
 */
export interface PlayerEvent {
    op: 'event';
    type: PlayerEventType;
    guildId: string;
}
/**
 * Represents an event indicating the start of a track.
 */
export interface TrackStartEvent extends PlayerEvent {
    type: 'TrackStartEvent';
    track: Track;
}
/**
 * Represents an event indicating the end of a track.
 */
export interface TrackEndEvent extends PlayerEvent {
    type: 'TrackEndEvent';
    track: Track;
    reason: TrackEndReason;
}
/**
* Represents an event indicating that a track got stuck while playing.
*/
export interface TrackStuckEvent extends PlayerEvent {
    type: 'TrackStuckEvent';
    track: Track;
    thresholdMs: number;
}
/**
* Represents an event indicating an exception occurred with a track.
*/
export interface TrackExceptionEvent extends PlayerEvent {
    type: 'TrackExceptionEvent';
    exception: any;
}
/**
* Represents an event indicating that a WebSocket connection was closed.
*/
export interface WebSocketClosedEvent extends PlayerEvent {
    type: 'WebSocketClosedEvent';
    code: number;
    byRemote: boolean;
    reason: string;
}
/**
 * The event data
 * @typedef {TrackEndEvent | TrackStuckEvent | WebSocketClosedEvent | TrackStartEvent | TrackExceptionEvent} EventData
 */
export type EventData = TrackEndEvent | TrackStuckEvent | WebSocketClosedEvent | TrackStartEvent | TrackExceptionEvent;
export interface PoruOptions {
    plugins?: Plugin[];
    customPlayer?: Constructor<Player>;
    customFilter?: Constructor<Filters>;
    autoResume?: boolean;
    library: supportedLibraries;
    defaultPlatform?: supportedPlatforms;
    resumeKey?: string;
    resumeTimeout?: number;
    reconnectTimeout?: number | null;
    reconnectTries?: number | null;
    useCustomFilters?: boolean;
    send?: Function | null;
    clientName?: string;
}
export interface ConnectionOptions {
    guildId: string;
    voiceChannel: string;
    textChannel: string;
    deaf?: boolean;
    mute?: boolean;
    region?: string;
}
export interface NodeInfoResponse {
    version: {
        semver: string;
        major: number;
        minor: number;
        patch: number;
        preRelease?: string;
        build?: string;
    };
    buildTime: number;
    git: {
        branch: string;
        commit: string;
        commitTime: string;
    };
    jvm: string;
    lavaplayer: string;
    sourceManagers: string[];
    filters: string[];
    plugins: {
        name: string;
        version: string;
    }[];
}
export type NodeStatsResponse = Omit<NodeStats, "frameStats">;
interface EndSpeakingEventWithBufferForVoiceData extends Omit<EndSpeakingEventVoiceReceiverData, "data"> {
    data: Buffer;
}
export interface PoruEvents {
    /**
     * Emitted for debugging purposes, providing information for debugging.
     * @param {...any} args - Arguments related to debugging information.
     */
    debug: (...args: any) => void;
    /**
     * Emitted when receiving raw data from a specified topic.
     * @param {string} topic - The topic of the raw data.
     * @param {...unknown[]} args - Additional arguments related to the raw data.
     */
    raw: (topic: string, ...args: unknown[]) => void;
    /**
     * Emitted when a node connects to the system.
     * @param {Node} node - The node that has connected.
     */
    nodeConnect: (node: Node) => void;
    /**
     * Emitted when a node disconnects from the system.
     * @param {Node} node - The node that has disconnected.
     * @param {unknown} [event] - Additional event data related to the disconnection.
     */
    nodeDisconnect: (node: Node, event?: unknown) => void;
    /**
     * Emitted when a node successfully reconnects to the system.
     * @param {Node} node - The node that has reconnected.
     */
    nodeReconnect: (node: Node) => void;
    /**
     * Emitted when an error occurs on a node.
     * @param {Node} node - The node where the error occurred.
     * @param {any} event - The error event object containing details about the error.
     */
    nodeError: (node: Node, event: any) => void;
    /**
     * Emitted when a track starts playing on a player.
     * @param {Player} player - The player where the track started playing.
     * @param {Track} track - The track that started playing.
     */
    trackStart: (player: Player, track: Track) => void;
    /**
     * Emitted when a track finishes playing on a player.
     * @param {Player} player - The player where the track finished playing.
     * @param {Track} track - The track that finished playing.
     * @param {TrackEndEvent} data - Additional data related to the end of the track.
     */
    trackEnd: (player: Player, track: Track, data: TrackEndEvent) => void;
    /**
     * Emitted when the queue of a player ends.
     * @param {Player} player - The player whose queue has ended.
     */
    queueEnd: (player: Player) => void;
    /**
     * Emitted when an error occurs while playing a track on a player.
     * @param {Player} player - The player where the error occurred.
     * @param {Track} track - The track where the error occurred.
     * @param {TrackStuckEvent | TrackExceptionEvent} data - Additional data related to the error.
     */
    trackError: (player: Player, track: Track, data: TrackStuckEvent | TrackExceptionEvent) => void;
    /**
     * Emitted when a player's state is updated.
     * @param {Player} player - The player whose state is updated.
     */
    playerUpdate: (player: Player) => void;
    /**
     * Emitted when a new player is created.
     * @param {Player} player - The player that is created.
     */
    playerCreate: (player: Player) => void;
    /**
     * Emitted when a player is destroyed.
     * @param {Player} player - The player that is destroyed.
     */
    playerDestroy: (player: Player) => void;
    /**
     * Emitted when a socket connection is closed.
     * @param {Player} player - The player associated with the socket.
     * @param {Track} track - The track associated with the socket.
     * @param {WebSocketClosedEvent} data - Additional data related to the socket closure.
     */
    socketClose: (player: Player, track: Track, data: WebSocketClosedEvent) => void;
    /**
     * Emitted when a voice Receiver was setup and the user started speaking.
     * @param {Player} player - The player associated with the voice Receiver.
     * @param {StartSpeakingEventVoiceReceiverData} data - Additional data related to the start of speaking.
     */
    startSpeaking: (player: Player, data: StartSpeakingEventVoiceReceiverData) => void;
    /**
     * Emitted when a voice Receiver was setup and the user stopped speaking.
     * @param {Player} player - The player associated with the voice Receiver.
     * @param {EndSpeakingEventVoiceReceiverData} data - Additional data related to the end of speaking including the voice data.
     */
    endSpeaking: (player: Player, data: EndSpeakingEventWithBufferForVoiceData) => void;
    /**
     * Emitted when a voice Receiver encounters an error.
     * @param player The player associated with the voice Receiver.
     * @param error The error that occurred.
     * @returns
     */
    voiceReceiverError: (player: Player, error: any) => void;
    /**
     * Emitted when a voice Receiver connected itself.
     * @param player The player associated with the voice Receiver.
     * @param reason The reason for the connection.
     * @returns
     */
    voiceReceiverConnected: (player: Player, status: string) => void;
    /**
     * Emitted when a voice Receiver disconnected itself.
     * @param player The player associated with the voice Receiver.
     * @param reason The reason for the disconnection.
     * @returns
     */
    voiceReceiverDisconnected: (player: Player, reason: string) => void;
}
export declare interface Poru {
    on<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
    once<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
    emit<K extends keyof PoruEvents>(event: K, ...args: Parameters<PoruEvents[K]>): boolean;
    off<K extends keyof PoruEvents>(event: K, listener: PoruEvents[K]): this;
}
/**
 * Represents Poru, a library for managing audio players with Lavalink.
 * @extends EventEmitter
 */
export declare class Poru extends EventEmitter {
    readonly client: any;
    private readonly _nodes;
    options: PoruOptions;
    nodes: Map<string, Node>;
    players: Map<string, Player>;
    userId: string | null;
    version: number;
    isActivated: boolean;
    send: Function | null;
    /**
     * Creates an instance of Poru.
     * @param {any} client - VoiceClient used for connecting to Lavalink node server.
     * @param {NodeGroup[]} nodes - Array of node groups.
     * @param {PoruOptions} options - Configuration options for Poru.
     */
    constructor(client: any, nodes: NodeGroup[], options: PoruOptions);
    /**
     * Initializes Poru and adds nodes.
     */
    init(): Promise<this | undefined>;
    /**
     * Handles Voice State Update and Voice Server Update packets.
     * @param {Packet} packet - Packet from Discord API.
     * @returns {void}
     */
    packetUpdate(packet: Packet): Promise<void>;
    /**
     * Adds a node to the Poru instance.
     * @param {NodeGroup} options - Node group options.
     * @returns {Node} The added Node instance.
     */
    addNode(options: NodeGroup): Promise<Node>;
    /**
      * Removes a node from the Poru instance.
      * @param {string} identifier - The name of the node.
      * @returns {boolean} A boolean indicating if the node was successfully removed.
      */
    removeNode(identifier: string): Promise<boolean>;
    /**
     * Retrieves nodes by region.
     * @param {string} region - Region of the node.
     * @returns {Node[]} Array of nodes in the specified region.
     */
    getNodeByRegion(region: string): Node[];
    /**
     * Retrieves a node by its identifier.
     * @param {string} [identifier="auto"] - Node name.
     * @returns {Node | Node[]} The specified Node instance or array of nodes.
     */
    getNode(identifier?: string): Node | Node[];
    /**
     * Creates a new player.
     * @param {ConnectionOptions} options - Connection options.
     * @returns {Player} The newly created Player instance.
     */
    createConnection(options: ConnectionOptions): Player;
    private createPlayer;
    /**
     * Removes a player from the Poru instance.
     * @param {string} guildId - Guild ID.
     * @returns {Promise<boolean>} A promise indicating a boolean which is true if an element in the Map existed and has been removed, or false if the element does not exist.
     */
    removeConnection(guildId: string): Promise<boolean>;
    /**
     * Retrieves least used nodes.
     * @returns {Node[]} Array of least used nodes.
     */
    get leastUsedNodes(): Node[];
    /**
     * Resolves a track.
     * @param {ResolveOptions} options - Options for resolving tracks.
     * @param {Node} [node] - Node to use for resolution.
     * @returns {Promise<Response>} The response containing resolved tracks.
     */
    resolve({ query, source, requester }: ResolveOptions, node?: Node): Promise<Response>;
    /**
     * Decodes a track.
     * @param {string} encodedTrackString - The encoded track string.
     * @param {Node} [node] - The node to decode on.
     * @returns {Promise<trackData>} The decoded track.
     */
    decodeTrack(encodedTrackString: string, node?: Node): Promise<trackData | null>;
    /**
     * Decodes multiple tracks.
     * @param {string[]} encodedTrackString - Array of encoded track strings.
     * @param {Node} [node] - The node to decode on.
     * @returns {Promise<trackData[]>} Array of decoded tracks.
     */
    decodeTracks(encodedTrackString: string[], node?: Node): Promise<trackData[]>;
    /**
      * Retrieves Lavalink info for a node.
      * @param {string} name - The name of the node.
      * @returns {Promise<NodeInfoResponse>} Information about the node.
      */
    getLavalinkInfo(name: string): Promise<NodeInfoResponse>;
    /**
     * Retrieves Lavalink status for a node.
     * @param {string} name - The name of the node.
     * @returns {Promise<NodeStatsResponse>} The status of the node.
     */
    getLavalinkStatus(name: string): Promise<NodeStatsResponse>;
    /**
     * This function is used to get lyrics of the current track.
     *
     * @attention This function is only available for [NodeLink](https://github.com/PerformanC/NodeLink) nodes.
     *
     * @param encodedTrack The encoded track to get the lyrics from
     * @param language The language of the lyrics to get defaults to english
     * @returns
     */
    getLyrics(encodedTrack: string | null, language?: string): Promise<NodeLinkGetLyrics | null>;
    /**
     * Retrieves the Lavalink version for a node.
     * @param {string} name - The name of the node.
     * @returns {Promise<string>} The version of the node.
     */
    getLavalinkVersion(name: string): Promise<string>;
    /**
     * Retrieves a player by guild ID.
     * @param {string} guildId - Guild ID.
     * @returns {Player} The player instance for the specified guild.
     */
    get(guildId: string): Player | null;
    private startsWithMultiple;
}
export {};
