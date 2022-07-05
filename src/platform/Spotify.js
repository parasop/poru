const { fetch } = require('undici');
const Track = require("../guild/Track")
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
            const data = await fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
                method: "POST",
                headers: {
                    Authorization: `Basic ${this.authorization}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })

            const body = await data.json();

            this.token = `Bearer ${body.access_token}`;
            this.interval = body.expires_in * 1000
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
            const unresolvedPlaylistTracks = await Promise.all(playlist.tracks.items.map(x => this.buildUnresolved(x.track)))


            return this.buildResponse(
                "PLAYLIST_LOADED",
                unresolvedPlaylistTracks,
                playlist.name
            );

        } catch (e) {
            return this.buildResponse(e.status === 404 ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    async fetchAlbum(id) {
        try {
            const album = await this.requestData(`/albums/${id}`)

            const unresolvedPlaylistTracks = await Promise.all(album.tracks.items.map(x => this.buildUnresolved(x)));
            return this.buildResponse(
                "PLAYLIST_LOADED",
                unresolvedPlaylistTracks,
                album.name
            );

        } catch (e) {
            return this.buildResponse(e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    async fetchArtist(id) {
        try {
            const artist = await this.requestData(`/artists/${id}`)

            const data = await this.requestData(`/artists/${id}/top-tracks?market=US`)
            const unresolvedPlaylistTracks = await Promise.all(data.tracks.map(x => this.buildUnresolved(x)));

            return this.buildResponse(
                "PLAYLIST_LOADED",
                unresolvedPlaylistTracks,
                artist.name
            );
        } catch (e) {
            return this.buildResponse(e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }

    }

    async fetchTrack(id) {
        try {
            const data = await this.requestData(`/tracks/${id}`)
            const unresolvedTrack = await this.buildUnresolved(data);
            return this.buildResponse(
                "TRACK_LOADED",
                [unresolvedTrack]
            );
        } catch (e) {
            return this.buildResponse(e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    async fetch(query) {
        try {

            if (this.check(query)) return this.resolve(query)

            const data = await this.requestData(`/search/?q="${query}"&type=artist,album,track`)

            const unresolvedTrack = await this.buildUnresolved(data.tracks.items[0]);

            return this.buildResponse(
                "TRACK_LOADED",
                [unresolvedTrack]
            );
        } catch (e) {
            return this.buildResponse(e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    async fetchPlaylistTracks(spotifyPlaylist) {
        let nextPage = spotifyPlaylist.tracks.next;
        let pageLoaded = 1;
        while (nextPage) {
            if (!nextPage) break;
            const req = await fetch(nextPage, {
                headers: { Authorization: this.token }
            })
            const body = await req.json()
            if (body.error) break;
            spotifyPlaylist.tracks.items.push(...body.items);

            nextPage = body.next;
            pageLoaded++;
        }
    }



    async buildUnresolved(track) {
        if (!track) throw new ReferenceError("The Spotify track object was not provided");

        return new Track({
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
        })



    }

    async fetchMetaData(track) {

        const fetch = await this.manager.resolve(`${track.info.title} ${track.info.author}`)
        return fetch.tracks[0];
    }

    async buildTrack(unresolvedTrack) {
        const lavaTrack = await this.fetchMetaData(unresolvedTrack);
        if (lavaTrack) {
            unresolvedTrack.track = lavaTrack.track;
            unresolvedTrack.info.identifier = lavaTrack.info.identifier
            return unresolvedTrack
        }
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
