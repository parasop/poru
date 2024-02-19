# Guide for poru v4

## How to create player?

```JS
const player = client.poru.createConnection({
    guildId: interaction.guild.id,
    voiceChannel: interaction.member.voice.channelId,
    textChannel: interaction.channel.id,
    deaf: true,
});
```
## How to play songs from spotify?
```JS
const { Spotify } = require("poru-spotify");
const { Poru } = require("poru");

const spotify = new Spotify({
    clientID: "",
    clientSecret: ""
})

//plugins should be an array
const poru = new Poru(client, nodes, { plugins: [spotify] })
```