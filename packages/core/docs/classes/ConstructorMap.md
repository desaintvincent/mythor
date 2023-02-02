[@mythor/core](../README.md) / [Exports](../modules.md) / ConstructorMap

# Class: ConstructorMap<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Constructors

- [constructor](ConstructorMap.md#constructor)

### Properties

- [\_map](ConstructorMap.md#_map)

### Accessors

- [size](ConstructorMap.md#size)

### Methods

- [clear](ConstructorMap.md#clear)
- [delete](ConstructorMap.md#delete)
- [forEach](ConstructorMap.md#foreach)
- [forEachAsync](ConstructorMap.md#foreachasync)
- [get](ConstructorMap.md#get)
- [has](ConstructorMap.md#has)
- [map](ConstructorMap.md#map)
- [set](ConstructorMap.md#set)

## Constructors

### constructor

• **new ConstructorMap**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[collections/ConstructorMap.ts:5](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L5)

## Properties

### \_map

• `Private` `Readonly` **\_map**: `Map`<[`Constructor`](../modules.md#constructor)<`T`\>, `T`\>

#### Defined in

[collections/ConstructorMap.ts:4](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L4)

## Accessors

### size

• `get` **size**(): `number`

#### Returns

`number`

#### Defined in

[collections/ConstructorMap.ts:61](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L61)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[collections/ConstructorMap.ts:9](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L9)

___

### delete

▸ **delete**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Constructor`](../modules.md#constructor)<`T`\> |

#### Returns

`boolean`

#### Defined in

[collections/ConstructorMap.ts:13](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L13)

___

### forEach

▸ **forEach**(`callbackfn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`value`: `T`, `key`: [`Constructor`](../modules.md#constructor)<`T`\>, `map`: `Map`<[`Constructor`](../modules.md#constructor)<`T`\>, `T`\>) => `void` |

#### Returns

`void`

#### Defined in

[collections/ConstructorMap.ts:23](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L23)

___

### forEachAsync

▸ **forEachAsync**(`callbackfn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`value`: `T`, `key`: [`Constructor`](../modules.md#constructor)<`T`\>, `map`: `Map`<[`Constructor`](../modules.md#constructor)<`T`\>, `T`\>) => `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[collections/ConstructorMap.ts:33](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L33)

___

### get

▸ **get**<`U`\>(`constructor`): `U`

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](../modules.md#constructor)<`U`\> |

#### Returns

`U`

#### Defined in

[collections/ConstructorMap.ts:47](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L47)

___

### has

▸ **has**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Constructor`](../modules.md#constructor)<`T`\> |

#### Returns

`boolean`

#### Defined in

[collections/ConstructorMap.ts:51](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L51)

___

### map

▸ **map**<`U`\>(`callbackfn`): `U`[]

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`value`: `T`, `index`: `number`) => `U` |

#### Returns

`U`[]

#### Defined in

[collections/ConstructorMap.ts:17](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L17)

___

### set

▸ **set**(`value`): [`ConstructorMap`](ConstructorMap.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

[`ConstructorMap`](ConstructorMap.md)<`T`\>

#### Defined in

[collections/ConstructorMap.ts:55](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/ConstructorMap.ts#L55)
