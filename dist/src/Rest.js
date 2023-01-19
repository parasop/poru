"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = exports.RequestMethod = void 0;
const undici_1 = require("undici");
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["Get"] = "GET";
    RequestMethod["Delete"] = "DELETE";
    RequestMethod["Post"] = "POST";
    RequestMethod["Patch"] = "PATCH";
    RequestMethod["Put"] = "PUT";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
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
        return this.get(`/v3/sessions/${this.sessionId}/players`);
    }
    async updatePlayer(options) {
        return await this.patch(`/v3/sessions/${this.sessionId}/players/${options.guildId}/?noReplace=false`, options.data);
    }
    async destroyPlayer(guildId) {
        await this.delete(`/v3/sessions/${this.sessionId}/players/${guildId}`);
    }
    async get(path) {
        let req = await (0, undici_1.fetch)(this.url + path, {
            method: RequestMethod.Get,
            headers: {
                "Content-Type": "application/json",
                Authorization: this.password,
            },
        });
        return await this.parseResponse(req);
    }
    async patch(endpoint, body) {
        let req = await (0, undici_1.fetch)(this.url + endpoint, {
            method: RequestMethod.Patch,
            headers: {
                "Content-Type": "application/json",
                Authorization: this.password,
            },
            body: JSON.stringify(body),
        });
        return await this.parseResponse(req);
    }
    async post(endpoint, body) {
        let req = await (0, undici_1.fetch)(this.url + endpoint, {
            method: RequestMethod.Post,
            headers: {
                "Content-Type": "application/json",
                Authorization: this.password,
            },
            body: JSON.stringify(body),
        });
        return await this.parseResponse(req);
    }
    async delete(endpoint) {
        let req = await (0, undici_1.fetch)(this.url + endpoint, {
            method: RequestMethod.Delete,
            headers: {
                "Content-Type": "application/json",
                Authorization: this.password,
            },
        });
        return await this.parseResponse(req);
    }
    async parseResponse(req) {
        try {
            this.poru.emit("raw", "Rest", await req.json());
            return await req.json();
        }
        catch (e) {
            return null;
        }
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map