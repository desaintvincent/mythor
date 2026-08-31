[@mythor/persistence](../README.md) / [Exports](../modules.md) / Serializable

# Interface: Serializable<T\>

Marker interface components opt into to be included when `SaveManager`
saves an entity's state. Components that do not implement this interface
are silently skipped (e.g. transient/derived state such as GPU handles).

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

## Table of contents

### Methods

- [serialize](Serializable.md#serialize)

## Methods

### serialize

▸ **serialize**(): `T`

#### Returns

`T`

#### Defined in

[persistence/src/Serializable.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/Serializable.ts#L7)
