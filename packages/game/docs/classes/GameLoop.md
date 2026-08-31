[@mythor/game](../README.md) / [Exports](../modules.md) / GameLoop

# Class: GameLoop

## Table of contents

### Constructors

- [constructor](GameLoop.md#constructor)

### Properties

- [\_onStop](GameLoop.md#_onstop)
- [\_onUpdate](GameLoop.md#_onupdate)
- [\_paused](GameLoop.md#_paused)
- [\_previousTime](GameLoop.md#_previoustime)
- [\_requestId](GameLoop.md#_requestid)
- [\_shouldStop](GameLoop.md#_shouldstop)
- [\_started](GameLoop.md#_started)
- [\_stopped](GameLoop.md#_stopped)

### Methods

- [loop](GameLoop.md#loop)
- [onStop](GameLoop.md#onstop)
- [onUpdate](GameLoop.md#onupdate)
- [pause](GameLoop.md#pause)
- [start](GameLoop.md#start)
- [stop](GameLoop.md#stop)
- [update](GameLoop.md#update)

## Constructors

### constructor

• **new GameLoop**()

## Properties

### \_onStop

• `Private` `Optional` **\_onStop**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[objects/GameLoop.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L22)

___

### \_onUpdate

• `Private` `Optional` **\_onUpdate**: `UpdateFunction`

#### Defined in

[objects/GameLoop.ts:21](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L21)

___

### \_paused

• `Private` **\_paused**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L19)

___

### \_previousTime

• `Private` **\_previousTime**: `number` = `0`

#### Defined in

[objects/GameLoop.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L15)

___

### \_requestId

• `Private` **\_requestId**: `number` = `0`

#### Defined in

[objects/GameLoop.ts:20](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L20)

___

### \_shouldStop

• `Private` **\_shouldStop**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L18)

___

### \_started

• `Private` **\_started**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L16)

___

### \_stopped

• `Private` **\_stopped**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L17)

## Methods

### loop

▸ `Private` **loop**(`time?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `time` | `number` | `0` |

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:39](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L39)

___

### onStop

▸ **onStop**(`fn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:35](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L35)

___

### onUpdate

▸ **onUpdate**(`fn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `UpdateFunction` |

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:31](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L31)

___

### pause

▸ **pause**(): `void`

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:71](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L71)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:62](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L62)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:75](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L75)

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

[objects/GameLoop.ts:24](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/game/src/objects/GameLoop.ts#L24)
