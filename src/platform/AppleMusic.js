const { fetch } = require("undici")
const PoruTrack = require("../guild/PoruTrack")

class AppleMusic {
  constructor(manager, options) {
    this.manager = manager;
    this.options = {
      playlistLimit: options.apple.playlistLimit || 5,
      searchMarket: options.apple.searchMarket || "us",
      imageHeight: options.apple.imageHeight || 500,
      imageWeight: options.apple.imageWeight || 500,



    }
    this.baseURL = /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/;
    this.applePattern = /(?:https:\/\/music\.apple\.com\/)(?:\w{2}\/)?(track|album|playlist)/g;
    this.url = `https://amp-api.music.apple.com/v1/catalog/${this.options.searchMarket}`
    this.authorization = null;
    this.interval = 0;

  }

  check(url) {
    return this.baseURL.test(url);
  }


  async requestToken() {
    if (this.nextRequest) return;

    try {

      let req = await fetch('https://music.apple.com/us/browse');
      let json = await req.text();
      let config = /<meta name="desktop-music-app\/config\/environment" content="(.*?)">/.exec(json);

      let key = config = JSON.parse(decodeURIComponent(config[1]));
      let { token } = key?.MEDIA_API

      if (!token) throw new Error("No acess key found for apple music")

      this.token = `Bearer ${token}`;
      this.interval = body.expires_in * 1000;
    } catch (e) {
      if (e.status === 400) {
        throw new Error(`[Poru Apple Music]:${e}`);
      }
    }
  }

  async renew() {
    if (Date.now() >= this.interval) {
      await this.requestToken();
    }
  }

  async requestData(param) {
    await this.requestToken();
    let req = await fetch(`${this.url}${param}`, {
      headers: {
        Authorization: `${this.token}`,
        origin: 'https://music.apple.com'
      }
    })

    let body = await req.json();

    return body;
  }





  async resolve(url) {
    let [, type, id] = await this.baseURL.exec(url)

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

    let tracks = await this.requestData(`/search?types=songs&term=${query}`)

    let track = await this.buildUnresolved(tracks.results.songs.data[0])

    return this.buildResponse('TRACK_LOADED', [track]);

  }


  async fetchPlaylist(url) {
    try {
      let query = new URL(url).pathname.split('/');
      let id = query.pop();
      let playlist = await this.requestData(`/playlists/${id}`)
      let name = playlist.data.attributes.name
      let tracks = await Promise.all(playlist.data[0].relationships.tracks.data.map(x => this.buildUnresolved(x)));

      return this.buildResponse('PLAYLIST_LOADED', tracks, name);
    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );
    }
  }



  async fetchAlbum(url) {

    try {
      let query = new URL(url).pathname.split('/');
      let id = query.pop();
      let album = await this.requestData(`/albums/${id}`)
      let name = album.data[0].attributes.name
      let tracks = await Promise.all(album.data[0].relationships.tracks.data.map(x => this.buildUnresolved(x)));
      return this.buildResponse('PLAYLIST_LOADED', tracks, name);
    } catch (e) {
      return this.buildResponse(
        e.body?.error.message === 'invalid id' ? 'NO_MATCHES' : 'LOAD_FAILED',
        [],
        undefined,
        e.body?.error.message ?? e.message,
      );
    }
}

async fetchArtist(url) {

  try {
    let query = new URL(url).pathname.split('/');
    let id = query.pop();
    let artist = await this.requestData(`/attists/${id}`)
    let name = artistdata[0].attributes.name
    let tracks = await Promise.all(artist.data[0].relationships.tracks.data.map(x => this.buildUnresolved(x)));
    return this.buildResponse('PLAYLIST_LOADED', tracks, name);
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
    if (!track) throw new ReferenceError('The Apple track object was not provided');

    return new PoruTrack({
      track: '',
      info: {
        sourceName: 'Apple Music',
        identifier: track.id,
        isSeekable: true,
        author: track.attributes.artistName ? track.attributes.artistName : 'Unknown',
        length: track.attributes.durationInMillis,
        isStream: false,
        title: track.attributes.name,
        uri: track.attributes.url,
        image: track.attributes.artwork.url.replace("{w}", this.options.imageWeight).replace("{h}", this.options.imageHeight)
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
module.exports = AppleMusic
