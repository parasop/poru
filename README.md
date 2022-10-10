<p align="center">
  <img src="https://cdn.discordapp.com/attachments/732987654165233744/987656504373026816/20220618_000923_0000.png" />
</p>
<p align="center">

[![Discord](https://img.shields.io/discord/567705326774779944?style=flat-square)](https://discord.gg/Zmmc47Nrh8)
[![npm](https://img.shields.io/npm/v/poru?style=flat-square)](https://www.npmjs.com/package/poru)
![Github Stars](https://img.shields.io/github/stars/parasop/poru?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/parasop/poru?style=flat-square)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/poru?style=flat-square)
![NPM](https://img.shields.io/npm/l/poru?style=flat-square)

</p>

<p align="center">
  <a href="https://nodei.co/npm/poru/"><img src="https://nodei.co/npm/poru.png?downloads=true&downloadRank=true&stars=true"></a>
</p>

## Table of contents

- [Documentation](https://poru.parasdocs.tech)
- [Installation](#installation)
- [About](#about)
- [Example](https://github.com/parasop/poru-example)

# Installation

```
// Using npm
npm install poru

// Using yarn
yarn add poru
```

# About

To use you need a configured [Lavalink](https://github.com/freyacodes/Lavalink) instance.

- Stable client
- support typescript
- 100% Compatible with Lavalink
- Object-oriented
- 100% Customizable
- Easy to setup
- Inbuilt Queue System
- Inbuilt support for spotify,apple music and deezer
## Implementation

[Poru Music](https://github.com/parasop/poru-example) **Example bot as guide for beginning.**


## Implementation Repo:
Note : Send pr to add your repo here

URL | Features  | Additional Information
-------|----------|-----------------
[Poru Music](https://github.com/parasop/poru-example) | Basic example | works with latest djs version










## Example usage basic bot

```javascript
const { Client, GatewayIntentBits } = require("discord.js");
const { Poru } = require("poru");
const nodes = [
  {
    name: "main_node",
    host: "localhost",
    port: 8080,
    password: "iloveyou3000",
  },
];
const PoruOptions = {
  reconnectTime: 0,
  resumeKey: "MyPlayers",
  resumeTimeout: 60,
  defaultPlatform: "ytsearch",
};
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});
client.poru = new Poru(client, nodes, PoruOptions);

client.poru.on("trackStart", (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
  return channel.send(`Now playing \`${track.title}\``);
});

client.on("ready", () => {
  console.log("Ready!");
  client.poru.init(client);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.member.voice.channel)
    return interaction.reply({
      content: `Please connect with voice channel `,
      ephemeral: true,
    });

  const track = interaction.options.getString("track");

  const res = await client.poru.resolve(track);

  if (res.loadType === "LOAD_FAILED") {
    return interaction.reply("Failed to load track.");
  } else if (res.loadType === "NO_MATCHES") {
    return interaction.reply("No source found!");
  }

  //create connection with discord voice channnel
  const player = client.poru.createConnection({
    guildId: interaction.guild.id,
    voiceChannel: interaction.member.voice.channelId,
    textChannel: interaction.channel.id,
    selfDeaf: true,
  });

  if (res.loadType === "PLAYLIST_LOADED") {
    for (const track of res.tracks) {
      track.info.requester = interaction.user;
      player.queue.add(track);
    }

    interaction.reply(
      `${res.playlistInfo.name} has been loaded with ${res.tracks.length}`
    );
  } else {
    const track = res.tracks[0];
    track.info.requester = interaction.user;
    player.queue.add(track);
    interacton.reply(`Queued Track \n \`${track.title}\``);
  }

  if (!player.isPlaying && player.isConnected) player.play();
});

client.login("TOKEN");
```

## Need Help?

Feel free to join our [discord server](https://discord.gg/Zmmc47Nrh8), Give us suggestions and advice about errors and new features.
with ❤️ by [Paras](https://github.com/parasop) .
