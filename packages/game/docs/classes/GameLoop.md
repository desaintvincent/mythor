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

[objects/GameLoop.ts:14](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L14)

___

### \_onUpdate

• `Private` `Optional` **\_onUpdate**: `UpdateFunction`

#### Defined in

[objects/GameLoop.ts:13](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L13)

___

### \_paused

• `Private` **\_paused**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:11](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L11)

___

### \_previousTime

• `Private` **\_previousTime**: `number` = `0`

#### Defined in

[objects/GameLoop.ts:7](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L7)

___

### \_requestId

• `Private` **\_requestId**: `number` = `0`

#### Defined in

[objects/GameLoop.ts:12](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L12)

___

### \_shouldStop

• `Private` **\_shouldStop**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:10](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L10)

___

### \_started

• `Private` **\_started**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:8](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L8)

___

### \_stopped

• `Private` **\_stopped**: `boolean` = `false`

#### Defined in

[objects/GameLoop.ts:9](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L9)

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

[objects/GameLoop.ts:31](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L31)

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

[objects/GameLoop.ts:27](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L27)

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

[objects/GameLoop.ts:23](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L23)

___

### pause

▸ **pause**(): `void`

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:60](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L60)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:51](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L51)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[objects/GameLoop.ts:64](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L64)

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

[objects/GameLoop.ts:16](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/game/src/objects/GameLoop.ts#L16)
