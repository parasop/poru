"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = exports.RequestMethod = void 0;
const undici_1 = require("undici");
;
;
;
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["Get"] = "GET";
    RequestMethod["Delete"] = "DELETE";
    RequestMethod["Post"] = "POST";
    RequestMethod["Patch"] = "PATCH";
    RequestMethod["Put"] = "PUT";
})(RequestMethod || (exports.RequestMethod = RequestMethod = {}));
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
    async getAllPlayers() {
        return this.get(`/v4/sessions/${this.sessionId}/players`);
    }
    async updatePlayer(options) {
        return await this.patch(`/v4/sessions/${this.sessionId}/players/${options.guildId}?noReplace=false`, options.data);
    }
    async destroyPlayer(guildId) {
        return await this.delete(`/v4/sessions/${this.sessionId}/players/${guildId}`);
    }
    async get(path) {
        try {
            let req = await (0, undici_1.fetch)(this.url + path, {
                method: RequestMethod.Get,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
            });
            return await req.json();
        }
        catch (e) {
            return null;
        }
    }
    async patch(endpoint, body) {
        try {
            let req = await (0, undici_1.fetch)(this.url + endpoint, {
                method: RequestMethod.Patch,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
                body: JSON.stringify(body),
            });
            return await req.json();
        }
        catch (e) {
            return null;
        }
    }
    async post(endpoint, body) {
        try {
            let req = await (0, undici_1.fetch)(this.url + endpoint, {
                method: RequestMethod.Post,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
                body: JSON.stringify(body),
            });
            return await req.json();
        }
        catch (e) {
            return null;
        }
    }
    async delete(endpoint) {
        try {
            let req = await (0, undici_1.fetch)(this.url + endpoint, {
                method: RequestMethod.Delete,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.password,
                },
            });
            return await req.json();
        }
        catch (e) {
            return null;
        }
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map