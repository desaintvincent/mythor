[@mythor/audio](../README.md) / [Exports](../modules.md) / AudioSystem

# Class: AudioSystem

Drives every `AudioSource` found on `[Transform, AudioSource]` entities:
triggers autoplay/`play()`/`stop()` requests, and for spatial sources
recomputes distance/pan against the active `AudioListener` (or world
origin if none exists) and pushes it to `AudioManager.updateSpatial()`.

## Hierarchy

- `System`

  ↳ **`AudioSystem`**

## Table of contents

### Constructors

- [constructor](AudioSystem.md#constructor)

### Properties

- [\_duration](AudioSystem.md#_duration)
- [components](AudioSystem.md#components)
- [dependencies](AudioSystem.md#dependencies)
- [ecs](AudioSystem.md#ecs)
- [entities](AudioSystem.md#entities)
- [signature](AudioSystem.md#signature)

### Accessors

- [duration](AudioSystem.md#duration)
- [name](AudioSystem.md#name)

### Methods

- [clear](AudioSystem.md#clear)
- [disabled](AudioSystem.md#disabled)
- [findListenerPosition](AudioSystem.md#findlistenerposition)
- [getEntities](AudioSystem.md#getentities)
- [init](AudioSystem.md#init)
- [onEntityCreation](AudioSystem.md#onentitycreation)
- [onEntityDestruction](AudioSystem.md#onentitydestruction)
- [onEntityUpdate](AudioSystem.md#onentityupdate)
- [onSystemInit](AudioSystem.md#onsysteminit)
- [setDuration](AudioSystem.md#setduration)
- [shouldBeAdded](AudioSystem.md#shouldbeadded)
- [update](AudioSystem.md#update)

## Constructors

### constructor

• **new AudioSystem**()

#### Overrides

System.constructor

#### Defined in

[audio/src/systems/AudioSystem.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/systems/AudioSystem.ts#L16)

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

### findListenerPosition

▸ `Private` **findListenerPosition**(): `default`

#### Returns

`default`

#### Defined in

[audio/src/systems/AudioSystem.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/systems/AudioSystem.ts#L22)

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

[audio/src/systems/AudioSystem.ts:36](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/systems/AudioSystem.ts#L36)

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
