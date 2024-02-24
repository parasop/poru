[poru](../README.md) / [Exports](../modules.md) / Connection

# Class: Connection

The connection class

**`Classdesc`**

The connection class

**`Param`**

The player class

**`Hideconstructor`**

## Table of contents

### Constructors

- [constructor](Connection.md#constructor)

### Properties

- [player](Connection.md#player)
- [region](Connection.md#region)
- [self\_deaf](Connection.md#self_deaf)
- [self\_mute](Connection.md#self_mute)
- [sessionId](Connection.md#sessionid)
- [voice](Connection.md#voice)

### Methods

- [setServersUpdate](Connection.md#setserversupdate)
- [setStateUpdate](Connection.md#setstateupdate)

## Constructors

### constructor

• **new Connection**(`player`): [`Connection`](Connection.md)

The connection class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | [`Player`](Player.md) | Player |

#### Returns

[`Connection`](Connection.md)

#### Defined in

src/Player/Connection.ts:29

## Properties

### player

• **player**: [`Player`](Player.md)

#### Defined in

src/Player/Connection.ts:18

___

### region

• **region**: `string`

#### Defined in

src/Player/Connection.ts:20

___

### self\_deaf

• **self\_deaf**: `boolean`

#### Defined in

src/Player/Connection.ts:23

___

### self\_mute

• **self\_mute**: `boolean`

#### Defined in

src/Player/Connection.ts:22

___

### sessionId

• **sessionId**: `string`

#### Defined in

src/Player/Connection.ts:19

___

### voice

• **voice**: [`IVoiceServer`](../interfaces/IVoiceServer.md)

#### Defined in

src/Player/Connection.ts:21

## Methods

### setServersUpdate

▸ **setServersUpdate**(`data`): `void`

Set the voice server update

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | The data from the voice server update |

#### Returns

`void`

#### Defined in

src/Player/Connection.ts:46

___

### setStateUpdate

▸ **setStateUpdate**(`data`): `void`

Set the state update

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | The data from the state update |

#### Returns

`void`

#### Defined in

src/Player/Connection.ts:70
