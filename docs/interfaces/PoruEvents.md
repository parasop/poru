[poru](../README.md) / [Exports](../modules.md) / PoruEvents

# Interface: PoruEvents

## Table of contents

### Events

- [debug](PoruEvents.md#debug)
- [nodeConnect](PoruEvents.md#nodeconnect)
- [nodeDisconnect](PoruEvents.md#nodedisconnect)
- [nodeError](PoruEvents.md#nodeerror)
- [nodeReconnect](PoruEvents.md#nodereconnect)
- [playerCreate](PoruEvents.md#playercreate)
- [playerDestroy](PoruEvents.md#playerdestroy)
- [playerUpdate](PoruEvents.md#playerupdate)
- [queueEnd](PoruEvents.md#queueend)
- [raw](PoruEvents.md#raw)
- [socketClose](PoruEvents.md#socketclose)
- [trackEnd](PoruEvents.md#trackend)
- [trackError](PoruEvents.md#trackerror)
- [trackStart](PoruEvents.md#trackstart)

## Events

### debug

• **debug**: (...`args`: `any`) => `void`

Emitted when data useful for debugging is produced

**`Param`**

#### Type declaration

▸ (`...args`): `void`

Emitted when data useful for debugging is produced

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any` |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:111

___

### nodeConnect

• **nodeConnect**: (`node`: [`Node`](../classes/Node.md)) => `void`

Emitted when lavalink node is connected with poru

**`Param`**

**`Param`**

#### Type declaration

▸ (`node`): `void`

Emitted when lavalink node is connected with poru

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](../classes/Node.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:129

___

### nodeDisconnect

• **nodeDisconnect**: (`node`: [`Node`](../classes/Node.md), `event?`: `unknown`) => `void`

Emitted when data useful for debugging is produced

**`Param`**

**`Param`**

#### Type declaration

▸ (`node`, `event?`): `void`

Emitted when data useful for debugging is produced

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](../classes/Node.md) |
| `event?` | `unknown` |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:138

___

### nodeError

• **nodeError**: (`node`: [`Node`](../classes/Node.md), `event`: `any`) => `void`

Emitted when lavalink nodes get an error

**`Param`**

**`Param`**

#### Type declaration

▸ (`node`, `event`): `void`

Emitted when lavalink nodes get an error

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](../classes/Node.md) |
| `event` | `any` |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:155

___

### nodeReconnect

• **nodeReconnect**: (`node`: [`Node`](../classes/Node.md)) => `void`

Emitted when poru try to reconnect with lavalink node while disconnected

**`Param`**

#### Type declaration

▸ (`node`): `void`

Emitted when poru try to reconnect with lavalink node while disconnected

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`](../classes/Node.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:146

___

### playerCreate

• **playerCreate**: (`player`: [`Player`](../classes/Player.md)) => `void`

Emitted when a player got created

**`Param`**

#### Type declaration

▸ (`player`): `void`

Emitted when a player got created

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:210

___

### playerDestroy

• **playerDestroy**: (`player`: [`Player`](../classes/Player.md)) => `void`

Emitted when a player destroy

**`Param`**

#### Type declaration

▸ (`player`): `void`

Emitted when a player destroy

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:219

___

### playerUpdate

• **playerUpdate**: (`player`: [`Player`](../classes/Player.md)) => `void`

Emitted when a player got updates

**`Param`**

#### Type declaration

▸ (`player`): `void`

Emitted when a player got updates

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:202

___

### queueEnd

• **queueEnd**: (`player`: [`Player`](../classes/Player.md)) => `void`

Emitted when player's queue  is completed and going to disconnect

**`Param`**

#### Type declaration

▸ (`player`): `void`

Emitted when player's queue  is completed and going to disconnect

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:184

___

### raw

• **raw**: (`topic`: `string`, ...`args`: `unknown`[]) => `void`

**`Param`**

from what section the event come

**`Param`**

Emitted when a Response is come

#### Type declaration

▸ (`topic`, `...args`): `void`

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `topic` | `string` | from what section the event come |
| `...args` | `unknown`[] | Emitted when a Response is come |

##### Returns

`void`

#### Defined in

src/Poru.ts:120

___

### socketClose

• **socketClose**: (`player`: [`Player`](../classes/Player.md), `track`: [`Track`](../classes/Track.md), `data`: [`WebSocketClosedEvent`](WebSocketClosedEvent.md)) => `void`

Emitted when the websocket connection to Discord voice servers is closed

**`Param`**

**`Param`**

**`Param`**

#### Type declaration

▸ (`player`, `track`, `data`): `void`

Emitted when the websocket connection to Discord voice servers is closed

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |
| `track` | [`Track`](../classes/Track.md) |
| `data` | [`WebSocketClosedEvent`](WebSocketClosedEvent.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:229

___

### trackEnd

• **trackEnd**: (`player`: [`Player`](../classes/Player.md), `track`: [`Track`](../classes/Track.md), `data`: [`TrackEndEvent`](TrackEndEvent.md)) => `void`

Emitted whenever track ends

**`Param`**

**`Param`**

**`Param`**

#### Type declaration

▸ (`player`, `track`, `data`): `void`

Emitted whenever track ends

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |
| `track` | [`Track`](../classes/Track.md) |
| `data` | [`TrackEndEvent`](TrackEndEvent.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:175

___

### trackError

• **trackError**: (`player`: [`Player`](../classes/Player.md), `track`: [`Track`](../classes/Track.md), `data`: [`TrackStuckEvent`](TrackStuckEvent.md) \| [`TrackExceptionEvent`](TrackExceptionEvent.md)) => `void`

Emitted when a track gets stuck while playing

**`Param`**

**`Param`**

**`Param`**

#### Type declaration

▸ (`player`, `track`, `data`): `void`

Emitted when a track gets stuck while playing

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |
| `track` | [`Track`](../classes/Track.md) |
| `data` | [`TrackStuckEvent`](TrackStuckEvent.md) \| [`TrackExceptionEvent`](TrackExceptionEvent.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:194

___

### trackStart

• **trackStart**: (`player`: [`Player`](../classes/Player.md), `track`: [`Track`](../classes/Track.md)) => `void`

Emitted whenever player start playing new track

**`Param`**

**`Param`**

#### Type declaration

▸ (`player`, `track`): `void`

Emitted whenever player start playing new track

##### Parameters

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](../classes/Player.md) |
| `track` | [`Track`](../classes/Track.md) |

##### Returns

`void`

void

#### Defined in

src/Poru.ts:165
