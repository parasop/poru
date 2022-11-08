import { EventEmitter } from "node:events";

export interface PlaylistInfo {
  name: string;
  selectedTrack: number;
}

export interface IvoiceServer {
  token: string;
  guild_id: string;
  endpoint: string | null;
}

export interface ResolveResponse {
  loadType:
  | "TRACK_LOADED"
  | "PLAYLIST_LOADED"
  | "SEARCH_RESULT"
  | "NO_MATCHES"
  | "LOAD_FAILED";
  tracks: Track[];
  playlistInfo: PlaylistInfo;
}

export class Track {
  constructor(data: string): this;
  track: string;
  info: {
    identifier: string;
    isSeekable: boolean;
    author: string;
    length: number;
    isStream: boolean;
    sourceName: string;
    title: string;
    uri: string;
    requester?: object | string | null;
    image: string | null;
  };
  resolve: (manager: Poru) => Promise<ResolveResponse>;
}

export class Queue extends Array<Track> {
  constructor(...args: any[]): this;
  get size(): number;
  first: () => Track;
  add: (track: Track) => Queue;
  remove: (index: number) => Queue;
  clear: () => Queue;
  shuffle: () => void;
}

export interface FiltersOptions {
   volume: number;
  _8d?: boolean;
  bassboost?: number;
  equalizer?: {
    band: number;
    gain: number;
  }[];
  karaoke?: boolean;
  timescale?: boolean;
  tremolo?: boolean;
  vibrato?: boolean;
  rotation?: boolean;
  distortion?: boolean;
  channelMix?: boolean;
  lowPass?: boolean;
}


export interface NodeStats {
  players: number;
  playingPlayers: number;
  uptime: number;
  memory: {
    free: number;
    used: number;
    allocated: number;
    reservable: number;
  };
  cpu: {
    cores: number;
    systemLoad: number;
    lavalinkLoad: number;
  };
}

export interface NodeOptions {
  name?: string;
  host?: string;
  port?: number;
  password?: string;
  secure?: boolean;
}

export interface PoruOptions {
  defaultPlatform?: string;
  library?: string,
  reconnectTimeout?: number;
  reconnectTries?: number;
  resumeKey?: string;
  resumeTimeout?: number;
  playlistLimit?: number;
  albumLimit?: number;
  artistLimit?: number;
  searchMarket?: string;
}


export class voiceConnection {

  constructor(player: Player): this;

  player: Player;
  sessionId: string | null;;
  region = string | null;
  muted = boolean | false;
  deafened = boolean | false;
  voiceServer = IvoiceServer | null;

}



export class Node implements INode {
  constructor(manager: Poru, options: NodeOptions, node: PoruOptions): this;
  name: string | null;
  host: string;
  port: number;
  password: string;
  secure: boolean;
  manager: Poru;
  url: string;
  reconnectTimeout: number;
  reconnectTries: number;
  reconnectAttempt: boolean;
  attempt: number;
  resumeKey: string | null;
  resumeTimeout: string;
  reconnects: number;
  isConnected: boolean;
  destroyed: boolean | null;
  stats: NodeStats;
  connect: () => void;
  disconnect: () => void;
  destroy: () => void;
  reconnect: () => void;
  send: (payload: any) => void;
  get penalties(): number;
}

interface PoruEvents {
  nodeConnect: (node: Node) => void;
  nodeClose: (node: Node) => void;
  nodeError: (node: Node, event: any) => void;
  trackStart: (player: Player, track: Track, payload: LavalinkEvents) => void;
  playerUpdate: (
    player: Player,
    data: {
      op: "playerUpdate";
      guildId: string;
      state: {
        time: number;
        position: number;
        connected: boolean;
        ping: number;
      };
    }
  ) => void;
  trackEnd: (player: Player, track: Track, payload: LavalinkEvents) => void;
  trackError: (player: Player, track: Track, payload: LavalinkEvents) => void;
  socketClosed: (
    player: Player,
    data: {
      op: "event";
      type: "WebSocketClosedEvent";
      guildId: string;
      code: number;
      reason: string;
      byRemote: boolean;
    }
  ) => void;
  queueEnd: (player: Player, track: Track, payload: LavalinkEvents) => void;
  playerCreate: (player: Player) => void;
  playerDestroy: (player: Player) => void;
  nodeDestroy: (node: Node) => void;
  nodeReconnect: (node: Node) => void;
}

