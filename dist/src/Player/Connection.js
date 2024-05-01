"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
;
;
/**
  * The connection class
  * @class
  * @classdesc The connection class
  * @param {Player} player The player class
  * @hideconstructor
  *
 */
class Connection {
    player;
    sessionId;
    region;
    voice;
    self_mute;
    self_deaf;
    /**
     * The connection class
     * @param player Player
     */
    constructor(player) {
        this.player = player;
        this.sessionId = null;
        this.region = null;
        this.voice = {
            sessionId: null,
            token: null,
            endpoint: null,
        };
        this.self_mute = false;
        this.self_deaf = false;
    }
    /**
     * Set the voice server update
     * @param data The data from the voice server update
     */
    async setServersUpdate(data) {
        if (!data.endpoint)
            throw new Error("[Poru Error] No Session id found.");
        this.voice.endpoint = data.endpoint;
        this.voice.token = data.token;
        this.region = data.endpoint.split(".").shift()?.replace(/[0-9]/g, "") || null;
        await this.player.node.rest.updatePlayer({
            guildId: this.player.guildId,
            data: { voice: this.voice },
        });
        this.player.poru.emit("debug", this.player.node.name, `[Voice] <- [Discord] : Voice Server Update | Server: ${this.region} Guild: ${this.player.guildId}`);
    }
    ;
    /**
     * Set the state update
     * @param data The data from the state update
     */
    setStateUpdate(data) {
        const { session_id, channel_id, self_deaf, self_mute } = data;
        if (this.player.voiceChannel &&
            channel_id &&
            this.player.voiceChannel !== channel_id) {
            this.player.voiceChannel = channel_id;
        }
        this.self_deaf = self_deaf;
        this.self_mute = self_mute;
        this.voice.sessionId = session_id || null;
    }
    ;
}
exports.Connection = Connection;
;
//# sourceMappingURL=Connection.js.map