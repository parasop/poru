/// <reference types="node" />
import { Poru, ResolveOptions } from "../Poru";
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
    loop: Loop;
    position: number;
    ping: number;
    timestamp: number;
    mute: boolean;
    deaf: boolean;
    volume: number;
    constructor(poru: Poru, node: Node, options: any);
    /**
     * Play a track
     * @param {Track} track - The track to play
     */
    play(): any;
    /**
      * Resolve a track
      * @param {Track} track - Only for personal use
      */
    private resolveTrack;
    /**
     *
     * @param options To connect to voice channel
     *
     */
    connect(options?: ConnectionOptions): void;
    /**
     *
     * @returns {Promise<void>} To disconnect from voice channel
     */
    stop(): this;
    /**
     *
     * @param toggle Boolean to pause or resume the player
     * @returns {Promise<void>} To pause or resume the player
     */
    pause(toggle?: boolean): this;
    /**
     *
     * @param position Number to seek to the position
     */
    seekTo(position: number): void;
    /**
     *
     * @param volume Number to set the volume
     * @returns {Player} To set the volume
     */
    setVolume(volume: number): this;
    /**
     *
     * @param mode Loop mode
     * @returns {Player} To set the loop mode
     */
    setLoop(mode: Loop): this;
    /**
     *
     * @param channel String to set the text channel
     * @returns {Player} To set the text channel
     */
    setTextChannel(channel: string): this;
    /**
     *
     * @param channel String to set the voice channel
     * @param options Options `mute` and `deaf`
     * @returns {Player} To set the voice channel
     */
    setVoiceChannel(channel: string, options?: {
        mute: boolean;
        deaf: boolean;
    }): this;
    /**
     *
     * @param key Key to set the value
     * @param value Value to set the key
     * @returns {unknown} To set the key and value
     */
    set(key: string, value: unknown): unknown;
    /**
     *
     * @param key Key to get the value
     * @returns
     */
    get<K>(key: string): K;
    /**
     *
     * @returns {Promise<void>} To disconnect from voice channel
     */
    disconnect(): this;
    /**
     * @returns {void} To destroy the player
     */
    destroy(): void;
    restart(): any;
    moveNode(name: string): void;
    AutoMoveNode(): Promise<void>;
    autoplay(requester: any): Promise<this>;
    eventHandler(data: any): any;
    resolve({ query, source, requester }: ResolveOptions): Promise<Response>;
    send(data: any): void;
}
export {};
