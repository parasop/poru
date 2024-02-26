[poru](../README.md) / [Exports](../modules.md) / Node

# Class: Node

## Table of contents

### Constructors

- [constructor](Node.md#constructor)

### Properties

- [attempt](Node.md#attempt)
- [autoResume](Node.md#autoresume)
- [isConnected](Node.md#isconnected)
- [name](Node.md#name)
- [options](Node.md#options)
- [password](Node.md#password)
- [poru](Node.md#poru)
- [reconnectAttempt](Node.md#reconnectattempt)
- [reconnectTimeout](Node.md#reconnecttimeout)
- [reconnectTries](Node.md#reconnecttries)
- [regions](Node.md#regions)
- [rest](Node.md#rest)
- [restURL](Node.md#resturl)
- [resumeKey](Node.md#resumekey)
- [resumeTimeout](Node.md#resumetimeout)
- [secure](Node.md#secure)
- [sessionId](Node.md#sessionid)
- [socketURL](Node.md#socketurl)
- [stats](Node.md#stats)
- [ws](Node.md#ws)

### Accessors

- [penalties](Node.md#penalties)

### Methods

- [close](Node.md#close)
- [connect](Node.md#connect)
- [disconnect](Node.md#disconnect)
- [error](Node.md#error)
- [getRoutePlannerStatus](Node.md#getrouteplannerstatus)
- [message](Node.md#message)
- [open](Node.md#open)
- [reconnect](Node.md#reconnect)
- [send](Node.md#send)
- [setStats](Node.md#setstats)
- [unmarkFailedAddress](Node.md#unmarkfailedaddress)

## Constructors

### constructor

• **new Node**(`poru`, `node`, `options`): [`Node`](Node.md)

The Node class that is used to connect to a lavalink node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `poru` | [`Poru`](Poru.md) | Poru |
| `node` | [`NodeGroup`](../interfaces/NodeGroup.md) | NodeGroup |
| `options` | [`PoruOptions`](../interfaces/PoruOptions.md) | PoruOptions |

#### Returns

[`Node`](Node.md)

#### Defined in

src/Node/Node.ts:93

## Properties

### attempt

• **attempt**: `number`

#### Defined in

src/Node/Node.ts:84

___

### autoResume

• `Readonly` **autoResume**: `boolean`

#### Defined in

src/Node/Node.ts:80

___

### isConnected

• **isConnected**: `boolean`

#### Defined in

src/Node/Node.ts:67

___

### name

• `Readonly` **name**: `string`

#### Defined in

src/Node/Node.ts:69

___

### options

• **options**: [`NodeGroup`](../interfaces/NodeGroup.md)

#### Defined in

src/Node/Node.ts:86

___

### password

• **password**: `string`

#### Defined in

src/Node/Node.ts:72

___

### poru

• **poru**: [`Poru`](Poru.md)

#### Defined in

src/Node/Node.ts:68

___

### reconnectAttempt

• **reconnectAttempt**: `Timeout`

#### Defined in

src/Node/Node.ts:83

___

### reconnectTimeout

• `Readonly` **reconnectTimeout**: `number`

#### Defined in

src/Node/Node.ts:81

___

### reconnectTries

• **reconnectTries**: `number`

#### Defined in

src/Node/Node.ts:82

___

### regions

• `Readonly` **regions**: `string`[]

#### Defined in

src/Node/Node.ts:74

___

### rest

• **rest**: [`Rest`](Rest.md)

#### Defined in

src/Node/Node.ts:76

___

### restURL

• `Readonly` **restURL**: `string`

#### Defined in

src/Node/Node.ts:70

___

### resumeKey

• `Readonly` **resumeKey**: `string`

#### Defined in

src/Node/Node.ts:78

___

### resumeTimeout

• `Readonly` **resumeTimeout**: `number`

#### Defined in

src/Node/Node.ts:79

___

### secure

• `Readonly` **secure**: `boolean`

#### Defined in

src/Node/Node.ts:73

___

### sessionId

• **sessionId**: `string`

#### Defined in

src/Node/Node.ts:75

___

### socketURL

• `Readonly` **socketURL**: `string`

#### Defined in

src/Node/Node.ts:71

___

### stats

• **stats**: [`NodeStats`](../interfaces/NodeStats.md)

#### Defined in

src/Node/Node.ts:85

___

### ws

• **ws**: `WebSocket`

#### Defined in

src/Node/Node.ts:77

## Accessors

### penalties

• `get` **penalties**(): `number`

This function will get the penalties from the current node

#### Returns

`number`

The amount of penalties

#### Defined in

src/Node/Node.ts:196

## Methods

### close

▸ **close**(`event`): `void`

This will close the connection to the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `any` | any |

#### Returns

`void`

void

#### Defined in

src/Node/Node.ts:278

___

### connect

▸ **connect**(): `void`

Connects to the lavalink node

#### Returns

`void`

#### Defined in

src/Node/Node.ts:120

___

### disconnect

▸ **disconnect**(): `Promise`\<`void`\>

This function will make the node disconnect

#### Returns

`Promise`\<`void`\>

void

#### Defined in

src/Node/Node.ts:176

___

### error

▸ **error**(`event`): `void`

This function will emit the error so that the user's listeners can get them and listen to them

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `any` | any |

#### Returns

`void`

void

#### Defined in

src/Node/Node.ts:292

___

### getRoutePlannerStatus

▸ **getRoutePlannerStatus**(): `Promise`\<``null``\>

This function will get the RoutePlanner status

#### Returns

`Promise`\<``null``\>

#### Defined in

src/Node/Node.ts:305

___

### message

▸ **message**(`payload`): `Promise`\<`void`\>

This will send a message to the node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | any |

#### Returns

`Promise`\<`void`\>

void

#### Defined in

src/Node/Node.ts:247

___

### open

▸ **open**(): `Promise`\<`void`\>

This function will open up again the node

#### Returns

`Promise`\<`void`\>

The Promise<void>

#### Defined in

src/Node/Node.ts:214

___

### reconnect

▸ **reconnect**(): `void`

Handles the message event

#### Returns

`void`

#### Defined in

src/Node/Node.ts:156

___

### send

▸ **send**(`payload`): `void`

Handles the message event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `any` | any |

#### Returns

`void`

#### Defined in

src/Node/Node.ts:143

___

### setStats

▸ **setStats**(`packet`): `void`

This function will set the stats accordingly from the NodeStats

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `packet` | [`NodeStats`](../interfaces/NodeStats.md) | The NodeStats |

#### Returns

`void`

void

#### Defined in

src/Node/Node.ts:238

___

### unmarkFailedAddress

▸ **unmarkFailedAddress**(`address`): `Promise`\<[`ErrorResponses`](../interfaces/ErrorResponses.md)\>

This function will Unmark a failed address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to unmark as failed. This address must be in the same ip block. |

#### Returns

`Promise`\<[`ErrorResponses`](../interfaces/ErrorResponses.md)\>

This function will most likely error if you havn't enabled the route planner

#### Defined in

src/Node/Node.ts:314
