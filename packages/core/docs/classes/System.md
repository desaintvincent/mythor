[@mythor/core](../README.md) / [Exports](../modules.md) / System

# Class: System

## Hierarchy

- [`Signable`](Signable.md)

  ↳ **`System`**

## Table of contents

### Constructors

- [constructor](System.md#constructor)

### Properties

- [\_disabled](System.md#_disabled)
- [\_duration](System.md#_duration)
- [\_name](System.md#_name)
- [components](System.md#components)
- [dependencies](System.md#dependencies)
- [ecs](System.md#ecs)
- [entities](System.md#entities)
- [signature](System.md#signature)

### Accessors

- [duration](System.md#duration)
- [name](System.md#name)

### Methods

- [checkDependencies](System.md#checkdependencies)
- [clear](System.md#clear)
- [disabled](System.md#disabled)
- [getEntities](System.md#getentities)
- [init](System.md#init)
- [onEntityCreation](System.md#onentitycreation)
- [onEntityDestruction](System.md#onentitydestruction)
- [onEntityUpdate](System.md#onentityupdate)
- [onSystemInit](System.md#onsysteminit)
- [setDuration](System.md#setduration)
- [shouldBeAdded](System.md#shouldbeadded)
- [update](System.md#update)

## Constructors

### constructor

• `Protected` **new System**(`name`, `components`, `dependencies?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `components` | [`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\>[] |
| `dependencies?` | `Partial`<`SystemDependencies`\> |

#### Overrides

[Signable](Signable.md).[constructor](Signable.md#constructor)

#### Defined in

[ecs/System.ts:23](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L23)

## Properties

### \_disabled

• `Private` **\_disabled**: `boolean` = `false`

#### Defined in

[ecs/System.ts:17](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L17)

___

### \_duration

• **\_duration**: `number`

#### Defined in

[ecs/System.ts:18](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L18)

___

### \_name

• `Private` `Readonly` **\_name**: `string`

#### Defined in

[ecs/System.ts:16](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L16)

___

### components

• `Protected` `Readonly` **components**: [`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\>[]

#### Defined in

[ecs/System.ts:20](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L20)

___

### dependencies

• `Protected` `Readonly` **dependencies**: `SystemDependencies`

#### Defined in

[ecs/System.ts:21](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L21)

___

### ecs

• **ecs**: [`Ecs`](Ecs.md)

#### Defined in

[ecs/System.ts:15](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L15)

___

### entities

• `Protected` **entities**: [`IList`](../interfaces/IList.md)<[`Entity`](Entity.md)\>

#### Defined in

[ecs/System.ts:19](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L19)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

[Signable](Signable.md).[signature](Signable.md#signature)

#### Defined in

[collections/Signable.ts:2](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/collections/Signable.ts#L2)

## Accessors

### duration

• `get` **duration**(): `number`

#### Returns

`number`

#### Defined in

[ecs/System.ts:55](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L55)

___

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[ecs/System.ts:47](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L47)

## Methods

### checkDependencies

▸ `Private` **checkDependencies**(): `void`

#### Returns

`void`

#### Defined in

[ecs/System.ts:99](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L99)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[ecs/System.ts:95](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L95)

___

### disabled

▸ **disabled**(`value?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[ecs/System.ts:39](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L39)

___

### getEntities

▸ **getEntities**(): [`IList`](../interfaces/IList.md)<[`Entity`](Entity.md)\>

#### Returns

[`IList`](../interfaces/IList.md)<[`Entity`](Entity.md)\>

#### Defined in

[ecs/System.ts:82](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L82)

___

### init

▸ **init**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[ecs/System.ts:59](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L59)

___

### onEntityCreation

▸ `Protected` **onEntityCreation**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Defined in

[ecs/System.ts:131](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L131)

___

### onEntityDestruction

▸ `Protected` **onEntityDestruction**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Defined in

[ecs/System.ts:127](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L127)

___

### onEntityUpdate

▸ `Protected` **onEntityUpdate**(`entity`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[ecs/System.ts:112](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L112)

___

### onSystemInit

▸ `Protected` **onSystemInit**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[ecs/System.ts:123](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L123)

___

### setDuration

▸ **setDuration**(`n`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`void`

#### Defined in

[ecs/System.ts:51](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L51)

___

### shouldBeAdded

▸ `Protected` **shouldBeAdded**(`entity`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`boolean`

#### Defined in

[ecs/System.ts:135](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L135)

___

### update

▸ **update**(`elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[ecs/System.ts:86](https://github.com/desaintvincent/mythor/blob/c881de0/packages/core/src/ecs/System.ts#L86)
