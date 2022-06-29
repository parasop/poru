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

To use you need a configured [Lavalink](https://github.com/Frederikam/Lavalink) instance.

- Stable client
- 100% Compatible with Lavalink
- Object-oriented
- 100% Customizable
- Easy to setup

## Implementation

[Poru Music](https://github.com/parasop/poru-example) **Example bot as guide for beginning.**

## Example usage basic bot

```javascript
// main file
// Require both libraries
const { Client } = require('discord.js');
const { Poru } = require('poru');

// Initiate both main classes
const client = new Client();

// Define some options for the node
const nodes = [
  {
    host: 'localhost',
    password: 'youshallnotpass',
    port: 2333,
    secure: false,
  },
];

// Define if you want to integrate spotify
const spotifyOptions = {
  clientID: 'Your Client ID', // You'll find this on https://developers.spotify.com/dashboard/
  clientSecret: 'Your Client Secret', // You'll find this on https://developers.spotify.com/dashboard/
  playlistLimit: 10, // The amount of pages to load when a playlist is searched with each page having 50 tracks.
  albumLimit: 5, // The amount of pages to load when a album is searched with each page having 50 tracks.
  artistLimit: 5, // The amount of pages to load when a artist is searched with each page having 50 tracks.
  searchMarket: 'IN', // The market from where the query should be searched from. Mainly this should contain your country.
};

// Assign Manager to the client variable
client.poru = new Poru(client, nodes);

// Emitted whenever a node connects
client.poru.on('nodeConnect', node => {
  console.log(`Node "${node.name}" connected.`);
});

// Emitted whenever a node encountered an error
client.poru.on('nodeError', (node, error) => {
  console.log(`Node "${node.name}" encountered an error`);
});

// Listen for when the client becomes ready
client.once('ready', () => {
  client.poru.init(client);
  console.log(`Logged in as ${client.user.tag}`);
});

// this event used to make connections upto date with lavalink
client.on('raw', async d => await client.poru.packetUpdate(d));

// Finally login at the END of your code
client.login('your bot token here');
```

```javascript
// creating player
const player = await client.poru.createConnection({
  guild: message.guild.id,
  voiceChannel: message.member.voice.channel.id,
  textChannel: message.channel,
  selfDeaf: true,
  selfMute: false,
});
// Getting tracks
const resolve = await client.poru.resolve('Ignite', 'yt');
```

## Need Help?

Feel free to join our [discord server](https://discord.gg/Zmmc47Nrh8), Give us suggestions and advice about errors and new features.
with ❤️ by [Paras](https://github.com/parasop) .
