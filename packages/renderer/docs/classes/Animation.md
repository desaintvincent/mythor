[@mythor/renderer](../README.md) / [Exports](../modules.md) / Animation

# Class: Animation

## Hierarchy

- `Component`

  ↳ **`Animation`**

## Table of contents

### Constructors

- [constructor](Animation.md#constructor)

### Properties

- [\_entity](Animation.md#_entity)
- [animationSpeed](Animation.md#animationspeed)
- [animations](Animation.md#animations)
- [currentAnimation](Animation.md#currentanimation)
- [currentFrame](Animation.md#currentframe)
- [finished](Animation.md#finished)
- [previousAnimation](Animation.md#previousanimation)
- [time](Animation.md#time)
- [signature](Animation.md#signature)

### Methods

- [add](Animation.md#add)
- [run](Animation.md#run)
- [running](Animation.md#running)

## Constructors

### constructor

• **new Animation**(`animationSpeedInSeconds?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `animationSpeedInSeconds` | `number` | `0` |

#### Overrides

Component.constructor

#### Defined in

[renderer/src/components/Animation.ts:26](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L26)

## Properties

### \_entity

• **\_entity**: `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### animationSpeed

• **animationSpeed**: `number`

#### Defined in

[renderer/src/components/Animation.ts:23](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L23)

___

### animations

• **animations**: `Record`<`string`, `AnimationDefinition`\>

#### Defined in

[renderer/src/components/Animation.ts:22](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L22)

___

### currentAnimation

• **currentAnimation**: `string`

#### Defined in

[renderer/src/components/Animation.ts:20](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L20)

___

### currentFrame

• **currentFrame**: `number` = `0`

#### Defined in

[renderer/src/components/Animation.ts:18](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L18)

___

### finished

• **finished**: `boolean`

#### Defined in

[renderer/src/components/Animation.ts:24](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L24)

___

### previousAnimation

• **previousAnimation**: `string`

#### Defined in

[renderer/src/components/Animation.ts:21](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L21)

___

### time

• **time**: `number` = `0`

#### Defined in

[renderer/src/components/Animation.ts:19](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L19)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Methods

### add

▸ **add**(`name`, `start`, `end`, `params?`): [`Animation`](Animation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `start` | `number` |
| `end` | `number` |
| `params?` | `AddParams` |

#### Returns

[`Animation`](Animation.md)

#### Defined in

[renderer/src/components/Animation.ts:41](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L41)

___

### run

▸ **run**(`name`, `reset?`): [`Animation`](Animation.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `reset` | `boolean` | `false` |

#### Returns

[`Animation`](Animation.md)

#### Defined in

[renderer/src/components/Animation.ts:60](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L60)

___

### running

▸ **running**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Defined in

[renderer/src/components/Animation.ts:37](https://github.com/desaintvincent/mythor/blob/2f103ed/packages/renderer/src/components/Animation.ts#L37)
