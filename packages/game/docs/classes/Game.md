[@mythor/game](../README.md) / [Exports](../modules.md) / Game

# Class: Game

## Table of contents

### Constructors

- [constructor](Game.md#constructor)

### Properties

- [\_gameloop](Game.md#_gameloop)
- [sceneManager](Game.md#scenemanager)

### Accessors

- [gameloop](Game.md#gameloop)

### Methods

- [addScene](Game.md#addscene)
- [onUpdate](Game.md#onupdate)
- [start](Game.md#start)

## Constructors

### constructor

• **new Game**(...`scenes`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...scenes` | [`Scene`](Scene.md)[] |

#### Defined in

[objects/Game.ts:9](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L9)

## Properties

### \_gameloop

• `Private` `Readonly` **\_gameloop**: [`GameLoop`](GameLoop.md)

#### Defined in

[objects/Game.ts:7](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L7)

___

### sceneManager

• `Private` `Readonly` **sceneManager**: `SceneManager`

#### Defined in

[objects/Game.ts:6](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L6)

## Accessors

### gameloop

• `get` **gameloop**(): [`GameLoop`](GameLoop.md)

#### Returns

[`GameLoop`](GameLoop.md)

#### Defined in

[objects/Game.ts:18](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L18)

## Methods

### addScene

▸ **addScene**(`scene`): [`Game`](Game.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `scene` | [`Scene`](Scene.md) |

#### Returns

[`Game`](Game.md)

#### Defined in

[objects/Game.ts:22](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L22)

___

### onUpdate

▸ `Private` **onUpdate**(`elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[objects/Game.ts:28](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L28)

___

### start

▸ **start**(): [`Game`](Game.md)

#### Returns

[`Game`](Game.md)

#### Defined in

[objects/Game.ts:38](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/game/src/objects/Game.ts#L38)
