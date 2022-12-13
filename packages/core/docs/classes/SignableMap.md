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

• **new SignableMap**<`T`\>(`name`, `color`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Signable`](Signable.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `color` | `string` |

#### Defined in

[collections/SignableMap.ts:16](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L16)

## Properties

### \_map

• `Private` `Readonly` **\_map**: `Map`<`number`, `T`\>

#### Defined in

[collections/SignableMap.ts:10](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L10)

___

### name

• `Private` **name**: `string`

#### Defined in

[collections/SignableMap.ts:15](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L15)

___

### constructorRegistries

▪ `Static` `Private` **constructorRegistries**: `Map`<`string`, `ConstructorRegistry`<[`Signable`](Signable.md)\>\>

#### Defined in

[collections/SignableMap.ts:11](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L11)

## Accessors

### size

• `get` **size**(): `number`

#### Returns

`number`

#### Defined in

[collections/SignableMap.ts:81](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L81)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[collections/SignableMap.ts:27](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L27)

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

[collections/SignableMap.ts:31](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L31)

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

[collections/SignableMap.ts:41](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L41)

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

[collections/SignableMap.ts:47](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L47)

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

[collections/SignableMap.ts:57](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L57)

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

[collections/SignableMap.ts:61](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L61)

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

[collections/SignableMap.ts:35](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L35)

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

[collections/SignableMap.ts:69](https://github.com/desaintvincent/mythor/blob/f93928f/packages/core/src/collections/SignableMap.ts#L69)
