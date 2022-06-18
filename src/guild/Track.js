class Track {
    constructor(data) {
      this.uri = data.info.uri;
      this.title = data.info.title;
      this.author = data.info.author;
      this.duration = data.info.length;
      this.identifier = data.info.identifier;
      this.isStream = data.info.isStream;
      this.isSeekable = data.info.isSeekable;
      this.track = data.track;
      this.thumbnail = `https://i.ytimg.com/vi/${data.info.identifier}/maxresdefault.jpg` || null;
    }
}

module.exports = Track;