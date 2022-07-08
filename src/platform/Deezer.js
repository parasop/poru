const { fetch } = require('undici');
const DeezerTrack = require("../guild/DeezerTrack")

class Deezer {
  constructor(manager, options) {


    this.manager = manager;
    this.baseURL = 'https://api.deezer.com';
    this.REGEX = /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?(track|album|playlist)\/(\d+)/
    this.playlistLimit = options.playlistLimit || null;

  }


  check(url) {
    return this.REGEX.test(url);
  }

  async requestData(endpoint) {
    console.log(`${this.baseURL}/${endpoint}`)
    const req = await fetch(`${this.baseURL}/${endpoint}`, {
    });
    const data = await req.json();
    return data;
  }


  async resolve(url) {
    console.log(url)
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

    }



  }


  async fetchPlaylist(id) {
    try {
      const playlist = await this.requestData(`//playlist/${id}`);
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

async fetchTrack(id){

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


  async buildUnresolved(track) {
    if (!track) throw new ReferenceError('The Deezer track object was not provided');

    return new DeezerTrack({
      track: '',
      metadata: track.preview,
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

const deezer = new Deezer("", { playlistLimit: 10 })
(async()=>{
let x  = await deezer.resolve(`https://www.deezer.com/track/1174602992`)
console.log(x)

})()
