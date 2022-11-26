[@mythor/events](../README.md) / [Exports](../modules.md) / EventsManager

# Class: EventsManager

## Hierarchy

- `Manager`

  ↳ **`EventsManager`**

## Table of contents

### Constructors

- [constructor](EventsManager.md#constructor)

### Properties

- [\_keysDown](EventsManager.md#_keysdown)
- [\_minDragDelta](EventsManager.md#_mindragdelta)
- [\_mousePosition](EventsManager.md#_mouseposition)
- [\_mousesDown](EventsManager.md#_mousesdown)
- [\_previousKeysDown](EventsManager.md#_previouskeysdown)
- [\_previousMousePosition](EventsManager.md#_previousmouseposition)
- [\_previousMousesDown](EventsManager.md#_previousmousesdown)
- [\_wheelDelta](EventsManager.md#_wheeldelta)
- [canvas](EventsManager.md#canvas)
- [canvasRect](EventsManager.md#canvasrect)
- [ecs](EventsManager.md#ecs)
- [events](EventsManager.md#events)
- [initialized](EventsManager.md#initialized)
- [instance](EventsManager.md#instance)
- [signature](EventsManager.md#signature)

### Accessors

- [name](EventsManager.md#name)

### Methods

- [clear](EventsManager.md#clear)
- [dragDelta](EventsManager.md#dragdelta)
- [init](EventsManager.md#init)
- [isDown](EventsManager.md#isdown)
- [isDragging](EventsManager.md#isdragging)
- [isWheeling](EventsManager.md#iswheeling)
- [keyIsDown](EventsManager.md#keyisdown)
- [keyPressed](EventsManager.md#keypressed)
- [keyReleased](EventsManager.md#keyreleased)
- [mouseIsDown](EventsManager.md#mouseisdown)
- [mousePosition](EventsManager.md#mouseposition)
- [mousePressed](EventsManager.md#mousepressed)
- [mouseReleased](EventsManager.md#mousereleased)
- [postUpdate](EventsManager.md#postupdate)
- [pressed](EventsManager.md#pressed)
- [released](EventsManager.md#released)
- [setKeyValue](EventsManager.md#setkeyvalue)
- [setMousePosition](EventsManager.md#setmouseposition)
- [setMouseValue](EventsManager.md#setmousevalue)
- [setWheel](EventsManager.md#setwheel)
- [update](EventsManager.md#update)
- [wheelDelta](EventsManager.md#wheeldelta)

## Constructors

### constructor

• **new EventsManager**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`EventManagerOptions`](../interfaces/EventManagerOptions.md) |

#### Overrides

Manager.constructor

#### Defined in

[events/src/managers/EventsManager.ts:45](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L45)

## Properties

### \_keysDown

• `Private` `Readonly` **\_keysDown**: `Map`<[`Key`](../enums/Key.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:21](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L21)

___

### \_minDragDelta

• `Private` `Readonly` **\_minDragDelta**: `number`

#### Defined in

[events/src/managers/EventsManager.ts:28](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L28)

___

### \_mousePosition

• `Private` `Readonly` **\_mousePosition**: `default`

#### Defined in

[events/src/managers/EventsManager.ts:25](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L25)

___

### \_mousesDown

• `Private` `Readonly` **\_mousesDown**: `Map`<[`MouseButton`](../enums/MouseButton.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:23](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L23)

___

### \_previousKeysDown

• `Private` `Readonly` **\_previousKeysDown**: `Map`<[`Key`](../enums/Key.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:22](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L22)

___

### \_previousMousePosition

• `Private` `Readonly` **\_previousMousePosition**: `default`

#### Defined in

[events/src/managers/EventsManager.ts:26](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L26)

___

### \_previousMousesDown

• `Private` `Readonly` **\_previousMousesDown**: `Map`<[`MouseButton`](../enums/MouseButton.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:24](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L24)

___

### \_wheelDelta

• `Private` **\_wheelDelta**: `number`

#### Defined in

[events/src/managers/EventsManager.ts:27](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L27)

___

### canvas

• `Private` `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[events/src/managers/EventsManager.ts:19](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L19)

___

### canvasRect

• `Private` **canvasRect**: `DOMRect`

#### Defined in

[events/src/managers/EventsManager.ts:20](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L20)

___

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:5

___

### events

• `Private` `Readonly` **events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextmenu` | (`event`: `MouseEvent`) => `void` |
| `keydown` | (`event`: `KeyboardEvent`) => `void` |
| `keyup` | (`event`: `KeyboardEvent`) => `void` |
| `mousedown` | (`event`: `MouseEvent`) => `void` |
| `mouseenter` | () => `void` |
| `mousemove` | (`event`: `MouseEvent`) => `void` |
| `mouseup` | (`event`: `MouseEvent`) => `void` |
| `wheel` | (`event`: `WheelEvent`) => `void` |

#### Defined in

[events/src/managers/EventsManager.ts:31](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L31)

___

### initialized

• `Private` **initialized**: `boolean` = `false`

#### Defined in

[events/src/managers/EventsManager.ts:29](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L29)

___

### instance

▪ `Static` `Private` `Optional` **instance**: [`EventsManager`](EventsManager.md)

#### Defined in

[events/src/managers/EventsManager.ts:18](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L18)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Manager.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

core/lib/ecs/Manager.d.ts:7

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Overrides

Manager.clear

#### Defined in

[events/src/managers/EventsManager.ts:120](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L120)

___

### dragDelta

▸ **dragDelta**(): `default`

#### Returns

`default`

#### Defined in

[events/src/managers/EventsManager.ts:202](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L202)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Manager.init

#### Defined in

[events/src/managers/EventsManager.ts:105](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L105)

___

### isDown

▸ `Private` **isDown**<`T`\>(`map`, `key`): `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map`<`T`, `boolean`\> |
| `key` | `T` |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:144](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L144)

___

### isDragging

▸ **isDragging**(`mouse`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mouse` | [`MouseButton`](../enums/MouseButton.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:192](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L192)

___

### isWheeling

▸ **isWheeling**(): `boolean`

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:184](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L184)

___

### keyIsDown

▸ **keyIsDown**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Key`](../enums/Key.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:164](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L164)

___

### keyPressed

▸ **keyPressed**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Key`](../enums/Key.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:168](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L168)

___

### keyReleased

▸ **keyReleased**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`Key`](../enums/Key.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:172](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L172)

___

### mouseIsDown

▸ **mouseIsDown**(`mouse`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mouse` | [`MouseButton`](../enums/MouseButton.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:176](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L176)

___

### mousePosition

▸ **mousePosition**(`convertToWorldPosition?`): `default`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `convertToWorldPosition` | `boolean` | `true` |

#### Returns

`default`

#### Defined in

[events/src/managers/EventsManager.ts:210](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L210)

___

### mousePressed

▸ **mousePressed**(`mouse`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mouse` | [`MouseButton`](../enums/MouseButton.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:180](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L180)

___

### mouseReleased

▸ **mouseReleased**(`mouse`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mouse` | [`MouseButton`](../enums/MouseButton.md) |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:206](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L206)

___

### postUpdate

▸ **postUpdate**(): `void`

#### Returns

`void`

#### Overrides

Manager.postUpdate

#### Defined in

[events/src/managers/EventsManager.ts:126](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L126)

___

### pressed

▸ `Private` **pressed**<`T`\>(`map`, `previousMap`, `key`): `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map`<`T`, `boolean`\> |
| `previousMap` | `Map`<`T`, `boolean`\> |
| `key` | `T` |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:148](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L148)

___

### released

▸ `Private` **released**<`T`\>(`map`, `previousMap`, `key`): `boolean`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `map` | `Map`<`T`, `boolean`\> |
| `previousMap` | `Map`<`T`, `boolean`\> |
| `key` | `T` |

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:156](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L156)

___

### setKeyValue

▸ `Private` **setKeyValue**(`event`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[events/src/managers/EventsManager.ts:95](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L95)

___

### setMousePosition

▸ `Private` **setMousePosition**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MouseEvent` |

#### Returns

`void`

#### Defined in

[events/src/managers/EventsManager.ts:74](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L74)

___

### setMouseValue

▸ `Private` **setMouseValue**(`event`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MouseEvent` |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[events/src/managers/EventsManager.ts:100](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L100)

___

### setWheel

▸ `Private` **setWheel**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `WheelEvent` |

#### Returns

`void`

#### Defined in

[events/src/managers/EventsManager.ts:90](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L90)

___

### update

▸ **update**(`ecs`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Inherited from

Manager.update

#### Defined in

core/lib/ecs/Manager.d.ts:10

___

### wheelDelta

▸ **wheelDelta**(`coefficient?`): `number`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `coefficient` | `number` | `1` |

#### Returns

`number`

#### Defined in

[events/src/managers/EventsManager.ts:188](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/events/src/managers/EventsManager.ts#L188)
