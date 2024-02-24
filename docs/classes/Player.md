[poru](../README.md) / [Exports](../modules.md) / Player

# Class: Player

## Hierarchy

- `EventEmitter`

  ↳ **`Player`**

## Table of contents

### Constructors

- [constructor](Player.md#constructor)

### Properties

- [connection](Player.md#connection)
- [currentTrack](Player.md#currenttrack)
- [data](Player.md#data)
- [deaf](Player.md#deaf)
- [filters](Player.md#filters)
- [guildId](Player.md#guildid)
- [isAutoPlay](Player.md#isautoplay)
- [isConnected](Player.md#isconnected)
- [isPaused](Player.md#ispaused)
- [isPlaying](Player.md#isplaying)
- [isQuietMode](Player.md#isquietmode)
- [loop](Player.md#loop)
- [mute](Player.md#mute)
- [node](Player.md#node)
- [ping](Player.md#ping)
- [poru](Player.md#poru)
- [position](Player.md#position)
- [previousTrack](Player.md#previoustrack)
- [queue](Player.md#queue)
- [textChannel](Player.md#textchannel)
- [timestamp](Player.md#timestamp)
- [voiceChannel](Player.md#voicechannel)
- [volume](Player.md#volume)
- [captureRejectionSymbol](Player.md#capturerejectionsymbol)
- [captureRejections](Player.md#capturerejections)
- [defaultMaxListeners](Player.md#defaultmaxlisteners)
- [errorMonitor](Player.md#errormonitor)

### Methods

- [[captureRejectionSymbol]](Player.md#[capturerejectionsymbol])
- [addListener](Player.md#addlistener)
- [autoMoveNode](Player.md#automovenode)
- [autoplay](Player.md#autoplay)
- [connect](Player.md#connect)
- [destroy](Player.md#destroy)
- [disconnect](Player.md#disconnect)
- [emit](Player.md#emit)
- [eventHandler](Player.md#eventhandler)
- [eventNames](Player.md#eventnames)
- [get](Player.md#get)
- [getMaxListeners](Player.md#getmaxlisteners)
- [listenerCount](Player.md#listenercount)
- [listeners](Player.md#listeners)
- [moveNode](Player.md#movenode)
- [off](Player.md#off)
- [on](Player.md#on)
- [once](Player.md#once)
- [pause](Player.md#pause)
- [play](Player.md#play)
- [prependListener](Player.md#prependlistener)
- [prependOnceListener](Player.md#prependoncelistener)
- [rawListeners](Player.md#rawlisteners)
- [removeAllListeners](Player.md#removealllisteners)
- [removeListener](Player.md#removelistener)
- [resolve](Player.md#resolve)
- [resolveTrack](Player.md#resolvetrack)
- [restart](Player.md#restart)
- [seekTo](Player.md#seekto)
- [send](Player.md#send)
- [set](Player.md#set)
- [setLoop](Player.md#setloop)
- [setMaxListeners](Player.md#setmaxlisteners)
- [setTextChannel](Player.md#settextchannel)
- [setVoiceChannel](Player.md#setvoicechannel)
- [setVolume](Player.md#setvolume)
- [stop](Player.md#stop)
- [addAbortListener](Player.md#addabortlistener)
- [getEventListeners](Player.md#geteventlisteners)
- [getMaxListeners](Player.md#getmaxlisteners-1)
- [listenerCount](Player.md#listenercount-1)
- [on](Player.md#on-1)
- [once](Player.md#once-1)
- [setMaxListeners](Player.md#setmaxlisteners-1)

## Constructors

### constructor

• **new Player**(`poru`, `node`, `options`): [`Player`](Player.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `poru` | [`Poru`](Poru.md) |
| `node` | [`Node`](Node.md) |
| `options` | [`ConnectionOptions`](../interfaces/ConnectionOptions.md) |

#### Returns

[`Player`](Player.md)

#### Overrides

EventEmitter.constructor

#### Defined in

src/Player/Player.ts:48

## Properties

### connection

• **connection**: [`Connection`](Connection.md)

#### Defined in

src/Player/Player.ts:27

___

### currentTrack

• **currentTrack**: [`Track`](Track.md)

#### Defined in

src/Player/Player.ts:33

___

### data

• `Readonly` **data**: `Record`\<`string`, `unknown`\>

#### Defined in

src/Player/Player.ts:24

___

### deaf

• **deaf**: `boolean`

#### Defined in

src/Player/Player.ts:45

___

### filters

• **filters**: [`Filters`](Filters.md)

#### Defined in

src/Player/Player.ts:29

___

### guildId

• **guildId**: `string`

#### Defined in

src/Player/Player.ts:30

___

### isAutoPlay

• **isAutoPlay**: `boolean`

#### Defined in

src/Player/Player.ts:38

___

### isConnected

• **isConnected**: `boolean`

#### Defined in

src/Player/Player.ts:37

___

### isPaused

• **isPaused**: `boolean`

#### Defined in

src/Player/Player.ts:36

___

### isPlaying

• **isPlaying**: `boolean`

#### Defined in

src/Player/Player.ts:35

___

### isQuietMode

• **isQuietMode**: `boolean`

#### Defined in

src/Player/Player.ts:39

___

### loop

• **loop**: `Loop`

#### Defined in

src/Player/Player.ts:40

___

### mute

• **mute**: `boolean`

#### Defined in

src/Player/Player.ts:44

___

### node

• **node**: [`Node`](Node.md)

#### Defined in

src/Player/Player.ts:26

___

### ping

• **ping**: `number`

#### Defined in

src/Player/Player.ts:42

___

### poru

• **poru**: [`Poru`](Poru.md)

#### Defined in

src/Player/Player.ts:25

___

### position

• **position**: `number`

#### Defined in

src/Player/Player.ts:41

___

### previousTrack

• **previousTrack**: [`Track`](Track.md)

#### Defined in

src/Player/Player.ts:34

___

### queue

• **queue**: `default`

#### Defined in

src/Player/Player.ts:28

___

### textChannel

• **textChannel**: `string`

#### Defined in

src/Player/Player.ts:32

___

### timestamp

• **timestamp**: `number`

#### Defined in

src/Player/Player.ts:43

___

### voiceChannel

• **voiceChannel**: `string`

#### Defined in

src/Player/Player.ts:31

___

### volume

• **volume**: `number`

#### Defined in

src/Player/Player.ts:46

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](Poru.md#capturerejectionsymbol)

Value: `Symbol.for('nodejs.rejection')`

See how to write a custom `rejection handler`.

**`Since`**

v13.4.0, v12.16.0

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:402

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Change the default `captureRejections` option on all new `EventEmitter` objects.

**`Since`**

v13.4.0, v12.16.0

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:409

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

By default, a maximum of `10` listeners can be registered for any single
event. This limit can be changed for individual `EventEmitter` instances
using the `emitter.setMaxListeners(n)` method. To change the default
for _all_`EventEmitter` instances, the `events.defaultMaxListeners`property can be used. If this value is not a positive number, a `RangeError`is thrown.

Take caution when setting the `events.defaultMaxListeners` because the
change affects _all_`EventEmitter` instances, including those created before
the change is made. However, calling `emitter.setMaxListeners(n)` still has
precedence over `events.defaultMaxListeners`.

This is not a hard limit. The `EventEmitter` instance will allow
more listeners to be added but will output a trace warning to stderr indicating
that a "possible EventEmitter memory leak" has been detected. For any single`EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()`methods can be used to
temporarily avoid this warning:

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

The `--trace-warnings` command-line flag can be used to display the
stack trace for such warnings.

The emitted warning can be inspected with `process.on('warning')` and will
have the additional `emitter`, `type`, and `count` properties, referring to
the event emitter instance, the event's name and the number of attached
listeners, respectively.
Its `name` property is set to `'MaxListenersExceededWarning'`.

**`Since`**

v0.11.2

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:446

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](Poru.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`events. Listeners installed using this symbol are called before the regular`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an`'error'` event is emitted. Therefore, the process will still crash if no
regular `'error'` listener is installed.

**`Since`**

v13.6.0, v12.17.0

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:395

## Methods

### [captureRejectionSymbol]

▸ **[captureRejectionSymbol]**(`error`, `event`, `...args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `event` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Inherited from

EventEmitter.[captureRejectionSymbol]

#### Defined in

node_modules/@types/node/events.d.ts:112

___

### addListener

▸ **addListener**(`eventName`, `listener`): `this`

Alias for `emitter.on(eventName, listener)`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

**`Since`**

v0.1.26

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:545

___

### autoMoveNode

▸ **autoMoveNode**(): `Promise`\<`void` \| [`Player`](Player.md)\>

This function will autmatically move the node to the leastUsed Node for the current player

#### Returns

`Promise`\<`void` \| [`Player`](Player.md)\>

Promise of Player or nothing if there was no node to move to or a error came up

#### Defined in

src/Player/Player.ts:409

___

### autoplay

▸ **autoplay**(): `Promise`\<[`Player`](Player.md)\>

This function will automatically add a track to the queue and play it

#### Returns

`Promise`\<[`Player`](Player.md)\>

The newly updated Player which is playing the song

#### Defined in

src/Player/Player.ts:426

___

### connect

▸ **connect**(`options?`): `void`

This function will make the bot connect to a voice channel.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`ConnectionOptions`](../interfaces/ConnectionOptions.md) | To connect to voice channel |

#### Returns

`void`

void

#### Defined in

src/Player/Player.ts:161

___

### destroy

▸ **destroy**(): `Promise`\<`boolean`\>

Destroys the player for this guild.

#### Returns

`Promise`\<`boolean`\>

Indicating if the player was successfully destroyed

#### Defined in

src/Player/Player.ts:353

___

### disconnect

▸ **disconnect**(): `Promise`\<[`Player`](Player.md)\>

This function will disconnect us from the channel

#### Returns

`Promise`\<[`Player`](Player.md)\>

Returns the newly updated Player

#### Defined in

src/Player/Player.ts:335

___

### emit

▸ **emit**(`eventName`, `...args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

**`Since`**

v0.1.26

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:807

___

### eventHandler

▸ **eventHandler**(`data`): `Promise`\<`boolean` \| `void` \| [`Player`](Player.md)\>

This function will handle all the events

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`EventData`](../modules.md#eventdata) | The data of the event |

#### Returns

`Promise`\<`boolean` \| `void` \| [`Player`](Player.md)\>

The Player object, a boolean or void

#### Defined in

src/Player/Player.ts:464

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

**`Since`**

v6.0.0

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:870

___

### get

▸ **get**\<`K`\>(`key`): `K`

This will retrieve the value via the key

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Key to get the value |

#### Returns

`K`

Returns the data that was obtained via the key

#### Defined in

src/Player/Player.ts:327

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](Player.md#defaultmaxlisteners).

#### Returns

`number`

**`Since`**

v1.0.0

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:722

___

### listenerCount

▸ **listenerCount**(`eventName`, `listener?`): `number`

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener?` | `Function` | The event handler function |

#### Returns

`number`

**`Since`**

v3.2.0

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:816

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v0.1.26

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:735

___

### moveNode

▸ **moveNode**(`name`): `Promise`\<[`Player`](Player.md)\>

This function will move the node from the current player

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the node to move to |

#### Returns

`Promise`\<[`Player`](Player.md)\>

#### Defined in

src/Player/Player.ts:386

___

### off

▸ **off**(`eventName`, `listener`): `this`

Alias for `emitter.removeListener()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

**`Since`**

v10.0.0

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:695

___

### on

▸ **on**(`eventName`, `listener`): `this`

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

`this`

**`Since`**

v0.1.101

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:577

___

### once

▸ **once**(`eventName`, `listener`): `this`

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

`this`

**`Since`**

v0.3.0

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:607

___

### pause

▸ **pause**(`toggle?`): `Promise`\<[`Player`](Player.md)\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `toggle` | `boolean` | `true` | Boolean to pause or resume the player \|\| Default = true |

#### Returns

`Promise`\<[`Player`](Player.md)\>

To pause or resume the player

#### Defined in

src/Player/Player.ts:199

___

### play

▸ **play**(): `Promise`\<[`Player`](Player.md)\>

Play a track

#### Returns

`Promise`\<[`Player`](Player.md)\>

The newly updated player whose playing the song

#### Defined in

src/Player/Player.ts:88

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): `this`

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

`this`

**`Since`**

v6.0.0

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:834

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): `this`

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

`this`

**`Since`**

v6.0.0

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/events.d.ts:850

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v9.4.0

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:766

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): `this`

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

`this`

**`Since`**

v0.1.26

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:706

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): `this`

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and _before_ the last listener finishes execution
will not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

**`Since`**

v0.1.26

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:690

___

### resolve

▸ **resolve**(`param0`): `Promise`\<[`Response`](Response.md)\>

This function will get the track by it's name or identifier or url and will return the track data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param0` | [`ResolveOptions`](../interfaces/ResolveOptions.md) | The parameters to resolve the track |

#### Returns

`Promise`\<[`Response`](Response.md)\>

The response of the track data which was searched for

#### Defined in

src/Player/Player.ts:535

___

### resolveTrack

▸ **resolveTrack**(`track`): `Promise`\<[`Track`](Track.md)\>

Resolve a track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `track` | [`Track`](Track.md) | Only for personal use |

#### Returns

`Promise`\<[`Track`](Track.md)\>

Returns a Track

#### Defined in

src/Player/Player.ts:116

___

### restart

▸ **restart**(): `Promise`\<[`Player`](Player.md)\>

This function will restart the player and play the current track

#### Returns

`Promise`\<[`Player`](Player.md)\>

Returns a Player object

#### Defined in

src/Player/Player.ts:365

___

### seekTo

▸ **seekTo**(`position`): `Promise`\<`void`\>

This function will seek to the specified position

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | `number` | Number to seek to the position |

#### Returns

`Promise`\<`void`\>

void

#### Defined in

src/Player/Player.ts:215

___

### send

▸ **send**(`data`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | The data to send to the voice server from discord |

#### Returns

`void`

void

#### Defined in

src/Player/Player.ts:557

___

### set

▸ **set**\<`K`\>(`key`, `value`): `K`

This will set a value to a key

#### Type parameters

| Name |
| :------ |
| `K` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Key to set the value |
| `value` | `K` | Value to set the key |

#### Returns

`K`

To set the key and value

#### Defined in

src/Player/Player.ts:318

___

### setLoop

▸ **setLoop**(`mode`): [`Player`](Player.md)

This function will activate the loop mode. These are the options `NONE, TRACK, QUEUE`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | `Loop` | Loop mode |

#### Returns

[`Player`](Player.md)

Returns the newly updated Player

#### Defined in

src/Player/Player.ts:239

___

### setMaxListeners

▸ **setMaxListeners**(`n`): `this`

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`this`

**`Since`**

v0.3.5

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:716

___

### setTextChannel

▸ **setTextChannel**(`channel`): [`Player`](Player.md)

This function will set the text channel in the player

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `channel` | `string` | String to set the text channel |

#### Returns

[`Player`](Player.md)

Returns the newly updated Player

#### Defined in

src/Player/Player.ts:276

___

### setVoiceChannel

▸ **setVoiceChannel**(`channel`, `options?`): [`Player`](Player.md)

This function will set the voice channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `channel` | `string` | String to set the voice channel |
| `options?` | `Required`\<`Omit`\<[`ConnectionOptions`](../interfaces/ConnectionOptions.md), ``"guildId"`` \| ``"voiceChannel"`` \| ``"region"`` \| ``"textChannel"``\>\> | Options `mute` and `deaf` |

#### Returns

[`Player`](Player.md)

Returns the newly updated Player

#### Defined in

src/Player/Player.ts:287

___

### setVolume

▸ **setVolume**(`volume`): `Promise`\<[`Player`](Player.md)\>

This function will set the volume to a specified number between 0 and 1000

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `volume` | `number` | Number to set the volume |

#### Returns

`Promise`\<[`Player`](Player.md)\>

The newly updated Player

#### Defined in

src/Player/Player.ts:226

___

### stop

▸ **stop**(): `Promise`\<[`Player`](Player.md)\>

This function will stop the current song

#### Returns

`Promise`\<[`Player`](Player.md)\>

Returns the player after stopping the song

You can use this function to also skip the current song

#### Defined in

src/Player/Player.ts:183

___

### addAbortListener

▸ **addAbortListener**(`signal`, `resource`): `Disposable`

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call `e.stopImmediatePropagation()`. Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```js
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `signal` | `AbortSignal` |
| `resource` | (`event`: `Event`) => `void` |

#### Returns

`Disposable`

Disposable that removes the `abort` listener.

**`Since`**

v20.5.0

#### Inherited from

EventEmitter.addAbortListener

#### Defined in

node_modules/@types/node/events.d.ts:387

___

### getEventListeners

▸ **getEventListeners**(`emitter`, `name`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` \| `_DOMEventTarget` |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

**`Since`**

v15.2.0, v14.17.0

#### Inherited from

EventEmitter.getEventListeners

#### Defined in

node_modules/@types/node/events.d.ts:308

___

### getMaxListeners

▸ **getMaxListeners**(`emitter`): `number`

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```js
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` \| `_DOMEventTarget` |

#### Returns

`number`

**`Since`**

v19.9.0

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:337

___

### listenerCount

▸ **listenerCount**(`emitter`, `eventName`): `number`

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

**`Since`**

v0.9.12

**`Deprecated`**

Since v3.2.0 - Use `listenerCount` instead.

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:280

___

### on

▸ **on**(`emitter`, `eventName`, `options?`): `AsyncIterableIterator`\<`any`\>

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | - |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | `StaticEventEmitterOptions` | - |

#### Returns

`AsyncIterableIterator`\<`any`\>

that iterates `eventName` events emitted by the `emitter`

**`Since`**

v13.6.0, v12.16.0

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:258

___

### once

▸ **once**(`emitter`, `eventName`, `options?`): `Promise`\<`any`[]\>

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `_NodeEventTarget` |
| `eventName` | `string` \| `symbol` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`\<`any`[]\>

**`Since`**

v11.13.0, v10.16.0

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:193

▸ **once**(`emitter`, `eventName`, `options?`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `_DOMEventTarget` |
| `eventName` | `string` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:198

___

### setMaxListeners

▸ **setMaxListeners**(`n?`, `...eventTargets`): `void`

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `n?` | `number` | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| `...eventTargets` | (`EventEmitter` \| `_DOMEventTarget`)[] | - |

#### Returns

`void`

**`Since`**

v15.4.0

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:352
