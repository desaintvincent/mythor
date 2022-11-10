[@mythor/game](../README.md) / [Exports](../modules.md) / PhysicDebugManager

# Class: PhysicDebugManager

## Hierarchy

- `Manager`

  ↳ **`PhysicDebugManager`**

## Table of contents

### Constructors

- [constructor](PhysicDebugManager.md#constructor)

### Properties

- [ecs](PhysicDebugManager.md#ecs)
- [fill](PhysicDebugManager.md#fill)
- [show](PhysicDebugManager.md#show)

### Accessors

- [name](PhysicDebugManager.md#name)

### Methods

- [clear](PhysicDebugManager.md#clear)
- [init](PhysicDebugManager.md#init)
- [postUpdate](PhysicDebugManager.md#postupdate)
- [render](PhysicDebugManager.md#render)
- [renderCircle](PhysicDebugManager.md#rendercircle)
- [update](PhysicDebugManager.md#update)

## Constructors

### constructor

• **new PhysicDebugManager**()

#### Overrides

Manager.constructor

#### Defined in

[game/src/managers/PhysicDebugManager.ts:14](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/PhysicDebugManager.ts#L14)

## Properties

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:4

___

### fill

• `Private` **fill**: `boolean` = `false`

#### Defined in

[game/src/managers/PhysicDebugManager.ts:12](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/PhysicDebugManager.ts#L12)

___

### show

• `Private` **show**: `boolean` = `false`

#### Defined in

[game/src/managers/PhysicDebugManager.ts:11](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/PhysicDebugManager.ts#L11)

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

### render

▸ `Private` **render**(): `void`

#### Returns

`void`

#### Defined in

[game/src/managers/PhysicDebugManager.ts:42](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/PhysicDebugManager.ts#L42)

___

### renderCircle

▸ `Private` **renderCircle**(`renderer`, `body`, `shape`, `worldScale`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |
| `body` | `Body` |
| `shape` | `CircleShape` |
| `worldScale` | `number` |

#### Returns

`void`

#### Defined in

[game/src/managers/PhysicDebugManager.ts:73](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/PhysicDebugManager.ts#L73)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Overrides

Manager.update

#### Defined in

[game/src/managers/PhysicDebugManager.ts:18](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/PhysicDebugManager.ts#L18)
