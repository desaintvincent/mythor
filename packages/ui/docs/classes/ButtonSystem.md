[@mythor/ui](../README.md) / [Exports](../modules.md) / ButtonSystem

# Class: ButtonSystem

Hit-tests every entity carrying a `Transform` + `Button` against the
mouse, using the center-based `contains()` helper from `@mythor/math`
with a zero-size point rect. Mirrors the press/release edge-detection
pattern already used inside `EventsManager` itself.

Buttons created with `screenSpace: true` (the default via `createButton`)
are hit-tested against the raw, un-converted mouse position, matching how
the renderer draws them fixed to the screen regardless of the world
camera (see `Renderable.screenSpace`).

## Hierarchy

- `System`

  ↳ **`ButtonSystem`**

## Table of contents

### Constructors

- [constructor](ButtonSystem.md#constructor)

### Properties

- [\_duration](ButtonSystem.md#_duration)
- [components](ButtonSystem.md#components)
- [dependencies](ButtonSystem.md#dependencies)
- [ecs](ButtonSystem.md#ecs)
- [entities](ButtonSystem.md#entities)
- [signature](ButtonSystem.md#signature)

### Accessors

- [duration](ButtonSystem.md#duration)
- [name](ButtonSystem.md#name)

### Methods

- [clear](ButtonSystem.md#clear)
- [disabled](ButtonSystem.md#disabled)
- [getEntities](ButtonSystem.md#getentities)
- [init](ButtonSystem.md#init)
- [onEntityCreation](ButtonSystem.md#onentitycreation)
- [onEntityDestruction](ButtonSystem.md#onentitydestruction)
- [onEntityUpdate](ButtonSystem.md#onentityupdate)
- [onSystemInit](ButtonSystem.md#onsysteminit)
- [setDuration](ButtonSystem.md#setduration)
- [shouldBeAdded](ButtonSystem.md#shouldbeadded)
- [update](ButtonSystem.md#update)

## Constructors

### constructor

• **new ButtonSystem**()

#### Overrides

System.constructor

#### Defined in

[ui/src/systems/ButtonSystem.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/systems/ButtonSystem.ts#L19)

## Properties

### \_duration

• **\_duration**: `number`

#### Inherited from

System.\_duration

#### Defined in

core/lib/ecs/System.d.ts:16

___

### components

• `Protected` `Readonly` **components**: `Constructor`<`Component`\>[]

#### Inherited from

System.components

#### Defined in

core/lib/ecs/System.d.ts:18

___

### dependencies

• `Protected` `Readonly` **dependencies**: `SystemDependencies`

#### Inherited from

System.dependencies

#### Defined in

core/lib/ecs/System.d.ts:19

___

### ecs

• **ecs**: `default`

#### Inherited from

System.ecs

#### Defined in

core/lib/ecs/System.d.ts:13

___

### entities

• `Protected` **entities**: `IList`<`default`\>

#### Inherited from

System.entities

#### Defined in

core/lib/ecs/System.d.ts:17

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

System.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Accessors

### duration

• `get` **duration**(): `number`

#### Returns

`number`

#### Inherited from

System.duration

#### Defined in

core/lib/ecs/System.d.ts:24

___

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

System.name

#### Defined in

core/lib/ecs/System.d.ts:22

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

System.clear

#### Defined in

core/lib/ecs/System.d.ts:28

___

### disabled

▸ **disabled**(`value?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `boolean` |

#### Returns

`boolean`

#### Inherited from

System.disabled

#### Defined in

core/lib/ecs/System.d.ts:21

___

### getEntities

▸ **getEntities**(): `IList`<`default`\>

#### Returns

`IList`<`default`\>

#### Inherited from

System.getEntities

#### Defined in

core/lib/ecs/System.d.ts:26

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

System.init

#### Defined in

core/lib/ecs/System.d.ts:25

___

### onEntityCreation

▸ `Protected` **onEntityCreation**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Inherited from

System.onEntityCreation

#### Defined in

core/lib/ecs/System.d.ts:33

___

### onEntityDestruction

▸ `Protected` **onEntityDestruction**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Inherited from

System.onEntityDestruction

#### Defined in

core/lib/ecs/System.d.ts:32

___

### onEntityUpdate

▸ `Protected` **onEntityUpdate**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Overrides

System.onEntityUpdate

#### Defined in

[ui/src/systems/ButtonSystem.ts:25](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/systems/ButtonSystem.ts#L25)

___

### onSystemInit

▸ `Protected` **onSystemInit**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`Promise`<`void`\>

#### Inherited from

System.onSystemInit

#### Defined in

core/lib/ecs/System.d.ts:31

___

### setDuration

▸ **setDuration**(`n`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`void`

#### Inherited from

System.setDuration

#### Defined in

core/lib/ecs/System.d.ts:23

___

### shouldBeAdded

▸ `Protected` **shouldBeAdded**(`entity`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`boolean`

#### Inherited from

System.shouldBeAdded

#### Defined in

core/lib/ecs/System.d.ts:34

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

#### Inherited from

System.update

#### Defined in

core/lib/ecs/System.d.ts:27
