[poru](../README.md) / [Exports](../modules.md) / Response

# Class: Response

## Table of contents

### Constructors

- [constructor](Response.md#constructor)

### Properties

- [loadType](Response.md#loadtype)
- [playlistInfo](Response.md#playlistinfo)
- [tracks](Response.md#tracks)

### Methods

- [handleTracks](Response.md#handletracks)

## Constructors

### constructor

• **new Response**(`response`, `requester`): [`Response`](Response.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`LoadTrackResponse`](../modules.md#loadtrackresponse) |
| `requester` | `any` |

#### Returns

[`Response`](Response.md)

#### Defined in

src/guild/Response.ts:72

## Properties

### loadType

• **loadType**: [`LoadType`](../modules.md#loadtype)

#### Defined in

src/guild/Response.ts:70

___

### playlistInfo

• **playlistInfo**: `PlaylistInfo`

#### Defined in

src/guild/Response.ts:71

___

### tracks

• **tracks**: [`Track`](Track.md)[]

#### Defined in

src/guild/Response.ts:69

## Methods

### handleTracks

▸ **handleTracks**(`data`, `requester`): [`Track`](Track.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`trackData`](../interfaces/trackData.md) \| [`trackData`](../interfaces/trackData.md)[] |
| `requester` | `any` |

#### Returns

[`Track`](Track.md)[]

#### Defined in

src/guild/Response.ts:95
