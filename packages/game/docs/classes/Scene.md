[@mythor/game](../README.md) / [Exports](../modules.md) / Scene

# Class: Scene

## Table of contents

### Constructors

- [constructor](Scene.md#constructor)

### Properties

- [\_ready](Scene.md#_ready)
- [\_running](Scene.md#_running)
- [ecs](Scene.md#ecs)
- [name](Scene.md#name)

### Methods

- [init](Scene.md#init)
- [isReady](Scene.md#isready)
- [start](Scene.md#start)
- [stop](Scene.md#stop)
- [update](Scene.md#update)

## Constructors

### constructor

• **new Scene**(`name`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options?` | `SceneOptions` |

#### Defined in

[objects/Scene.ts:16](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L16)

## Properties

### \_ready

• `Private` **\_ready**: `boolean` = `false`

#### Defined in

[objects/Scene.ts:12](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L12)

___

### \_running

• `Private` **\_running**: `boolean` = `false`

#### Defined in

[objects/Scene.ts:13](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L13)

___

### ecs

• `Readonly` **ecs**: `default`

#### Defined in

[objects/Scene.ts:14](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L14)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[objects/Scene.ts:11](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L11)

## Methods

### init

▸ `Private` **init**(`options?`): [`Scene`](Scene.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `SceneOptions` |

#### Returns

[`Scene`](Scene.md)

#### Defined in

[objects/Scene.ts:40](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L40)

___

### isReady

▸ **isReady**(): `boolean`

#### Returns

`boolean`

#### Defined in

[objects/Scene.ts:25](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L25)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[objects/Scene.ts:56](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L56)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[objects/Scene.ts:60](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L60)

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

#### Defined in

[objects/Scene.ts:29](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/game/src/objects/Scene.ts#L29)
