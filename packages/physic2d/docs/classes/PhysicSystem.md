[@mythor/physic2d](../README.md) / [Exports](../modules.md) / PhysicSystem

# Class: PhysicSystem

## Hierarchy

- `System`

  ↳ **`PhysicSystem`**

## Table of contents

### Constructors

- [constructor](PhysicSystem.md#constructor)

### Properties

- [\_duration](PhysicSystem.md#_duration)
- [collisionsToMakeSticky](PhysicSystem.md#collisionstomakesticky)
- [components](PhysicSystem.md#components)
- [dependencies](PhysicSystem.md#dependencies)
- [ecs](PhysicSystem.md#ecs)
- [entities](PhysicSystem.md#entities)
- [world](PhysicSystem.md#world)
- [worldScale](PhysicSystem.md#worldscale)

### Accessors

- [duration](PhysicSystem.md#duration)
- [name](PhysicSystem.md#name)

### Methods

- [applyColliderCallback](PhysicSystem.md#applycollidercallback)
- [clear](PhysicSystem.md#clear)
- [disabled](PhysicSystem.md#disabled)
- [getEntities](PhysicSystem.md#getentities)
- [getEntitiesFromContact](PhysicSystem.md#getentitiesfromcontact)
- [init](PhysicSystem.md#init)
- [onEntityCreation](PhysicSystem.md#onentitycreation)
- [onEntityDestruction](PhysicSystem.md#onentitydestruction)
- [onEntityUpdate](PhysicSystem.md#onentityupdate)
- [onSystemInit](PhysicSystem.md#onsysteminit)
- [preSolve](PhysicSystem.md#presolve)
- [query](PhysicSystem.md#query)
- [setDuration](PhysicSystem.md#setduration)
- [shouldBeAdded](PhysicSystem.md#shouldbeadded)
- [stick](PhysicSystem.md#stick)
- [update](PhysicSystem.md#update)

## Constructors

### constructor

• **new PhysicSystem**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `PhysicSystemOptions` |

#### Overrides

System.constructor

#### Defined in

physic2D/src/systems/PhysicSystem.ts:37

## Properties

### \_duration

• **\_duration**: `number`

#### Inherited from

System.\_duration

#### Defined in

core/lib/ecs/System.d.ts:16

___

### collisionsToMakeSticky

• `Private` `Readonly` **collisionsToMakeSticky**: `StickyInfo`[] = `[]`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:35

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

### world

• `Readonly` **world**: `World`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:34

___

### worldScale

• `Readonly` **worldScale**: `number`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:33

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

### applyColliderCallback

▸ `Private` **applyColliderCallback**(`entity`, `otherEntity`, `contact`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |
| `otherEntity` | `default` |
| `contact` | `Contact` |

#### Returns

`void`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:92

___

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

### getEntitiesFromContact

▸ `Private` **getEntitiesFromContact**(`contact`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contact` | `Contact` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `entityA?` | `default` |
| `entityB?` | `default` |

#### Defined in

physic2D/src/systems/PhysicSystem.ts:48

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

#### Overrides

System.onEntityCreation

#### Defined in

physic2D/src/systems/PhysicSystem.ts:131

___

### onEntityDestruction

▸ `Protected` **onEntityDestruction**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Overrides

System.onEntityDestruction

#### Defined in

physic2D/src/systems/PhysicSystem.ts:218

___

### onEntityUpdate

▸ `Protected` **onEntityUpdate**(`entity`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Inherited from

System.onEntityUpdate

#### Defined in

core/lib/ecs/System.d.ts:30

___

### onSystemInit

▸ `Protected` **onSystemInit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

System.onSystemInit

#### Defined in

physic2D/src/systems/PhysicSystem.ts:124

___

### preSolve

▸ `Private` **preSolve**(`contact`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `contact` | `Contact` |

#### Returns

`void`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:65

___

### query

▸ **query**(`point`, `onFound`, `continueToSearch?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `point` | `default` | `undefined` |
| `onFound` | (`entity`: `default`) => `boolean` | `undefined` |
| `continueToSearch` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:265

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

### stick

▸ `Private` **stick**(`si`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `si` | `StickyInfo` |

#### Returns

`void`

#### Defined in

physic2D/src/systems/PhysicSystem.ts:285

___

### update

▸ **update**(`elapsedTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elapsedTimeInSeconds` | `number` |

#### Returns

`void`

#### Overrides

System.update

#### Defined in

physic2D/src/systems/PhysicSystem.ts:226