[poru](../README.md) / [Exports](../modules.md) / NodeStats

# Interface: NodeStats

## Table of contents

### Properties

- [cpu](NodeStats.md#cpu)
- [frameStats](NodeStats.md#framestats)
- [memory](NodeStats.md#memory)
- [players](NodeStats.md#players)
- [playingPlayers](NodeStats.md#playingplayers)
- [uptime](NodeStats.md#uptime)

## Properties

### cpu

• **cpu**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cores` | `number` |
| `lavalinkLoad` | `number` |
| `systemLoad` | `number` |

#### Defined in

src/Node/Node.ts:20

___

### frameStats

• **frameStats**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deficit` | `number` |
| `nulled` | `number` |
| `sent` | `number` |

#### Defined in

src/Node/Node.ts:15

___

### memory

• **memory**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allocated` | `number` |
| `free` | `number` |
| `reservable` | `number` |
| `used` | `number` |

#### Defined in

src/Node/Node.ts:9

___

### players

• **players**: `number`

#### Defined in

src/Node/Node.ts:7

___

### playingPlayers

• **playingPlayers**: `number`

#### Defined in

src/Node/Node.ts:8

___

### uptime

• **uptime**: `number`

#### Defined in

src/Node/Node.ts:25