export class Poru extends EventEmitter {
  constructor(client: any, nodes: NodeOptions[], options?: PoruOptions): this;
  on<U extends keyof PoruEvents>(event: U, listener: PoruEvents[U]): this;
  emit<U extends keyof PoruEvents>(
    event: U,
    ...args: Parameters<PoruEvents[U]>
  ): boolean;

  client: any;
  _nodes: Node[];
  nodes: Map<string, Node>;
  players: Map<string, Player>;
  isActive: boolean;
  user: string | null;
  options: PoruOptions;
  sendData: null;
  version: string;
  spotify: any;
  apple: any;
  deezer: any;
  init: (client: any) => void;
  addNode: (options: NodeOptions) => Node;
  removeNode: (name: string) => void;
  get leastUsedNodes(): Node[];
  getNode: (name: "best" | string) => Node;
  checkConnection: (options: {
    guildId: string;
    voiceChannel: string;
    textChannel: string;
  }) => void;
  createConnection: (options: {
    guildId: string;
    voiceChannel: string;
    textChannel?: string;
    deaf?: boolean;
    mute?: boolean;
  }) => Player;
  removeConnection: (guildId: string) => void;
  packetUpdate: (packet: {
    t: string;
    d: {
      guild_id: string;
    };
  }) => void;
  resolve: (query: string, source?: string) => Promise<ResolveResponse>;
  fetchURL: (node: Node, track: Track) => Promise<ResolveResponse>;
  fetchTrack: (
    node: Node,
    query: string,
    source?: string
  ) => Promise<ResolveResponse>;
  decodeTrack: (track: Track) => Promise<Track>;
  get: (identifier: string) => Player;
}

export type PlayerLoopModes = "NONE" | "TRACK" | "QUEUE";
export type LavalinkEvents =
  | "TrackStartEvent"
  | "TrackEndEvent"
  | "TrackExceptionEvent"
  | "TrackStuckEvent"
  | "WebSocketClosedEvent";

export interface PlayerOptions {
  guildId: string;
  voiceChannel:
  | {
    id: string;
  }
  | string;
  textChannel?: string;
  mute?: boolean;
  deaf?: boolean;
}

export class Player extends EventEmitter {
  constructor(manager: Poru, node: Node, options: PlayerOptions): this;
  manager: Poru;
  queue: Queue;
  node: Node;
  options: PlayerOptions;
  filters: Filters;
  guildId: string;
  voiceChannel: string;
  textChannel: string;
  isConnected: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  loop: PlayerLoopModes;
  position: number;
  ping: number;
  currentTrack: Track | null;
  previousTracks: Track;
  connection: voiceConnection

  play: (options?: { noReplace?: boolean }) => Promise<Player>;
  stop: () => Player;
  pause: (pause: boolean) => Player;
  seekTo: (position: number) => Promise<Player>;
  setVolume: (volume: number) => Player;
  setLoop: (mode: PlayerLoopModes) => Player;
  setTextChannel: (channel: string) => Player;
  setVoiceChannel: (channel: string) => Player;
  connect: (options: {
    guildId: string;
    voiceChannel: string;
    deaf: boolean;
    mute: boolean;
  }) => void;
  reconnect: () => Player;
  disconnect: () => Player;
  destroy: () => void;
  restart: () => void;
  autoplay: (option: boolean) => void;
  send: (payload: any) => void;
  lavalinkEvent: (data: LavalinkEvents) => void;
}


export class Filters {
  constructor(player: Player, options: FiltersOptions): this;
  _8d: boolean | null;
  volume: number;
  bassboost: number | null;
  player: Player;
  node: Node;
  equalizer: { bands: number; gain: number }[] | null;
  karaoke: boolean | null;
  timescale: boolean | null;
  tremolo: boolean | null;
  vibrato: boolean | null;
  rotation: boolean | null;
  distortion: boolean | null;
  channelMix: boolean | null;
  lowPass: boolean | null;

  setEqualizer: (bands: number, gain: number) => void;
  setKaraoke: (value: boolean) => Filters;
  setTimescale: (value: boolean) => Filters;
  setTremolo: (value: boolean) => Filters;
  setVibrato: (value: boolean) => Filters;
  setRotation: (value: boolean) => Filters;
  setDistortion: (value: boolean) => Filters;
  setChannelMix: (value: boolean) => Filters;
  setLowPass: (value: boolean) => Filters;
  setFilters: (options: any) => Filters;
  clearFilters: () => Filters;
  setNightcore: (value: boolean) => boolean;
  setSlowmode: (value: boolean) => void;
  setVaporwave: (value: boolean) => void;
  set8D: (value: boolean) => void;
  setBassboost: (value: number) => void;
  updateFilters: () => void;
}
