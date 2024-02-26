[poru](../README.md) / [Exports](../modules.md) / TrackStuckEvent

# Interface: TrackStuckEvent

## Hierarchy

- [`PlayerEvent`](PlayerEvent.md)

  ↳ **`TrackStuckEvent`**

## Table of contents

### Properties

- [guildId](TrackStuckEvent.md#guildid)
- [op](TrackStuckEvent.md#op)
- [thresholdMs](TrackStuckEvent.md#thresholdms)
- [track](TrackStuckEvent.md#track)
- [type](TrackStuckEvent.md#type)

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

### thresholdMs

• **thresholdMs**: `number`

#### Defined in

src/Poru.ts:59

___

### track

• **track**: [`Track`](../classes/Track.md)

#### Defined in

src/Poru.ts:58

___

### type

• **type**: ``"TrackStuckEvent"``

#### Overrides

[PlayerEvent](PlayerEvent.md).[type](PlayerEvent.md#type)

#### Defined in

src/Poru.ts:57
