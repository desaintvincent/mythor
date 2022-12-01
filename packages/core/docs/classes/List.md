[@mythor/core](../README.md) / [Exports](../modules.md) / List

# Class: List<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

## Table of contents

### Constructors

- [constructor](List.md#constructor)

### Properties

- [\_contructors](List.md#_contructors)
- [\_signature](List.md#_signature)
- [onCreate](List.md#oncreate)
- [onDelete](List.md#ondelete)
- [shouldBeAdded](List.md#shouldbeadded)

### Accessors

- [constructors](List.md#constructors)
- [signature](List.md#signature)

### Methods

- [\_\_add](List.md#__add)
- [\_\_remove](List.md#__remove)
- [add](List.md#add)
- [remove](List.md#remove)

## Constructors

### constructor

• **new List**<`T`\>(`signature`, `options`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `signature` | `number` |
| `options` | [`ArrayListOptions`](../interfaces/ArrayListOptions.md)<`T`\> |

#### Defined in

[lists/List.ts:19](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L19)

## Properties

### \_contructors

• `Private` `Readonly` **\_contructors**: [`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\>[] = `[]`

#### Defined in

[lists/List.ts:13](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L13)

___

### \_signature

• `Readonly` **\_signature**: `number`

#### Defined in

[lists/List.ts:12](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L12)

___

### onCreate

• `Private` `Optional` `Readonly` **onCreate**: (`item`: `T`) => `void`

#### Type declaration

▸ (`item`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`void`

#### Defined in

[lists/List.ts:15](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L15)

___

### onDelete

• `Private` `Optional` `Readonly` **onDelete**: (`item`: `T`) => `void`

#### Type declaration

▸ (`item`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`void`

#### Defined in

[lists/List.ts:16](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L16)

___

### shouldBeAdded

• `Private` `Readonly` **shouldBeAdded**: (`item`: `T`) => `boolean`

#### Type declaration

▸ (`item`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`boolean`

#### Defined in

[lists/List.ts:17](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L17)

## Accessors

### constructors

• `get` **constructors**(): [`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\>[]

#### Returns

[`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\>[]

#### Defined in

[lists/List.ts:27](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L27)

___

### signature

• `get` **signature**(): `number`

#### Returns

`number`

#### Defined in

[lists/List.ts:31](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L31)

## Methods

### \_\_add

▸ `Protected` **__add**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `T` |

#### Returns

`void`

#### Defined in

[lists/List.ts:49](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L49)

___

### \_\_remove

▸ `Protected` **__remove**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `T` |

#### Returns

`void`

#### Defined in

[lists/List.ts:54](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L54)

___

### add

▸ **add**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `T` |

#### Returns

`void`

#### Defined in

[lists/List.ts:35](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L35)

___

### remove

▸ **remove**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `T` |

#### Returns

`void`

#### Defined in

[lists/List.ts:43](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/lists/List.ts#L43)
