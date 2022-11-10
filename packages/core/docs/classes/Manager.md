[@mythor/core](../README.md) / [Exports](../modules.md) / Manager

# Class: Manager

## Hierarchy

- **`Manager`**

  ↳ [`LoadingStateManager`](LoadingStateManager.md)

## Table of contents

### Constructors

- [constructor](Manager.md#constructor)

### Properties

- [\_name](Manager.md#_name)
- [ecs](Manager.md#ecs)

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

#### Defined in

[ecs/Manager.ts:7](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L7)

## Properties

### \_name

• `Private` `Readonly` **\_name**: `string`

#### Defined in

[ecs/Manager.ts:4](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L4)

___

### ecs

• `Protected` `Readonly` **ecs**: [`Ecs`](Ecs.md)

#### Defined in

[ecs/Manager.ts:5](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L5)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

[ecs/Manager.ts:11](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L11)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[ecs/Manager.ts:33](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L33)

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

[ecs/Manager.ts:16](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L16)

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

[ecs/Manager.ts:20](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L20)

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

[ecs/Manager.ts:23](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/core/src/ecs/Manager.ts#L23)
