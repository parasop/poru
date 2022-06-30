const axios = require("axios")
const Track = require("../guild/Track")
const cheerio = require("cheerio")

class Apple {
    constructor(manager,options) {
        this.manager = manager;
        this.baseURL = /(?:https:\/\/music\.apple\.com\/)(?:.+)?(artist|album|music-video|playlist)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)\/([\w\-\.]+(\/)+[\w\-\.]+|[^&]+)/;
        this.applePattern =  /(?:https:\/\/music\.apple\.com\/)(?:\w{2}\/)?(track|album|playlist)/g;
        this.REGEX = /(?:https:\/\/music\.apple\.com\/)(?:\w{2}\/)?(track|album|playlist)/g;
        this.playlistLimit = options.playlistLimit || null;
  }

    check(url) {
        return this.baseURL.test(url);
    }

     isTrack(url) {
    
        let res = url.replace(/https:\/\//i,'').split('/')[2]
        return res
         
    }

    async decodeUrl(url){
    let [,id] = await this.baseURL.exec(url)
    return id;
    }

    async  resolve(url) {
      const urlType = await this.decodeUrl(url);
      console.log(urlType)
      const page = await axios
        .get(url)
        .then((res) => res.data)
        .catch(() => undefined);
    
      if (!page) {
     return this.buildResponse(
          "NO_MATCHES",
          [],
          undefined
        )
      
      }
       
    
      if (urlType === "playlist") {
      let playlist = this.getRawPlaylist(page);
      const tracks = playlist.tracks.map(x => this.buildUnresolved(x))
      
  const limitedTracks = this.playlistLimit ? tracks.slice(0, this.playlistLimit * 100) : tracks;

      return this.buildResponse(
        "PLAYLIST_LOADED",
        limitedTracks,
        playlist.title
    );
    }else if (urlType === "album") {
        const album = this.getRawAlbum(page);
        const tracks = album.tracks.map(x => this.buildUnresolved(x))

        const limitedTracks = this.playlistLimit ? tracks.slice(0, this.playlistLimit * 100) : tracks;

        return this.buildResponse(
          "PLAYLIST_LOADED",
          limitedTracks,
          album.title
      );
     }else{
      return this.buildResponse(
        "NO_MATCHES",
        [],
        undefined
      )
     }
    
    
    }

  
    getRawPlaylist(document) {
        const $ = cheerio.load(document);
      
        const tracks = [];
      
        const songList = $("div.songs-list-row").toArray();
        songList.forEach((song) => {
          const lookArtist = $(song)
            .find("div.songs-list__col--artist")
            .find("a.songs-list-row__link");
      
          const track = {
            artist: {
              name: lookArtist.text(),
              url: lookArtist.attr("href") ?? "",
            },
            title: $(song)
              .find("div.songs-list__col--song")
              .find("div.songs-list-row__song-name")
              .text(),
            duration: $(song)
              .find("div.songs-list__col--time")
              .find("time")
              .text()
              .trim()
              .split(":")
              .map((value) => Number(value))
              .reduce((acc, time) => 60 * acc + time),
            url:
              $(song)
                .find("div.songs-list__col--album")
                .find("a.songs-list-row__link")
                .attr("href") ?? "",
            type: "song",
          };
      
          tracks.push(track);
        });
      
        const product = $("div.product-page-header");
        const creator = product.find("div.product-creator").find("a.dt-link-to");
      
        const playlist = {
          title: product.find("h1.product-name").text().trim(),
          description: product
            .find("div.product-page-header__metadata--notes")
            .text()
            .trim(),
          creator: {
            name: creator.text().trim(),
            url: "https://music.apple.com" + creator.attr("href") ?? "",
          },
          tracks,
          numTracks: tracks.length,
          type: "playlist",
        };
        return playlist;
      }
      getRawAlbum(document) {
        const $ = cheerio.load(document);
      
        const tracks = [];
      
        const product = $("div.product-page-header");
        const creator = product.find("div.product-creator").find("a.dt-link-to");
        const artist = {
          name: creator.text().trim(),
          url: creator.attr("href") ?? "",
        };
      
        const albumUrl = $("meta[property='og:url']").attr("content");
        const songList = $("div.songs-list-row").toArray();
        songList.forEach((song) => {
          const track = {
            artist,
            title: $(song)
              .find("div.songs-list__col--song")
              .find("div.songs-list-row__song-name")
              .text(),
            duration: $(song)
              .find("div.songs-list__col--time")
              .find("time")
              .text()
              .trim()
              .split(":")
              .map((value) => Number(value))
              .reduce((acc, time) => 60 * acc + time),
            url: albumUrl
              ? albumUrl +
                  "?i=" +
                  JSON.parse(
                    $(song)
                      .find("div.songs-list__col--time")
                      .find("button.preview-button")
                      .attr("data-metrics-click") ?? "{ targetId: 0 }"
                  )["targetId"] ?? ""
              : "",
            type: "song",
          };
      
          tracks.push(track);
        });
      
        const playlist = {
          title: product.find("h1.product-name").text().trim(),
          description: product
            .find("div.product-page-header__metadata--notes")
            .text()
            .trim(),
          artist,
          tracks,
          numTracks: tracks.length,
          type: "album",
        };
        return playlist;
      }
      

    buildUnresolved(track) {
        if (!track) throw new ReferenceError('The Spotify track object was not provided');
    
        return new Track({
          track: '',
          info: {
            sourceName: 'apple-music',
            identifier: "",
            isSeekable: true,
            author: track.artist.name || "Unknwon",
            length: track.duration *1000,
            isStream: false,
            title: track.title,
            uri: track.url,
            image: null,
          },
        });
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
module.exports = Apple
