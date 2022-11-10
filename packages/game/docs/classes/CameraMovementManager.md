[@mythor/game](../README.md) / [Exports](../modules.md) / CameraMovementManager

# Class: CameraMovementManager

## Hierarchy

- `Manager`

  ↳ **`CameraMovementManager`**

## Table of contents

### Constructors

- [constructor](CameraMovementManager.md#constructor)

### Properties

- [debugKey](CameraMovementManager.md#debugkey)
- [ecs](CameraMovementManager.md#ecs)
- [entityToFollow](CameraMovementManager.md#entitytofollow)

### Accessors

- [name](CameraMovementManager.md#name)

### Methods

- [clear](CameraMovementManager.md#clear)
- [init](CameraMovementManager.md#init)
- [postUpdate](CameraMovementManager.md#postupdate)
- [update](CameraMovementManager.md#update)

## Constructors

### constructor

• **new CameraMovementManager**()

#### Overrides

Manager.constructor

#### Defined in

[game/src/managers/CameraMovementManager.ts:10](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/CameraMovementManager.ts#L10)

## Properties

### debugKey

• `Private` `Readonly` **debugKey**: `Key` = `Key.Control`

#### Defined in

[game/src/managers/CameraMovementManager.ts:7](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/CameraMovementManager.ts#L7)

___

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:4

___

### entityToFollow

• `Private` `Optional` **entityToFollow**: `default`

#### Defined in

[game/src/managers/CameraMovementManager.ts:8](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/CameraMovementManager.ts#L8)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

core/lib/ecs/Manager.d.ts:6

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Manager.clear

#### Defined in

core/lib/ecs/Manager.d.ts:10

___

### init

▸ **init**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Manager.init

#### Defined in

core/lib/ecs/Manager.d.ts:7

___

### postUpdate

▸ **postUpdate**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`void`

#### Inherited from

Manager.postUpdate

#### Defined in

core/lib/ecs/Manager.d.ts:8

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Overrides

Manager.update

#### Defined in

[game/src/managers/CameraMovementManager.ts:14](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/CameraMovementManager.ts#L14)
