poru / [Exports](modules.md)

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/732987654165233744/987656504373026816/20220618_000923_0000.png" />
</p>

<p align="center">
  <a href="https://discord.gg/Zmmc47Nrh8">
    <img src="https://img.shields.io/discord/567705326774779944?style=flat-square" alt="Discord">
  </a>
  <a href="https://www.npmjs.com/package/poru">
    <img src="https://img.shields.io/npm/v/poru?style=flat-square" alt="npm">
  </a>
  <img src="https://img.shields.io/github/stars/parasop/poru?style=flat-square" alt="GitHub Stars">
  <img src="https://img.shields.io/github/issues-raw/parasop/poru?style=flat-square" alt="GitHub issues">
  <img src="https://img.shields.io/snyk/vulnerabilities/npm/poru?style=flat-square" alt="Snyk Vulnerabilities for npm package">
  <img src="https://img.shields.io/npm/l/poru?style=flat-square" alt="NPM">
</p>

<p align="center">
  note: this version supports only Lavalink v4 or above
</p>

<p align="center">
  <a href="https://nodei.co/npm/poru/">
    <img src="https://nodei.co/npm/poru.png?downloads=true&downloadRank=true&stars=true" alt="Poru NPM Package">
  </a>
</p>

## Table of contents

- [Documentation](https://poru.js.org)
- [Installation](#installation)
- [About](#about)
- [Example](https://github.com/parasop/poru-example)

# Installation

```bash
# Using npm
npm install poru

# Using yarn
yarn add poru
```

# About

To use, you need a configured [Lavalink](https://github.com/lavalink-devs/Lavalink) instance.

- Stable client
- Support TypeScript
- 100% Compatible with Lavalink
- Object-oriented
- 100% Customizable
- Easy to setup
- Inbuilt Queue System
- Inbuilt support for Spotify, Apple Music, and Deezer

## Implementation Repo:

Note: Send PR to add your repo here

| URL | Features | Additional Information |
|-----|----------|------------------------|
| [Poru Music](https://github.com/parasop/poru-example) | Basic example | Works with the latest Discord.js version |
| [The world machine](https://github.com/Reishimanfr/TWM-bot) | See GitHub repo for the full list | - |
| [Lunox](https://github.com/adh319/Lunox) | Look over the repo for the full list of features | Simply powerful Discord Music Bot |

## Example usage basic bot

```javascript
const { Client, GatewayIntentBits } = require("discord.js");
const { Poru } = require("poru");

const nodes = [
    {
        name: "local-node",
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
    },
];

const PoruOptions = {
    library: "discord.js",
    defaultPlatform: "scsearch",
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
    return channel.send(`Now playing \`${track.info.title}\``);
});

client.on("ready", () => {
    console.log("Ready!");
    client.poru.init(client);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.member.voice.channel) {
        return interaction.reply({
            content: `Please connect with a voice channel `,
            ephemeral: true,
        });
    }

    const track = interaction.options.getString("track");

    const res = await client.poru.resolve({ query: track, source: "scsearch", requester: interaction.member });

    if (res.loadType === "error") {
        return interaction.reply("Failed to load track.");
    } else if (res.loadType === "empty") {
        return interaction.reply("No source found!");
    }

    // Create connection with Discord voice channel
    const player = client.poru.createConnection({
        guildId: interaction.guild.id,
        voiceChannel: interaction.member.voice.channelId,
        textChannel: interaction.channel.id,
        deaf: true,
    });

    if (res.loadType === "playlist") {
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
        interaction.reply(`Queued Track \n \`${track.info.title}\``)
    }

    if (!player.isPlaying && player.isConnected) player.play();
});

client.login("TOKEN");
```

## Plugins list:

Note: Open a PR to add your plugin here

| Name | Link | Additional Description |
|------|------|------------------------|
| Poru Spotify | [poru-spotify](https://github.com/parasop/poru-spotify) | Plugin for integrating Spotify with Poru |
| Poru Deezer | [poru-deezer](https://github.com/parasop/poru-deezer) | Plugin for integrating Deezer with Poru |
| Poru Apple Music | [poru-applemusic](https://github.com/parasop/poru-applemusic) | Plugin for integrating Apple Music with Poru |

## Need Help?

Feel free to join our [Discord server](https://discord.gg/Zmmc47Nrh8). Give us suggestions and advice about errors and new features.

With ❤️ by [Paras](https://github.com/parasop).
