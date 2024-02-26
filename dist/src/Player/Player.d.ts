/// <reference types="node" />
import { Poru, ResolveOptions, EventData } from "../Poru";
import { Node } from "../Node/Node";
import { Track } from "../guild/Track";
import { Connection } from "./Connection";
import Queue from "../guild/Queue";
import { EventEmitter } from "events";
import { Filters } from "./Filters";
import { Response } from "../guild/Response";
import { ConnectionOptions } from "../Poru";
/**
 * The loop type
 * @typedef {string} Loop
 * @property {string} NONE - No loop
 */
type Loop = "NONE" | "TRACK" | "QUEUE";
export declare class Player extends EventEmitter {
    readonly data: Record<string, unknown>;
    poru: Poru;
    node: Node;
    connection: Connection;
    queue: Queue;
    filters: Filters;
    guildId: string;
    voiceChannel: string;
    textChannel: string;
    currentTrack: Track;
    previousTrack: Track;
    isPlaying: boolean;
    isPaused: boolean;
    isConnected: boolean;
    isAutoPlay: boolean;
    isQuietMode: boolean;
    loop: Loop;
    position: number;
    ping: number;
    timestamp: number;
    mute: boolean;
    deaf: boolean;
    volume: number;
    constructor(poru: Poru, node: Node, options: ConnectionOptions);
    /**
     * Play a track
     * @returns {Promise<Player>} The newly updated player whose playing the song
     */
    play(): Promise<Player>;
    /**
      * Resolve a track
      * @param {Track} track - Only for personal use
      * @returns {Promise<Track>} Returns a Track
      */
    private resolveTrack;
    /**
     * This function will make the bot connect to a voice channel.
     * @param {ConnectionOptions} options To connect to voice channel
     * @returns {void} void
     */
    connect(options?: ConnectionOptions): void;
    /**
     * This function will stop the current song
     * @returns {Promise<Player>} Returns the player after stopping the song
     *
     * You can use this function to also skip the current song
     */
    stop(): Promise<Player>;
    /**
     *
     * @param {boolean} toggle Boolean to pause or resume the player || Default = true
     * @returns {Promise<Player>} To pause or resume the player
     */
    pause(toggle?: boolean): Promise<Player>;
    /**
     * This function will seek to the specified position
     * @param {number} position Number to seek to the position
     * @returns {Promise<void>} void
     */
    seekTo(position: number): Promise<void>;
    /**
     * This function will set the volume to a specified number between 0 and 1000
     * @param volume Number to set the volume
     * @returns {Promise<Player>} The newly updated Player
     */
    setVolume(volume: number): Promise<Player>;
    /**
     * This function will activate the loop mode. These are the options `NONE, TRACK, QUEUE`
     * @param {Loop} mode Loop mode
     * @returns {Player} Returns the newly updated Player
     */
    setLoop(mode: Loop): Player;
    /**
     * This function will set the text channel in the player
     * @param {string} channel String to set the text channel
     * @returns {Player} Returns the newly updated Player
     */
    setTextChannel(channel: string): Player;
    /**
     * This function will set the voice channel
     * @param {string} channel String to set the voice channel
     * @param {Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>} options Options `mute` and `deaf`
     * @returns {Player} Returns the newly updated Player
     */
    setVoiceChannel(channel: string, options?: Required<Omit<ConnectionOptions, "guildId" | "region" | "textChannel" | "voiceChannel">>): Player;
    /**
     * This will set a value to a key
     * @param {string} key Key to set the value
     * @param {unknown} value Value to set the key
     * @returns {K} To set the key and value
     */
    set<K>(key: string, value: K): K;
    /**
     * This will retrieve the value via the key
     * @param {string} key Key to get the value
     * @returns {K} Returns the data that was obtained via the key
     */
    get<K>(key: string): K;
    /**
     * This function will disconnect us from the channel
     * @returns {Promise<Player>} Returns the newly updated Player
     */
    disconnect(): Promise<Player>;
    /**
     * Destroys the player for this guild.
     * @returns {Promise<boolean>} Indicating if the player was successfully destroyed
     */
    destroy(): Promise<boolean>;
    /**
     * This function will restart the player and play the current track
     * @returns {Promise<Player>} Returns a Player object
     */
    restart(): Promise<Player>;
    /**
     * This function will move the node from the current player
     * @param {string} name The name of the node to move to
     * @returns
     */
    moveNode(name: string): Promise<Player>;
    /**
     * This function will autmatically move the node to the leastUsed Node for the current player
     * @returns Promise of Player or nothing if there was no node to move to or a error came up
     */
    autoMoveNode(): Promise<Player | void>;
    /**
     * This function will automatically add a track to the queue and play it
     * @returns The newly updated Player which is playing the song
     */
    autoplay(): Promise<Player>;
    /**
     * This function will handle all the events
     * @param {EventData} data The data of the event
     * @returns {Promise<Player | boolean | void>} The Player object, a boolean or void
     */
    eventHandler(data: EventData): Promise<Player | boolean | void>;
    /**
     * This function will get the track by it's name or identifier or url and will return the track data
     * @param {ResolveOptions} param0 The parameters to resolve the track
     * @returns {Promise<Response>} The response of the track data which was searched for
     */
    resolve({ query, source, requester }: ResolveOptions): Promise<Response>;
    /**
     *
     * @param data The data to send to the voice server from discord
     * @returns {void} void
     */
    send(data: any): void;
}
export {};
