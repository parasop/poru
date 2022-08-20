const { EventEmitter } = require("events");
const Queue = require("./guild/Queue");
const Filters = require("./guild/Filter");
class Player extends EventEmitter {
  constructor(manager, node, options) {
    super();

    this.manager = manager;

    this.queue = new Queue();

    this.node = node;

    this.options = options;

    this.filters = new Filters(this, this.node);

    this.guildId = options.guildId;

    this.voiceChannel = options.voiceChannel.id || options.voiceChannel;

    this.textChannel = options.textChannel || null;

    this.shardId = options.shardId || 1;

    this.isConnected = false;

    this.isPlaying = false;

    this.isPaused = false;

    this.trackRepeat = false;

    this.queueRepeat = false;

    this.loop = 0;

    this.position = 0;

    this.volume = 100;

    this.currentTrack = {};

    this.previousTrack = null;

    this.voiceUpdateState = null;

    this.on("event", (data) => this.lavalinkEvent(data).bind(this)());
    this.on("playerUpdate", (packet) => {
      (this.isConnected = packet.state.connected),
        (this.position = packet.state.position);
      this.manager.emit("playerUpdate", this, packet);
    });
  }

  async play(options = {}) {
    if (!this.queue.length) {
      return null;
    }

    this.currentTrack = this.queue.shift();

    if (!this.currentTrack.track) {
      this.currentTrack = await this.currentTrack.resolve(this.manager);
    }

    this.isPlaying = true;
    this.node.send({
      op: "play",
      guildId: this.guildId,
      track: this.currentTrack.track,
      noReplace: options.noReplace || true,
    });
    this.position = 0;
    return this;
  }

  stop() {
    this.position = 0;
    this.isConnected = false;
    this.isPlaying = false;
    this.node.send({
      op: "stop",
      guildId: this.guildId,
    });
    return this;
  }

  pause(pause = true) {
    if (typeof pause !== "boolean")
      throw new RangeError("Pause function must be pass with boolean value.");

    this.node.send({
      op: "pause",
      guildId: this.guildId,
      pause,
    });
    this.isPlaying = !pause;
    this.isPaused = pause;

    return this;
  }

  async seekTo(position) {
    if (Number.isNaN(position))
      throw new RangeError("[Poru Error] Position must be a number.");
    this.position = position;
    this.node.send({
      op: "seek",
      guildId: this.guildId,
      position,
    });
    return this;
  }

  setVolume(volume) {
    if (Number.isNaN(volume))
      throw new RangeError("Volume level must be a number.");
    this.volume = volume;
    this.node.send({
      op: "volume",
      guildId: this.guildId,
      volume: this.volume,
    });
    return this;
  }

  TrackRepeat() {
    this.loop = 1;
    this.trackRepeat = true;
    this.queueRepeat = false;
    return this;
  }

  QueueRepeat() {
    this.loop = 2;
    this.queueRepeat = true;
    this.trackRepeat = false;
    return this;
  }

  DisableRepeat() {
    this.loop = 0;
    this.trackRepeat = false;
    this.queueRepeat = false;
    return this;
  }

  setTextChannel(channel) {
    if (typeof channel !== "string")
      throw new RangeError("Channel must be a string.");
    this.textChannel = channel;
    return this;
  }

  setVoiceChannel(channel) {
    if (typeof channel !== "string")
      throw new RangeError("Channel must be a string.");
    this.voiceChannel = channel;
    return this;
  }

  connect(options) {
    let { guildId, voiceChannel, deaf, mute } = options;
    this.send(
      {
        guild_id: guildId,
        channel_id: voiceChannel,
        self_deaf: deaf || true,
        self_mute: mute || false,
      },
      true
    );
    this.isConnected = true;
  }

  updateSession(data) {
    if (data) {
      this.voiceUpdateState = data;
      this.node.send({
        op: "voiceUpdate",
        guildId: this.guildId,
        ...data,
      });
    }
    return this;
  }

