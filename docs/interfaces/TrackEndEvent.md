[poru](../README.md) / [Exports](../modules.md) / TrackEndEvent

# Interface: TrackEndEvent

## Hierarchy

- [`PlayerEvent`](PlayerEvent.md)

  ↳ **`TrackEndEvent`**

## Table of contents

### Properties

- [guildId](TrackEndEvent.md#guildid)
- [op](TrackEndEvent.md#op)
- [reason](TrackEndEvent.md#reason)
- [track](TrackEndEvent.md#track)
- [type](TrackEndEvent.md#type)

## Properties

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

• **reason**: [`TrackEndReason`](../modules.md#trackendreason)

#### Defined in

src/Poru.ts:53

___

### track

• **track**: [`Track`](../classes/Track.md)

#### Defined in

src/Poru.ts:52

___

### type

• **type**: ``"TrackEndEvent"``

#### Overrides

[PlayerEvent](PlayerEvent.md).[type](PlayerEvent.md#type)

#### Defined in

src/Poru.ts:51
