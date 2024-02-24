[poru](../README.md) / [Exports](../modules.md) / Track

# Class: Track

## Table of contents

### Constructors

- [constructor](Track.md#constructor)

### Properties

- [info](Track.md#info)
- [pluginInfo](Track.md#plugininfo)
- [track](Track.md#track)
- [userData](Track.md#userdata)

### Methods

- [resolve](Track.md#resolve)

## Constructors

### constructor

• **new Track**(`data`, `requester?`): [`Track`](Track.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`trackData`](../interfaces/trackData.md) |
| `requester?` | `any` |

#### Returns

[`Track`](Track.md)

#### Defined in

src/guild/Track.ts:32

## Properties

### info

• **info**: `trackInfoExtended`

#### Defined in

src/guild/Track.ts:28

___

### pluginInfo

• **pluginInfo**: `any`

#### Defined in

src/guild/Track.ts:29

___

### track

• **track**: `string`

#### Defined in

src/guild/Track.ts:27

___

### userData

• **userData**: `any`

#### Defined in

src/guild/Track.ts:30

## Methods

### resolve

▸ **resolve**(`poru`): `Promise`\<[`Track`](Track.md)\>

This function will resolve the track and return the track as resolved

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `poru` | [`Poru`](Poru.md) | The poru instance |

#### Returns

`Promise`\<[`Track`](Track.md)\>

The resolved track

#### Defined in

src/guild/Track.ts:50
