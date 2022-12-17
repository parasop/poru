"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const undici_1 = require("undici");
class Rest {
    sessionId;
    password;
    url;
    poru;
    constructor(poru, node) {
        this.poru = poru;
        this.url = `http${node.secure ? "s" : ""}://${node.options.host}:${node.options.port}`;
        this.sessionId = node.sessionId;
        this.password = node.password;
    }
    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }
    getAllPlayers() {
        return this.get(`/v3/${this.sessionId}/players`);
    }
    async updatePlayer(options) {
        return this.patch(this.url +
            `/v3/sessions/${this.sessionId}/players/${options.guildId}/?noReplace=false`, options.data);
    }
    async destroyPlayer(guildId) {
        this.delete(this.url + `/v3/sessions/${this.sessionId}/players/${guildId}`);
    }
    async resolveQuery(endpoint) {
        return this.get(endpoint);
    }
    async patch(url, options) {
        let req = await (0, undici_1.fetch)(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.password,
            },
            body: JSON.stringify(options),
        });
        return await req.json();
    }
    async delete(url) {
        let req = await (0, undici_1.fetch)(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: this.password,
            },
        });
        return await req.json();
    }
    async get(path) {
        let req = await (0, undici_1.fetch)(this.url + path, {
            method: "GET",
            headers: {
                Authorization: this.password,
            },
        });
        return await req.json();
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map