module.exports = {
  clientName: "Poru",
  autoResume: true,
  version: "4.0",
  OPCodes: {
    CONFIGURE_RESUMING: "configureResuming",
    DESTROY: "destroy",
    FILTERS: "filters",
    EVENT: "event",
    PAUSE: "pause",
    PLAY: "play",
    PLAYER_UPDATE: "playerUpdate",
    SEEK: "seek",
    STATS: "stats",
    STOP: "stop",
    VOICE_UPDATE: "voiceUpdate",
    VOLUME: "volume",
  },
  libraries: {
    eris: ["eris", "ERIS", "eris.js", "ERIS.JS"],
    discordjs: ["discord.js", "DISCORD.JS", "djs", "discordjs", "DISCORDJS"],
    oceanic:['Oceanic',"oceanic","oceanic.js","Oceanic,js","OCEANIC","OCEANIC.JS"]
  },

  Error: {
    sessionEndpoint: "[Poru Connection] Session endpoint missing. \n Kindly double check your client intents",
    noSessionID: "[Poru Connection] Session ID missing."


  }
};