  reconnect() {
    if (this.voiceChannel === null) return null;
    this.send({
      guild_id: this.guildId,
      channel_id: this.voiceChannel,
      self_mute: false,
      self_deaf: false,
    });

    return this;
  }

  disconnect() {
    if (this.voiceChannel === null) return null;
    this.pause(true);
    this.isConnected = false;
    this.send({
      guild_id: this.guildId,
      channel_id: null,
      self_mute: false,
      self_deaf: false,
    });
    this.voiceChannel = null;
    return this;
  }

  destroy() {
    this.disconnect();
    this.node.send({
      op: "destroy",
      guildId: this.guildId,
    });
    this.manager.emit("playerDestroy", this);
    this.manager.players.delete(this.guildId);
  }

  restart() {
    this.filters.updateFilters();
    if (this.currentTrack) {
      this.isPlaying = true;
      this.node.send({
        op: "play",
        startTime: this.position,
        noReplace: true,
        guildId: this.guildId,
        track: this.currentTrack.track,
        pause: this.isPaused,
      });
    }
  }

  async autoplay(option = false) {
    if (!option) return false;
    try {
      let data = `https://www.youtube.com/watch?v=${
        this.previousTrack.info.identifier || this.currentTrack.info.identifier
      }&list=RD${
        this.previousTrack.info.identifier || this.currentTrack.info.identifier
      }`;

      let response = await this.manager.resolve(
        data,
        this.manager.options.defaultPlatform || "ytsearch"
      );

      if (
        !response ||
        !response.tracks ||
        ["LOAD_FAILED", "NO_MATCHES"].includes(response.loadType)
      )
        return this.stop();

      let track =
        response.tracks[
          Math.floor(Math.random() * Math.floor(response.tracks.length))
        ];

      this.queue.push(track);

      this.play();

      return this;
    } catch (e) {
      console.log(`[Poru Autoplay] error : ${e}`);
      return this.stop();
    }
  }

  send(data) {
    this.manager.sendData({ op: 4, d: data });
  }

  lavalinkEvent(data) {
    const events = {
      TrackStartEvent() {
        this.isPlaying = true;
        this.isPaused = false;
        this.manager.emit("trackStart", this, this.currentTrack, data);
      },
      // eslint-disable-next-line consistent-return
      TrackEndEvent() {
        this.previousTrack = this.currentTrack;

        if (this.currentTrack && this.loop === 1) {
          this.queue.unshift(this.previousTrack);
          this.manager.emit("trackEnd", this, this.currentTrack, data);
          return this.play();
        } else if (this.currentTrack && this.loop === 2) {
          this.queue.push(this.previousTrack);
          this.manager.emit("trackEnd", this, this.currentTrack, data);

          return this.play();
        }

        if (this.queue.length === 0) {
          return this.manager.emit("queueEnd", this, this.track, data);
        } else if (this.queue.length > 0) {
          this.manager.emit("trackEnd", this, this.currentTrack, data);
          return this.play();
        }
        this.manager.emit("queueEnd", this, this.currentTrack, data);
        this.destroy();
      },
      TrackStuckEvent() {
        this.manager.emit("trackError", this, this.currentTrack, data);
        this.stop();
      },
      TrackExceptionEvent() {
        this.manager.emit("trackError", this, this.track, data);
        this.stop();
      },
      WebSocketClosedEvent() {
        if ([4015, 4009].includes(data.code)) {
          this.send({
            guild_id: data.guildId,
            channel_id: this.voiceChannel.id || this.voiceChannel,
            self_mute: this.options.mute || false,
            self_deaf: this.options.deaf || false,
          });
        }
        this.manager.emit("socketClosed", this, data);
      },
      default() {
        throw new Error(`An unknown event: ${data}`);
      },
    };
    return events[data.type] || events.default;
  }
}

module.exports = Player;
