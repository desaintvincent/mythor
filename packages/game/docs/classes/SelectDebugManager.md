[@mythor/game](../README.md) / [Exports](../modules.md) / SelectDebugManager

# Class: SelectDebugManager

## Hierarchy

- `Manager`

  ↳ **`SelectDebugManager`**

## Table of contents

### Constructors

- [constructor](SelectDebugManager.md#constructor)

### Properties

- [ecs](SelectDebugManager.md#ecs)
- [selectedEntity](SelectDebugManager.md#selectedentity)
- [show](SelectDebugManager.md#show)

### Accessors

- [name](SelectDebugManager.md#name)

### Methods

- [clear](SelectDebugManager.md#clear)
- [init](SelectDebugManager.md#init)
- [offsetCamera](SelectDebugManager.md#offsetcamera)
- [postUpdate](SelectDebugManager.md#postupdate)
- [render](SelectDebugManager.md#render)
- [update](SelectDebugManager.md#update)

## Constructors

### constructor

• **new SelectDebugManager**()

#### Overrides

Manager.constructor

#### Defined in

[game/src/managers/SelectDebugManager.ts:12](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/SelectDebugManager.ts#L12)

## Properties

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:4

___

### selectedEntity

• `Private` **selectedEntity**: `default`

#### Defined in

[game/src/managers/SelectDebugManager.ts:10](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/SelectDebugManager.ts#L10)

___

### show

• `Private` **show**: `boolean` = `false`

#### Defined in

[game/src/managers/SelectDebugManager.ts:9](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/SelectDebugManager.ts#L9)

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

### offsetCamera

▸ `Private` **offsetCamera**(`vec`): `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vec` | `default` |

#### Returns

`default`

#### Defined in

[game/src/managers/SelectDebugManager.ts:59](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/SelectDebugManager.ts#L59)

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

### render

▸ `Private` **render**(): `void`

#### Returns

`void`

#### Defined in

[game/src/managers/SelectDebugManager.ts:70](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/SelectDebugManager.ts#L70)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Overrides

Manager.update

#### Defined in

[game/src/managers/SelectDebugManager.ts:16](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/SelectDebugManager.ts#L16)
