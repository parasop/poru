[poru](../README.md) / [Exports](../modules.md) / LoadTrackResponsePlaylist

# Interface: LoadTrackResponsePlaylist

## Table of contents

### Properties

- [data](LoadTrackResponsePlaylist.md#data)
- [loadType](LoadTrackResponsePlaylist.md#loadtype)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `info` | \{ `name`: `string` ; `selectedTrack`: `number`  } | The info of the playlist |
| `info.name` | `string` | The name of the playlist |
| `info.selectedTrack` | `number` | The selected track of the playlist (-1 if no track is selected) |
| `pluginInfo` | `any` | Addition playlist info provided by plugins |
| `tracks` | [`trackData`](trackData.md)[] | The tracks of the playlist |

#### Defined in

src/guild/Response.ts:39

___

### loadType

• **loadType**: ``"playlist"``

#### Defined in

src/guild/Response.ts:38
