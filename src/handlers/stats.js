module.exports = class stats {
    constructor(client, payload) {
        client.stats = { ...payload };
        delete client.stats.op
    }
}