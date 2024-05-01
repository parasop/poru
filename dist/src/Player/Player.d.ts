/// <reference types="node" />
import { Poru, ResolveOptions, EventData, ConnectionOptions } from "../Poru";
import { Node } from "../Node/Node";
import { Track } from "../guild/Track";
import { Connection } from "./Connection";
import Queue from "../guild/Queue";
import { EventEmitter } from "events";
import { Filters } from "./Filters";
import { Response } from "../guild/Response";
type Loop = "NONE" | "TRACK" | "QUEUE";
/**
 * Represents a player capable of playing audio tracks.
 * @extends EventEmitter
 */
export declare class Player extends EventEmitter {
    readonly data: Record<string, unknown>;
    /** The Poru instance associated with the player. */
    poru: Poru;
    /** The node associated with the player. */
    node: Node;
    /** The connection associated with the player. */
    connection: Connection;
    /** The queue of tracks for the player. */
    queue: Queue;
    /** Filters applied to the player's audio. */
    filters: Filters;
    /** The guild ID associated with the player. */
    guildId: string;
    /** The guild ID associated with the player. */
    voiceChannel: string;
    /** The text channel ID associated with the player. */
    textChannel: string;
    /** The currently playing track */
    currentTrack: Track | null;
    /** The previously played track */
    previousTrack: Track | null;
    /** Indicates whether the player is currently playing a track. */
    isPlaying: boolean;
    /** Indicates whether the player is connected to a voice channel. */
    isPaused: boolean;
    /** Indicates whether the player is connected to a voice channel. */
    isConnected: boolean;
    /** Indicated whether autoplay mode is enabled. */
    isAutoPlay: boolean;
    /** Indicated whether quiet mode is enabled for the player.  */
    isQuietMode: boolean;
    /** The loop settings for the player. */
    loop: Loop;
    /** The current position of the player in the track (in milliseconds) */
    position: number;
    /** The current delay estimate of the player (in milliseconds) */
    ping: number;
    /** The timestamp of the player's state */
    timestamp: number | null;
    /** Indicates whether the player is set to be muted. */
    mute: boolean;
    /** Indicated whether the player is set to be deafened */
    deaf: boolean;
    /** The volume of the player (0-1000) */
    volume: number;
    constructor(poru: Poru, node: Node, options: ConnectionOptions);
    /**
     * Initiates playback of the next track in the queue.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    play(): Promise<Player>;
    /**
     * Resolves a track before playback.
     * @param {Track} track - The track to resolve.
     * @returns {Promise<Track>} - A Promise that resolves to the resolved track.
     * @private
     */
    private resolveTrack;
    /**
     * Connects the player to a voice channel.
     * @param {ConnectionOptions} [options=this] - The options for the connection.
     */
    connect(options?: ConnectionOptions): void;
    /**
     * Skips the current track.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    skip(): Promise<Player>;
    /**
     * Pauses or resumes playback.
     * @param {boolean} [toggle=true] - Specifies whether to pause or resume playback.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    pause(toggle?: boolean): Promise<Player>;
    /**
     * Seeks to a specific position in the current track.
     * @param {number} position - The position to seek to (in milliseconds).
     */
    seekTo(position: number): Promise<void>;
    /**
     * Sets the volume level of the player.
     * @param {number} volume - The volume level (0 to 1000).
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    setVolume(volume: number): Promise<Player>;
    /**
     * Sets the loop mode of the player.
     * @param {Loop} mode - The loop mode to set.
     * @returns {Player} - The Player instance.
     */
    setLoop(mode: Loop): this;
    /**
     * Sets the text channel associated with the player.
     * @param {string} channel - The ID of the text channel.
     * @returns {Player} - The Player instance.
     */
    setTextChannel(channel: string): this;
    /**
     * Sets the voice channel associated with the player.
     * @param {string} channel - The ID of the voice channel.
     * @param {ConnectionOptions} [options] - The options for the connection.
     * @returns {Player} - The Player instance.
     */
    setVoiceChannel(channel: string, options?: Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>): this;
    /**
     * Sets a custom data value associated with the player.
     * @param {string} key - The key for the data value.
     * @param {K} value - The value to set.
     * @returns {K} - The set value.
     */
    set<K>(key: string, value: K): K;
    /**
     * Retrieves a custom data value associated with the player.
     * @param {string} key - The key for the data value.
     * @returns {K} - The retrieved value.
     */
    get<K>(key: string): K;
    /**
     * Disconnects the player from the voice channel.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    protected disconnect(): Promise<Player>;
    /**
     * Destroys the player and cleans up associated resources.
     * @returns {Promise<boolean>} - A Promise that resolves to a boolean which is true if an element in the Map existed and has been removed, or false if the element does not exist.
     */
    destroy(): Promise<boolean>;
    /**
     * Restarts playback from the current track.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    restart(): Promise<Player>;
    /**
     * Moves the player to a different node.
     * @param {string} name - The name of the target node.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    moveNode(name: string): Promise<Player>;
    /**
     * Automatically moves the player to a less used node.
     * @returns {Promise<Player | void>} - A Promise that resolves to the Player instance or void.
     */
    autoMoveNode(): Promise<Player | void>;
    /**
     * Enables autoplay functionality for the player.
     * @returns {Promise<Player>} - A Promise that resolves to the Player instance.
     */
    autoplay(): Promise<Player>;
    /**
     * Handles incoming events for the player.
     * @param {EventData} data - The event data.
     * @returns {Promise<Player | boolean | void>} - A Promise that resolves to the Player instance, a boolean, or void.
     */
    eventHandler(data: EventData): Promise<Player | boolean | void>;
    /**
     * Resolves a query to obtain audio tracks.
     * @param {ResolveOptions} options - The options for resolving the query.
     * @returns {Promise<Response>} - A Promise that resolves to a Response object containing the resolved tracks.
     */
    resolve({ query, source, requester }: ResolveOptions): Promise<Response>;
    /**
     * Sends data to the Poru system.
     * @param {any} data - The data to send.
     */
    send(data: any): void;
}
export {};
