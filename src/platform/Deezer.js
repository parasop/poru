const { fetch } = require("undici");

let REGEX =
  /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|album|playlist|artist)\/(\d+)/;

const PoruTrack = require("../guild/PoruTrack");

class Deezer {
  constructor(manager, options) {
    this.manager = manager;
    this.baseURL = "https://api.deezer.com";
    this.options = {
      playlistLimit: options.playlistLimit || null,
      albumLimit: options.albumLimit || null,
      artistLimit: options.artistLimit || null,
    };
  }

  check(url) {
    return REGEX.test(url);
  }

  async requestData(endpoint) {
    const req = await fetch(`${this.baseURL}/${endpoint}`, {});
    const data = await req.json();
    return data;
  }

  async resolve(url) {
    const [, type, id] = REGEX.exec(url) ?? [];
    switch (type) {
      case "playlist": {
        return this.fetchPlaylist(id);
      }
      case "track": {
        return this.fetchTrack(id);
      }
      case "album": {
        return this.fetchAlbum(id);
      }
      case "artist": {
        return this.fetchArtist(id);
      }
    }
  }

  async fetchPlaylist(id) {
    try {
      const playlist = await this.requestData(`/playlist/${id}`);

      const limitedTracks = this.options.playlistLimit
        ? playlist.tracks.data.slice(0, this.options.playlistLimit * 100)
        : playlist.tracks.data;

      const unresolvedPlaylistTracks = await Promise.all(
        limitedTracks.map((x) => this.buildUnresolved(x))
      );
      return this.buildResponse(
        "PLAYLIST_LOADED",
        unresolvedPlaylistTracks,
        playlist.title
      );
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchAlbum(id) {
    try {
      const album = await this.requestData(`/album/${id}`);

      const limitedTracks = this.options.albumLimit
        ? album.track.data.slice(0, this.options.albumLimit * 100)
        : album.track.data;

      const unresolvedAlbumTracks = await Promise.all(
        limitedTracks.map((x) => this.buildUnresolved(x))
      );

      return this.buildResponse(
        "PLAYLIST_LOADED",
        unresolvedAlbumTracks,
        album.name
      );
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchTrack(id) {
    try {
      const track = await this.requestData(`/track/${id}`);

      const unresolvedTrack = await Promise.all(this.buildUnresolved(track));
      return this.buildResponse("TRACK_LOADED", [unresolvedTrack]);
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchArtist(id) {
    try {
      const artist = await this.requestData(`/artist/${id}/top`);
      await this.fetchArtistTracks(artist);

      const limitedTracks = this.options.artistLimit
        ? artist.data.slice(0, this.options.artistLimit * 100)
        : artist.data;

      const unresolvedArtistTracks = await Promise.all(
        limitedTracks.map((x) => this.buildUnresolved(x))
      );

      return this.buildResponse(
        "PLAYLIST_LOADED",
        unresolvedArtistTracks,
        artist.name
      );
    } catch (e) {
      return this.buildResponse(
        "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchArtistTracks(deezerArtist) {
    let nextPage = deezerArtist.next;
    let pageLoaded = 1;
    while (nextPage) {
      if (!nextPage) break;
      const req = await fetch(nextPage);
      const json = await req.json();

      deezerArtist.data.push(...json.data);

      nextPage = json.next;
      pageLoaded++;
    }
  }

  async fetch(query) {
    if (this.check(query)) return this.resolve(query);

    try {
      if (this.check(query)) return this.resolve(query);
      let tracks = await this.requestData(`/search?q="${query}"`);

      const unresolvedTrack = await this.buildUnresolved(tracks.data[0]);
      return this.buildResponse("TRACK_LOADED", [unresolvedTrack]);
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
      throw new ReferenceError("The Deezer track object was not provided");

    return new PoruTrack({
      track: "",
      info: {
        sourceName: "deezer",
        identifier: track.id,
        isSeekable: true,
        author: track.artist ? track.artist.name : "Unknown",
        length: track.duration,
        isStream: false,
        title: track.title,
        uri: track.link,
        image: track.album.cover_medium,
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

module.exports = Deezer;
