const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
const req = require("node-superfetch");
const request = require("petitio")
class Spotify {
    constructor(manager) {
        this.manager = manager;
        this.baseURL = "https://api.spotify.com/v1"
        this.spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track|artist)(?:[/:])([A-Za-z0-9]+).*$/
        this.clientID = manager.options.spotify.clientID;
        this.clientSecret = manager.options.spotify.clientSecret
        this.authorization = Buffer
            .from(`${this.clientID}:${this.clientSecret}`)
            .toString("base64");
        this.interval = 0;
    }

    check(url) {
        return this.spotifyPattern.test(url);
    }

    async requestToken() {
        if (this.nextRequest) return;

        try {
            const { access_token, expires_in } = await request("https://accounts.spotify.com/api/token", "POST")
                .query("grant_type", "client_credentials")
                .header("Authorization", `Basic ${this.authorization}`)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .json();

            if (!access_token) {
                throw new Error("Invalid Spotify client.");
            }


            this.token = `Bearer ${access_token}`;
            this.interval = expires_in * 1000
        } catch (e) {
            if (e.status === 400) {
                throw new Error("Invalid Spotify client.")
            }
        }
    }

    async renew() {
        if (Date.now() >= this.interval) {
            await this.requestToken();
        }
    }

    async requestData(endpoint) {
        await this.renew();

        const req = await fetch(`${this.baseURL}${/^\//.test(endpoint) ? endpoint : `/${endpoint}`}`, {
            headers: { Authorization: this.token }
        })
        const data = await req.json()
        return data
    }


    async resolve(url) {
        if (!this.token) await this.requestToken()
        const [, type, id] = await this.spotifyPattern.exec(url) ?? [];

        switch (type) {

            case "playlist":
                {
                    return this.fetchPlaylist(id)
                }
            case "track":
                {
                    return this.fetchTrack(id)
                }
            case "album":
                {
                    return this.fetchAlbum(id)
                }
            case "artist":
                {
                    return this.fetchArtist(id);
                }

            default: {
                return this.manager.resolve(url)
            }
        }

    }

    async fetchPlaylist(id) {
        try {
            const playlist = await this.requestData(`/playlists/${id}`)
            await this.fetchPlaylistTracks(playlist);
            const unresolvedPlaylistTracks = playlist.tracks.items.map(x => this.buildUnresolved(x.track));


            return this.buildResponse(
                "PLAYLIST_LOADED",
                (await Promise.all(unresolvedPlaylistTracks.map(x => x.then((a) => a.resolve())))).filter(Boolean),
                playlist.name
            );

        } catch (e) {
            return this.buildResponse(e.status === 404 ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    async fetchAlbum(id) {
        const album = await this.requestData(`/albums/${id}`)

        const unresolvedPlaylistTracks = album.tracks.map(x => this.buildUnresolved(x));
        return this.buildResponse(
            "PLAYLIST_LOADED",
            (await Promise.all(unresolvedPlaylistTracks.map(x => x.then((a) => a.resolve())))).filter(Boolean),
            album.name
        );

    }

    async fetchArtist(id) {
        const artist = await this.requestData(`/artists/${id}`)

        const data = await this.requestData(`/artists/${id}/top-tracks?market=US`)
        const unresolvedPlaylistTracks = data.tracks.map(x => this.buildUnresolved(x));

        return this.buildResponse(
            "PLAYLIST_LOADED",
            (await Promise.all(unresolvedPlaylistTracks.map(x => x.then((a) => a.resolve())))).filter(Boolean),
            artist.name
        );


    }

    async fetchTrack(id) {

        const data = await this.requestData(`/tracks/${id}`)
        const unresolvedTrack = this.buildUnresolved(data);

        return this.buildResponse(
            "TRACK_LOADED",
            [await unresolvedTrack.then((a) => a.resolve())]
        );
    }

    async fetchByWords(query) {

        const data = await this.requestData(`/search/?q="${query}"&type=artist,album,track`)
       
        const unresolvedTrack = this.buildUnresolved(data.tracks.items[0]);

        return this.buildResponse(
            "TRACK_LOADED",
            [await unresolvedTrack.then((a) => a.resolve())]
        );
    }

    async fetchPlaylistTracks(spotifyPlaylist) {
        let nextPage = spotifyPlaylist.tracks.next;
        let pageLoaded = 1;
        while (nextPage) {
            if (!nextPage) break;
            const { body } = await req
                .get(nextPage)
                .set("Authorization", this.token);
            if (body.error) break;
            spotifyPlaylist.tracks.items.push(...body.items);

            nextPage = body.next;
            pageLoaded++;
        }
    }



    async buildUnresolved(track) {
        if (!track) throw new ReferenceError("The Spotify track object was not provided");
   //     if (!track.artists) throw new ReferenceError("The track artists array was not provided");
        if (!track.name) throw new ReferenceError("The track name was not provided");
        if (!Array.isArray(track.artists)) throw new TypeError(`The track artists must be an array, received type ${typeof track.artists}`);
        if (typeof track.name !== "string") throw new TypeError(`The track name must be a string, received type ${typeof track.name}`);

        const _this = this;
        return {
            track: "",
            info: {
                sourceName: 'spotify',
                identifier: track.id,
                isSeekable: true,
                author: track.artists[0] ? track.artists[0].name : 'Unknown',
                length: track.duration_ms,
                isStream: false,
                title: track.name,
                uri: `https://open.spotify.com/track/${track.id}`,
                image: track.album?.images[0]?.url,
            },
            resolve() {
                return _this.buildTrack(this)
            }
        }



    }

    async fetchMetaData(track) {

        const fetch = await this.manager.resolve(`${track.info.title} ${track.info.author}`)
        return fetch.tracks[0];
    }

    async buildTrack(unresolvedTrack) {
        const lavaTrack = await this.fetchMetaData(unresolvedTrack);
        unresolvedTrack.track = lavaTrack.track;
        unresolvedTrack.info.identifier = lavaTrack.info.identifier
        return unresolvedTrack
    }


    compareValue(value) {
        return typeof value !== 'undefined' ? value !== null : typeof value !== 'undefined';
    }


    buildResponse(loadType, tracks, playlistName, exceptionMsg) {

        return Object.assign({
            loadType,
            tracks,
            playlistInfo: playlistName ? { name: playlistName } : {}
        }, exceptionMsg ? { exception: { message: exceptionMsg, severity: "COMMON" } } : {});
    }


}





module.exports = Spotify
