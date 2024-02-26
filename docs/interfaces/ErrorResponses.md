[poru](../README.md) / [Exports](../modules.md) / ErrorResponses

# Interface: ErrorResponses

This interface represents the LavaLink V4 Error Responses

**`Reference`**

https://lavalink.dev/api/rest.html#error-responses

## Table of contents

### Properties

- [error](ErrorResponses.md#error)
- [message](ErrorResponses.md#message)
- [path](ErrorResponses.md#path)
- [status](ErrorResponses.md#status)
- [timestamp](ErrorResponses.md#timestamp)
- [trace](ErrorResponses.md#trace)

## Properties

### error

• **error**: `string`

The HTTP status code message

#### Defined in

src/Node/Node.ts:46

___

### message

• **message**: `string`

The error message

#### Defined in

src/Node/Node.ts:57

___

### path

• **path**: `string`

The path of the request

#### Defined in

src/Node/Node.ts:62

___

### status

• **status**: `number`

The HTTP status code

#### Defined in

src/Node/Node.ts:41

___

### timestamp

• **timestamp**: `number`

The timestamp of the error in milliseconds since the Unix epoch

#### Defined in

src/Node/Node.ts:36

___

### trace

• `Optional` **trace**: `string`

The stack trace of the error when trace=true as query param has been sent

**`Optional`**

#### Defined in

src/Node/Node.ts:52
