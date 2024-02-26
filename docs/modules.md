[poru](README.md) / Exports

# poru

## Table of contents

### Enumerations

- [RequestMethod](enums/RequestMethod.md)

### Classes

- [Connection](classes/Connection.md)
- [Filters](classes/Filters.md)
- [Node](classes/Node.md)
- [Player](classes/Player.md)
- [Plugin](classes/Plugin.md)
- [Poru](classes/Poru.md)
- [Response](classes/Response.md)
- [Rest](classes/Rest.md)
- [Track](classes/Track.md)
- [customFilter](classes/customFilter.md)

### Interfaces

- [ConnectionOptions](interfaces/ConnectionOptions.md)
- [ErrorResponses](interfaces/ErrorResponses.md)
- [FiltersOptions](interfaces/FiltersOptions.md)
- [IVoiceServer](interfaces/IVoiceServer.md)
- [LoadTrackResponseEmpty](interfaces/LoadTrackResponseEmpty.md)
- [LoadTrackResponseError](interfaces/LoadTrackResponseError.md)
- [LoadTrackResponsePlaylist](interfaces/LoadTrackResponsePlaylist.md)
- [LoadTrackResponseSearch](interfaces/LoadTrackResponseSearch.md)
- [LoadTrackResponseTrack](interfaces/LoadTrackResponseTrack.md)
- [NodeGroup](interfaces/NodeGroup.md)
- [NodeStats](interfaces/NodeStats.md)
- [PlayerEvent](interfaces/PlayerEvent.md)
- [PlayerObjectFromAPI](interfaces/PlayerObjectFromAPI.md)
- [PlayerState](interfaces/PlayerState.md)
- [PoruEvents](interfaces/PoruEvents.md)
- [PoruOptions](interfaces/PoruOptions.md)
- [ResolveOptions](interfaces/ResolveOptions.md)
- [TrackEndEvent](interfaces/TrackEndEvent.md)
- [TrackExceptionEvent](interfaces/TrackExceptionEvent.md)
- [TrackStartEvent](interfaces/TrackStartEvent.md)
- [TrackStuckEvent](interfaces/TrackStuckEvent.md)
- [WebSocketClosedEvent](interfaces/WebSocketClosedEvent.md)
- [channelMixOptions](interfaces/channelMixOptions.md)
- [playOptions](interfaces/playOptions.md)
- [trackData](interfaces/trackData.md)
- [trackInfo](interfaces/trackInfo.md)

### Type Aliases

- [Constructor](modules.md#constructor)
- [EventData](modules.md#eventdata)
- [LoadTrackResponse](modules.md#loadtrackresponse)
- [LoadType](modules.md#loadtype)
- [PlayerEventType](modules.md#playereventtype)
- [RouteLike](modules.md#routelike)
- [Severity](modules.md#severity)
- [TrackEndReason](modules.md#trackendreason)
- [supportedLibraries](modules.md#supportedlibraries)
- [supportedPlatforms](modules.md#supportedplatforms)

## Type Aliases

### Constructor

Ƭ **Constructor**\<`T`\>: (...`args`: `any`[]) => `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

• (`...args`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`T`

#### Defined in

src/Poru.ts:13

___

### EventData

Ƭ **EventData**: [`TrackEndEvent`](interfaces/TrackEndEvent.md) \| [`TrackStuckEvent`](interfaces/TrackStuckEvent.md) \| [`WebSocketClosedEvent`](interfaces/WebSocketClosedEvent.md) \| [`TrackStartEvent`](interfaces/TrackStartEvent.md) \| [`TrackExceptionEvent`](interfaces/TrackExceptionEvent.md)

The event data

#### Defined in

src/Poru.ts:78

___

### LoadTrackResponse

Ƭ **LoadTrackResponse**: [`LoadTrackResponseTrack`](interfaces/LoadTrackResponseTrack.md) \| [`LoadTrackResponseSearch`](interfaces/LoadTrackResponseSearch.md) \| [`LoadTrackResponseEmpty`](interfaces/LoadTrackResponseEmpty.md) \| [`LoadTrackResponseError`](interfaces/LoadTrackResponseError.md) \| [`LoadTrackResponsePlaylist`](interfaces/LoadTrackResponsePlaylist.md)

#### Defined in

src/guild/Response.ts:66

___

### LoadType

Ƭ **LoadType**: ``"track"`` \| ``"playlist"`` \| ``"search"`` \| ``"empty"`` \| ``"error"``

#### Defined in

src/guild/Response.ts:3

___

### PlayerEventType

Ƭ **PlayerEventType**: ``"TrackStartEvent"`` \| ``"TrackEndEvent"`` \| ``"TrackExceptionEvent"`` \| ``"TrackStuckEvent"`` \| ``"WebSocketClosedEvent"``

#### Defined in

src/Poru.ts:37

___

### RouteLike

Ƭ **RouteLike**: \`/$\{string}\`

#### Defined in

src/Node/Rest.ts:41

___

### Severity

Ƭ **Severity**: ``"common"`` \| ``"suspicious"`` \| ``"fault"``

#### Defined in

src/guild/Response.ts:26

___

### TrackEndReason

Ƭ **TrackEndReason**: ``"finished"`` \| ``"loadFailed"`` \| ``"stopped"`` \| ``"replaced"`` \| ``"cleanup"``

#### Defined in

src/Poru.ts:36

___

### supportedLibraries

Ƭ **supportedLibraries**: ``"discord.js"`` \| ``"eris"`` \| ``"oceanic"`` \| ``"other"``

#### Defined in

src/Poru.ts:34

___

### supportedPlatforms

Ƭ **supportedPlatforms**: ``"spsearch"`` \| ``"dzsearch"`` \| ``"amsearch"`` \| ``"scsearch"`` \| ``"ytsearch"`` \| ``"ytmsearch"``

#### Defined in

src/Poru.ts:35
