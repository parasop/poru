const { fetch } = require("undici");
const PoruTrack = require("../guild/PoruTrack");
let baseURL =
  /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/;

class AppleMusic {
  constructor(manager, options) {
    this.manager = manager;
    this.options = {
      playlistLimit: options.playlistLimit || null,
      albumLimit: options.albumLimit || null,
      artistLimit: options.artistLimit || null,
      searchMarket: options.searchMarket || "us",
      imageHeight: options.imageHeight || 500,
      imageWeight: options.imageWeight || 500,
    };
    this.url = `https://amp-api.music.apple.com/v1/catalog/${this.options.searchMarket}`;
    this.token = null;
  }

  check(url) {
    return baseURL.test(url);
  }

  async requestToken() {
    try {
      let req = await fetch("https://music.apple.com/us/browse");
      let json = await req.text();
      let config =
        /<meta name="desktop-music-app\/config\/environment" content="(.*?)">/.exec(
          json
        );

      let key = (config = JSON.parse(decodeURIComponent(config[1])));
      let { token } = key?.MEDIA_API;

      if (!token) throw new Error("No acess key found for apple music");

      this.token = `Bearer ${token}`;
    } catch (e) {
      if (e.status === 400) {
        throw new Error(`[Poru Apple Music]:${e}`);
      }
    }
  }

  async requestData(param) {
    if (!this.token) await this.requestToken();

    let req = await fetch(`${this.url}${param}`, {
      headers: {
        Authorization: `${this.token}`,
        origin: "https://music.apple.com",
      },
    });

    let body = await req.json();

    return body;
  }

  async resolve(url) {
    let [, type, id] = await baseURL.exec(url);

    switch (type) {
      case "playlist": {
        return this.fetchPlaylist(url);
      }
      case "album": {
        return this.fetchAlbum(url);
      }
      case "artist": {
        return this.fetchArtist(url);
      }
    }
  }

  async fetch(query) {
    if (this.check(query)) return this.resolve(query);

    try {
      let tracks = await this.requestData(`/search?types=songs&term=${query}`);

      let track = await this.buildUnresolved(tracks.results.songs.data[0]);

      return this.buildResponse("TRACK_LOADED", [track]);
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchPlaylist(url) {
    try {
      let query = new URL(url).pathname.split("/");
      let id = query.pop();
      let playlist = await this.requestData(`/playlists/${id}`);
      let name = playlist.data[0].attributes.name;

      const limitedTracks = this.options.playlistLimit
        ? playlist.data[0].relationships.tracks.data.slice(
            0,
            this.options.playlistLimit * 100
          )
        : playlist.data[0].relationships.tracks.data;

      let tracks = await Promise.all(
        limitedTracks.map((x) => this.buildUnresolved(x))
      );
      return this.buildResponse("PLAYLIST_LOADED", tracks, name);
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchAlbum(url) {
    try {
      let query = new URL(url).pathname.split("/");
      let id = query.pop();
      let album = await this.requestData(`/albums/${id}`);

      const limitedTracks = this.options.albumLimit
        ? album.data[0].relationships.tracks.data.slice(
            0,
            this.options.albumLimit * 100
          )
        : album.data[0].relationships.tracks.data;

      let name = album.data[0].attributes.name;
      let tracks = await Promise.all(
        limitedTracks.map((x) => this.buildUnresolved(x))
      );
      return this.buildResponse("PLAYLIST_LOADED", tracks, name);
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchArtist(url) {
    try {
      let query = new URL(url).pathname.split("/");
      let id = query.pop();
      let artist = await this.requestData(`/attists/${id}`);
      let name = artist.data[0].attributes.name;

      const limitedTracks = this.options.artistLimit
        ? artist.data[0].relationships.tracks.data.slice(
            0,
            this.options.artist * 100
          )
        : artist.data[0].relationships.tracks.data;

      let tracks = await Promise.all(
        limitedTracks.map((x) => this.buildUnresolved(x))
      );
      return this.buildResponse("PLAYLIST_LOADED", tracks, name);
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async buildUnresolved(track) {
    if (!track)
      throw new ReferenceError("The Apple track object was not provided");

    return new PoruTrack({
      track: "",
      info: {
        sourceName: "Apple Music",
        identifier: track.id,
        isSeekable: true,
        author: track.attributes.artistName
          ? track.attributes.artistName
          : "Unknown",
        length: track.attributes.durationInMillis,
        isStream: false,
        title: track.attributes.name,
        uri: track.attributes.url,
        image: track.attributes.artwork.url
          .replace("{w}", this.options.imageWeight)
          .replace("{h}", this.options.imageHeight),
      },
    });
  }

  compareValue(value) {
    return typeof value !== "undefined"
      ? value !== null
      : typeof value !== "undefined";
  }

  buildResponse(loadType, tracks, playlistName, exceptionMsg) {
    return Object.assign(
      {
        loadType,
        tracks,
        playlistInfo: playlistName ? { name: playlistName } : {},
      },
      exceptionMsg
        ? { exception: { message: exceptionMsg, severity: "COMMON" } }
        : {}
    );
  }
}
module.exports = AppleMusic;
