const { fetch } = require("undici")
const Track = require("../guild/Track")

class AppleMusic {
  constructor(manager, options) {
    this.manager = manager;
    this.options = {
      playlistLimit: options.apple.playlistLimit || 5,
      searchMarket: options.apple.searchMarket || "us"


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
    console.log(`${this.url}${param}`)
    let req = await fetch(`${this.url}${param}`, {
      headers: {
        Authorization: `${this.token}`,
        origin: 'https://music.apple.com'
      }
    })

    let body = await req.json();

    return body;
  }





  async resolve(url){
    let [,type, id] = await this.baseURL.exec(url)
  
    switch(type){
      case "playlist":{
        return this.fetchPlaylist(url)
      }
    }
  }


  async fetch(query) {

    let tracks = await this.requestData(`/search?types=songs&term=${query}`)

    let track = await this.buildUnresolved(tracks.results.songs.data[0])

    return this.buildResponse('TRACK_LOADED', [track]);

  }


async fetchPlaylist(url){
  let query = new URL(url).pathname.split('/');
  let id = query.pop();
  let name = query.pop();
  console.log(`playlists/${name}/${id}`)
  let playlist = await this.requestData(`/playlists/${name}/${id}`)
  console.log(playlist)
}









  async buildUnresolved(track) {
    if (!track) throw new ReferenceError('The Apple track object was not provided');

    return new Track({
      track: '',
      info: {
        sourceName: 'Apple Music',
        identifier: track.id,
        isSeekable: true,
        author: track.artistName ? track.artistName : 'Unknown',
        length: track.durationInMillis,
        isStream: false,
        title: track.name,
        uri: track.url,
        image: ""
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


const apple = new AppleMusic(
  "", { apple: { playlistLimit: 5, searchMarket: "in" } });

apple.resolve("https://music.apple.com/us/playlist/bollywood-hits/pl.d60caf02fcce4d7e9788fe01243b7c2c")