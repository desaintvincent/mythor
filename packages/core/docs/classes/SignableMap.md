[@mythor/core](../README.md) / [Exports](../modules.md) / SignableMap

# Class: SignableMap<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Signable`](Signable.md) |

## Table of contents

### Constructors

- [constructor](SignableMap.md#constructor)

### Properties

- [\_map](SignableMap.md#_map)
- [name](SignableMap.md#name)
- [registry](SignableMap.md#registry)
- [constructorRegistries](SignableMap.md#constructorregistries)

### Accessors

- [size](SignableMap.md#size)

### Methods

- [clear](SignableMap.md#clear)
- [delete](SignableMap.md#delete)
- [forEach](SignableMap.md#foreach)
- [forEachAsync](SignableMap.md#foreachasync)
- [get](SignableMap.md#get)
- [has](SignableMap.md#has)
- [map](SignableMap.md#map)
- [set](SignableMap.md#set)

## Constructors

### constructor

• **new SignableMap**<`T`\>(`name`, `color`, `logger?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Signable`](Signable.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `color` | `string` |
| `logger?` | [`Logger`](../modules.md#logger) |

#### Defined in

[collections/SignableMap.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L18)

## Properties

### \_map

• `Private` `Readonly` **\_map**: `Map`<`number`, `T`\>

#### Defined in

[collections/SignableMap.ts:11](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L11)

___

### name

• `Private` **name**: `string`

#### Defined in

[collections/SignableMap.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L17)

___

### registry

• `Private` `Readonly` **registry**: `ConstructorRegistry`<[`Signable`](Signable.md)\>

#### Defined in

[collections/SignableMap.ts:12](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L12)

___

### constructorRegistries

▪ `Static` `Private` **constructorRegistries**: `Map`<`string`, `ConstructorRegistry`<[`Signable`](Signable.md)\>\>

#### Defined in

[collections/SignableMap.ts:13](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L13)

## Accessors

### size

• `get` **size**(): `number`

#### Returns

`number`

#### Defined in

[collections/SignableMap.ts:81](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L81)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[collections/SignableMap.ts:29](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L29)

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

[collections/SignableMap.ts:33](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L33)

___

### forEach

▸ **forEach**(`callbackfn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`value`: `T`, `key`: `number`, `map`: `Map`<`number`, `T`\>) => `void` |

#### Returns

`void`

#### Defined in

[collections/SignableMap.ts:43](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L43)

___

### forEachAsync

▸ **forEachAsync**(`callbackfn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`value`: `T`, `key`: `number`, `map`: `Map`<`number`, `T`\>) => `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[collections/SignableMap.ts:49](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L49)

___

### get

▸ **get**<`U`\>(`constructor`): `U`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`Signable`](Signable.md)<`U`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](../modules.md#constructor)<`U`\> |

#### Returns

`U`

#### Defined in

[collections/SignableMap.ts:59](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L59)

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

[collections/SignableMap.ts:63](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L63)

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

[collections/SignableMap.ts:37](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L37)

___

### set

▸ **set**(`value`): [`SignableMap`](SignableMap.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

[`SignableMap`](SignableMap.md)<`T`\>

#### Defined in

[collections/SignableMap.ts:71](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/SignableMap.ts#L71)
