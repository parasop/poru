const {Error} = require("./config")

class voiceConnection {
    
    constructor (player){

        this.player = player;
        this.sessionId = null;
        this.region = null;
        this.sessionId = null;
        this.muted = false;
        this.deafened = false;
        this.voiceServer = null;

    }

    setServersUpdate(data){
       
        if(!data.endpoint){
             this.player.poru.emit(`error`,Error.sessionEndpoint) 
             return;
        }

        this.voiceServer = data;
       
        if (!this.sessionId) {
            this.player.poru.emit('error', Error.noSessionID);
            return;
        }

        this.region = data.endpoint.split('.').shift()?.replace(/[0-9]/g, '') || null;
        this.player.node.send({ op: "voiceUpdate", guildId: this.player.guildId, sessionId: this.sessionId, event: data });
        this.player.poru.emit("debug",this.player.node.name,`[Voice] <- [Discord] : Voice Server Update | Server: ${this.region} Guild: ${this.player.guildId}`)
    }



setStateUpdate(data) {
  
    const { session_id, channel_id, self_deaf, self_mute } = data;

    if (this.player.channelId && (channel_id && this.player.channelId !== channel_id)) {
            this.player.setVoiceChannel(channel_id);
        }

        this.deafened = self_deaf;
        this.muted = self_mute;
        this.sessionId = session_id || null;
        this.player.poru.emit('debug', this.player.node.name, `[Voice] <- [Discord] : State Update Received | Channel: ${this.player.channelId} Session ID: ${session_id} Guild: ${this.player.guildId}`);
       }
}


module.exports = voiceConnection
