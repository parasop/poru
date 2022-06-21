class Track {
    constructor(data) {
      this.track = data.info.track
      this.info ={
        identifier : data.info.identifier,
        isSeekable : data.info.isSeekable,
        author : data.info.author,
        length : data.info.length,
        isStream : data.info.isStream,
        position : data.info.position,
        sourceName:data.info.sourceName,
        title : data.info.title,
        uri : data.info.uri,
        image : `https://i.ytimg.com/vi/${data.info.identifier}/maxresdefault.jpg` || null
    
      }
      }
}

module.exports = Track;
