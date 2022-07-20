const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
class Track {
  constructor(data) {
    this.track = data.track
    this.info = {
      identifier: data.info.identifier,
      isSeekable: data.info.isSeekable,
      author: data.info.author,
      length: data.info.length,
      isStream: data.info.isStream,
      sourceName: data.info.sourceName,
      title: data.info.title,
      uri: data.info.uri,
      image: `https://i.ytimg.com/vi/${data.info.identifier}/maxresdefault.jpg` || null

    }
  }

  async resolve(manager) {

    const query = [this.info.author, this.info.title].filter((x) => !!x).join(' - ');


    const result = await manager.resolve(query,manager.options.defaultPlatform || "ytsearch");
    if (!result || !result.tracks.length) return;

    if (this.info.author) {
      const author = [this.info.author, `${this.info.author} - Topic`];
      const officialAudio = result.tracks.find(
        (track) =>
          author.some((name) => new RegExp(`^${escapeRegExp(name)}$`, 'i').test(track.info.author)) ||
          new RegExp(`^${escapeRegExp(this.info.title)}$`, 'i').test(track.info.title),
      );
      if (officialAudio) {
        this.info.identifier = officialAudio.info.identifier
        this.image =`https://i.ytimg.com/vi/${this.info.identifier}/maxresdefault.jpg`
        this.track = officialAudio.track;
        return this
      }
    }
    if (this.info.length) {
      const sameDuration = result.tracks.find(
        (track) =>
          track.info.length >= (this.info.length ? this.length : 0) - 2000 &&
          track.info.length <= (this.info.length ? this.length : 0) + 2000,
      );
      if (sameDuration) {
        this.info.identifier = sameDuration.info.identifier
        this.image =`https://i.ytimg.com/vi/${this.info.identifier}/maxresdefault.jpg`
        this.track = sameDuration.track;
        return this
      }
    }
    this.info.identifier = result.tracks[0].info.identifier
    this.image =`https://i.ytimg.com/vi/${this.info.identifier}/maxresdefault.jpg`
    this.track = result.tracks[0].track;
    return this
  }
}

module.exports = Track;
