[poru](../README.md) / [Exports](../modules.md) / Rest

# Class: Rest

## Table of contents

### Constructors

- [constructor](Rest.md#constructor)

### Properties

- [password](Rest.md#password)
- [poru](Rest.md#poru)
- [sessionId](Rest.md#sessionid)
- [url](Rest.md#url)

### Methods

- [delete](Rest.md#delete)
- [destroyPlayer](Rest.md#destroyplayer)
- [get](Rest.md#get)
- [getAllPlayers](Rest.md#getallplayers)
- [patch](Rest.md#patch)
- [post](Rest.md#post)
- [setSessionId](Rest.md#setsessionid)
- [updatePlayer](Rest.md#updateplayer)

## Constructors

### constructor

• **new Rest**(`poru`, `node`): [`Rest`](Rest.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `poru` | [`Poru`](Poru.md) |
| `node` | [`Node`](Node.md) |

#### Returns

[`Rest`](Rest.md)

#### Defined in

src/Node/Rest.ts:57

## Properties

### password

• `Private` **password**: `string`

#### Defined in

src/Node/Rest.ts:53

___

### poru

• **poru**: [`Poru`](Poru.md)

#### Defined in

src/Node/Rest.ts:55

___

### sessionId

• `Private` **sessionId**: `string`

#### Defined in

src/Node/Rest.ts:52

___

### url

• **url**: `string`

#### Defined in

src/Node/Rest.ts:54

## Methods

### delete

▸ **delete**\<`T`\>(`endpoint`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | \`/$\{string}\` |

#### Returns

`Promise`\<`T`\>

#### Defined in

src/Node/Rest.ts:129

___

### destroyPlayer

▸ **destroyPlayer**(`guildId`): `Promise`\<[`ErrorResponses`](../interfaces/ErrorResponses.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `guildId` | `string` |

#### Returns

`Promise`\<[`ErrorResponses`](../interfaces/ErrorResponses.md)\>

#### Defined in

src/Node/Rest.ts:76

___

### get

▸ **get**\<`T`\>(`path`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | \`/$\{string}\` |

#### Returns

`Promise`\<`T`\>

#### Defined in

src/Node/Rest.ts:80

___

### getAllPlayers

▸ **getAllPlayers**(): `Promise`\<[`PlayerObjectFromAPI`](../interfaces/PlayerObjectFromAPI.md) \| [`ErrorResponses`](../interfaces/ErrorResponses.md)\>

#### Returns

`Promise`\<[`PlayerObjectFromAPI`](../interfaces/PlayerObjectFromAPI.md) \| [`ErrorResponses`](../interfaces/ErrorResponses.md)\>

#### Defined in

src/Node/Rest.ts:68

___

### patch

▸ **patch**\<`T`\>(`endpoint`, `body`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | \`/$\{string}\` |
| `body` | `any` |

#### Returns

`Promise`\<`T`\>

#### Defined in

src/Node/Rest.ts:95

___

### post

▸ **post**\<`T`\>(`endpoint`, `body`): `Promise`\<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | \`/$\{string}\` |
| `body` | `any` |

#### Returns

`Promise`\<`T`\>

#### Defined in

src/Node/Rest.ts:112

___

### setSessionId

▸ **setSessionId**(`sessionId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionId` | `string` |

#### Returns

`void`

#### Defined in

src/Node/Rest.ts:64

___

### updatePlayer

▸ **updatePlayer**(`options`): `Promise`\<[`PlayerObjectFromAPI`](../interfaces/PlayerObjectFromAPI.md) \| [`ErrorResponses`](../interfaces/ErrorResponses.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`playOptions`](../interfaces/playOptions.md) |

#### Returns

`Promise`\<[`PlayerObjectFromAPI`](../interfaces/PlayerObjectFromAPI.md) \| [`ErrorResponses`](../interfaces/ErrorResponses.md)\>

#### Defined in

src/Node/Rest.ts:72
