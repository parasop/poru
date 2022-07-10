const { fetch } = require('undici');
const PoruTrack = require("../guild/PoruTrack")

class Deezer {
  constructor(manager, options) {


    this.manager = manager;
    this.baseURL = 'https://api.deezer.com';
    this.REGEX = /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|album|playlist|artist)\/(\d+)/
    this.playlistLimit = options.deezer.playlistLimit || null;

  }


  check(url) {
    return this.REGEX.test(url);
  }

  async requestData(endpoint) {
    const req = await fetch(`${this.baseURL}/${endpoint}`, {
    });
    const data = await req.json();
    return data;
  }


  async resolve(url) {
    const [, type, id] = this.REGEX.exec(url) ?? [];
    switch (type) {
      case 'playlist': {
        return this.fetchPlaylist(id);
      }
      case 'track': {
        return this.fetchTrack(id);
      }
      case 'album': {
        return this.fetchAlbum(id);
      }
      case 'artist': {
        return this.fetchArtist(id);
      }

    }



  }


  async fetchPlaylist(id) {
    try {
      const playlist = await this.requestData(`/playlist/${id}`);
      const unresolvedPlaylistTracks = await Promise.all(playlist.tracks.data.map(x => this.buildUnresolved(x)));
      return this.buildResponse('PLAYLIST_LOADED', unresolvedPlaylistTracks, playlist.name);

    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );

    }
  }

  async fetchAlbum(id) {
    try {
      const album = await this.requestData(`/album/${id}`)

      const unresolvedAlbumTracks = await Promise.all(playlist.tracks.data.map(x => this.buildUnresolved(x)));

      return this.buildResponse('PLAYLIST_LOADED', unresolvedAlbumTracks, album.name);
    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );

    }
  }

  async fetchTrack(id) {

    try {
      const track = await this.requestData(`/track/${id}`)

      const unresolvedTrack = await Promise.all(this.buildUnresolved(track));
      return this.buildResponse('TRACK_LOADED', [unresolvedTrack]);
    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );

    }
  }

  async fetchArtist(id) {

    try {
      const artist = await this.requestData(`/artist/${id}/top`);
      await this.fetchArtistTracks(artist)
      const unresolvedArtistTracks = await Promise.all(artist.data.map(x => this.buildUnresolved(x)
      ));



      return this.buildResponse('PLAYLIST_LOADED', unresolvedArtistTracks, artist.name);
    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );

    }
  }

  async fetchArtistTracks(deezerArtist) {
    let nextPage = deezerArtist.next;
    let pageLoaded = 1;
    while (nextPage) {
      if (!nextPage) break;
      const req = await fetch(nextPage)
      const json = await req.json()

      deezerArtist.data.push(...json.data);

      nextPage = json.next;
      pageLoaded++;
    }
  }

  async fetch(query) {
    try {
      if (this.check(query)) return this.resolve(query)
      let tracks = await this.requestData(`/search?q="${query}"`)

      const unresolvedTrack = await this.buildUnresolved(tracks.data[0]);
      return this.buildResponse('TRACK_LOADED', [unresolvedTrack]);
    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );


    }
  }


  async buildUnresolved(track) {
    if (!track) throw new ReferenceError('The Deezer track object was not provided');

    return new PoruTrack({
      track: '',
      info: {
        sourceName: 'deezer',
        identifier: track.id,
        isSeekable: true,
        author: track.artist ? track.artist.name : 'Unknown',
        length: track.duration,
        isStream: false,
        title: track.title,
        uri: track.link,
        image: track.album.cover_medium
      },
    });
  }


  compareValue(value) {
    return typeof value !== 'undefined' ? value !== null : typeof value !== 'undefined';
  }

  buildResponse(loadType, tracks, playlistName, exceptionMsg) {
    return Object.assign(
      {
        loadType,
        tracks,
        playlistInfo: playlistName ? { name: playlistName } : {},
      },
      exceptionMsg ? { exception: { message: exceptionMsg, severity: 'COMMON' } } : {},
    );
  }




}

module.exports = Deezer;

let deezer = new Deezer("",{deezer:{playlistLimit:10}})


deezer.resolve("https://www.deezer.com/en/playlist/4404579662")