[@mythor/core](../README.md) / [Exports](../modules.md) / Manager

# Class: Manager

## Hierarchy

- [`Signable`](Signable.md)

  ↳ **`Manager`**

  ↳↳ [`LoadingStateManager`](LoadingStateManager.md)

## Table of contents

### Constructors

- [constructor](Manager.md#constructor)

### Properties

- [\_name](Manager.md#_name)
- [ecs](Manager.md#ecs)
- [signature](Manager.md#signature)

### Accessors

- [name](Manager.md#name)

### Methods

- [clear](Manager.md#clear)
- [init](Manager.md#init)
- [postUpdate](Manager.md#postupdate)
- [update](Manager.md#update)

## Constructors

### constructor

• **new Manager**(`name`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Overrides

[Signable](Signable.md).[constructor](Signable.md#constructor)

#### Defined in

[ecs/Manager.ts:8](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L8)

## Properties

### \_name

• `Private` `Readonly` **\_name**: `string`

#### Defined in

[ecs/Manager.ts:5](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L5)

___

### ecs

• `Protected` `Readonly` **ecs**: [`Ecs`](Ecs.md)

#### Defined in

[ecs/Manager.ts:6](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L6)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

[Signable](Signable.md).[signature](Signable.md#signature)

#### Defined in

[collections/Signable.ts:2](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/collections/Signable.ts#L2)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[ecs/Manager.ts:13](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L13)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[ecs/Manager.ts:35](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L35)

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

[ecs/Manager.ts:18](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L18)

___

### postUpdate

▸ **postUpdate**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |

#### Returns

`void`

#### Defined in

[ecs/Manager.ts:22](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L22)

___

### update

▸ **update**(`ecs`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[ecs/Manager.ts:25](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/core/src/ecs/Manager.ts#L25)
