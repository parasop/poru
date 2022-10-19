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
  
  Error:{
    sessionEndpoint:"[Poru Connection] Session endpoint missing. \n Kindly double check your client intents",
    noSessionID : "[Poru Connection] Session ID missing."


  }
};
