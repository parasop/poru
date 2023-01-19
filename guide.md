# Guide for poru v4

## how to create Player?

```JS
const player = client.poru.createConnection({
    guildId: interaction.guild.id,
    voiceChannel: interaction.member.voice.channelId,
    textChannel: interaction.channel.id,
    deaf: true,
  });
```
## how to play songs from spotify?
```
const {Spotify} = require("poru-spotify");
const {Poru} = require("poru");

const spotify = new Spotify({
clientID: "",
clientSecret :""
})

//plugin should be an array
const poru = new Poru(client,nodes,{plugins:[spotify] })
```
