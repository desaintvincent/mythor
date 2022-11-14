[@mythor/renderer](../README.md) / [Exports](../modules.md) / Animator

# Class: Animator

## Hierarchy

- `System`

  ↳ **`Animator`**

## Table of contents

### Constructors

- [constructor](Animator.md#constructor)

### Properties

- [\_duration](Animator.md#_duration)
- [components](Animator.md#components)
- [dependencies](Animator.md#dependencies)
- [ecs](Animator.md#ecs)
- [entities](Animator.md#entities)

### Accessors

- [duration](Animator.md#duration)
- [name](Animator.md#name)

### Methods

- [clear](Animator.md#clear)
- [disabled](Animator.md#disabled)
- [getEntities](Animator.md#getentities)
- [init](Animator.md#init)
- [onEntityCreation](Animator.md#onentitycreation)
- [onEntityDestruction](Animator.md#onentitydestruction)
- [onEntityUpdate](Animator.md#onentityupdate)
- [onSystemInit](Animator.md#onsysteminit)
- [setDuration](Animator.md#setduration)
- [shouldBeAdded](Animator.md#shouldbeadded)
- [update](Animator.md#update)

## Constructors

### constructor

• **new Animator**()

#### Overrides

System.constructor

#### Defined in

[renderer/src/systems/Animator.ts:6](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/systems/Animator.ts#L6)

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

▸ `Protected` **onEntityUpdate**(`entity`, `elapsedTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |
| `elapsedTimeInSeconds` | `number` |

#### Returns

`void`

#### Overrides

System.onEntityUpdate

#### Defined in

[renderer/src/systems/Animator.ts:10](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/systems/Animator.ts#L10)

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
