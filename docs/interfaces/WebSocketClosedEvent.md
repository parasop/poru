[poru](../README.md) / [Exports](../modules.md) / WebSocketClosedEvent

# Interface: WebSocketClosedEvent

## Hierarchy

- [`PlayerEvent`](PlayerEvent.md)

  ↳ **`WebSocketClosedEvent`**

## Table of contents

### Properties

- [byRemote](WebSocketClosedEvent.md#byremote)
- [code](WebSocketClosedEvent.md#code)
- [guildId](WebSocketClosedEvent.md#guildid)
- [op](WebSocketClosedEvent.md#op)
- [reason](WebSocketClosedEvent.md#reason)
- [type](WebSocketClosedEvent.md#type)

## Properties

### byRemote

• **byRemote**: `boolean`

#### Defined in

src/Poru.ts:70

___

### code

• **code**: `number`

#### Defined in

src/Poru.ts:69

___

### guildId

• **guildId**: `string`

#### Inherited from

[PlayerEvent](PlayerEvent.md).[guildId](PlayerEvent.md#guildid)

#### Defined in

src/Poru.ts:42

___

### op

• **op**: ``"event"``

#### Inherited from

[PlayerEvent](PlayerEvent.md).[op](PlayerEvent.md#op)

#### Defined in

src/Poru.ts:40

___

### reason

• **reason**: `string`

#### Defined in

src/Poru.ts:71

___

### type

• **type**: ``"WebSocketClosedEvent"``

#### Overrides

[PlayerEvent](PlayerEvent.md).[type](PlayerEvent.md#type)

#### Defined in

src/Poru.ts:68
