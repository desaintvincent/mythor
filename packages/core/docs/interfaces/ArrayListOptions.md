[@mythor/core](../README.md) / [Exports](../modules.md) / ArrayListOptions

# Interface: ArrayListOptions<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [constructors](ArrayListOptions.md#constructors)
- [onCreate](ArrayListOptions.md#oncreate)
- [onDelete](ArrayListOptions.md#ondelete)
- [shouldBeAdded](ArrayListOptions.md#shouldbeadded)

## Properties

### constructors

• **constructors**: [`Constructor`](../modules.md#constructor)<[`Component`](../classes/Component.md)\>[]

#### Defined in

[lists/List.ts:5](https://github.com/desaintvincent/mythor/blob/d8ac596/packages/core/src/lists/List.ts#L5)

___

### onCreate

• `Optional` **onCreate**: (`item`: `T`) => `void`

#### Type declaration

▸ (`item`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`void`

#### Defined in

[lists/List.ts:6](https://github.com/desaintvincent/mythor/blob/d8ac596/packages/core/src/lists/List.ts#L6)

___

### onDelete

• `Optional` **onDelete**: (`item`: `T`) => `void`

#### Type declaration

▸ (`item`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`void`

#### Defined in

[lists/List.ts:7](https://github.com/desaintvincent/mythor/blob/d8ac596/packages/core/src/lists/List.ts#L7)

___

### shouldBeAdded

• `Optional` **shouldBeAdded**: (`item`: `T`) => `boolean`

#### Type declaration

▸ (`item`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`boolean`

#### Defined in

[lists/List.ts:8](https://github.com/desaintvincent/mythor/blob/d8ac596/packages/core/src/lists/List.ts#L8)
