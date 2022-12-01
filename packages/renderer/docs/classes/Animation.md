[@mythor/renderer](../README.md) / [Exports](../modules.md) / Animation

# Class: Animation<AnimationId\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `AnimationId` | extends `string` \| `number` = `string` \| `number` |

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

• **new Animation**<`AnimationId`\>(`animationSpeedInSeconds?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `AnimationId` | extends `string` \| `number` = `string` \| `number` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `animationSpeedInSeconds` | `number` | `0` |

#### Overrides

Component.constructor

#### Defined in

[renderer/src/components/Animation.ts:28](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L28)

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

[renderer/src/components/Animation.ts:25](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L25)

___

### animations

• **animations**: `Map`<`AnimationId`, `AnimationDefinition`\>

#### Defined in

[renderer/src/components/Animation.ts:24](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L24)

___

### currentAnimation

• **currentAnimation**: `AnimationId`

#### Defined in

[renderer/src/components/Animation.ts:22](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L22)

___

### currentFrame

• **currentFrame**: `number` = `0`

#### Defined in

[renderer/src/components/Animation.ts:20](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L20)

___

### finished

• **finished**: `boolean`

#### Defined in

[renderer/src/components/Animation.ts:26](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L26)

___

### previousAnimation

• **previousAnimation**: `AnimationId`

#### Defined in

[renderer/src/components/Animation.ts:23](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L23)

___

### time

• **time**: `number` = `0`

#### Defined in

[renderer/src/components/Animation.ts:21](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L21)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Methods

### add

▸ **add**(`name`, `start`, `end`, `params?`): [`Animation`](Animation.md)<`string` \| `number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `AnimationId` |
| `start` | `number` |
| `end` | `number` |
| `params?` | `AddParams` |

#### Returns

[`Animation`](Animation.md)<`string` \| `number`\>

#### Defined in

[renderer/src/components/Animation.ts:43](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L43)

___

### run

▸ **run**(`name`, `reset?`): [`Animation`](Animation.md)<`string` \| `number`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `AnimationId` | `undefined` |
| `reset` | `boolean` | `false` |

#### Returns

[`Animation`](Animation.md)<`string` \| `number`\>

#### Defined in

[renderer/src/components/Animation.ts:63](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L63)

___

### running

▸ **running**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `AnimationId` |

#### Returns

`boolean`

#### Defined in

[renderer/src/components/Animation.ts:39](https://github.com/desaintvincent/mythor/blob/945b4e7/packages/renderer/src/components/Animation.ts#L39)
