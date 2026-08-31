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

[events/src/managers/EventsManager.ts:45](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L45)

## Properties

### \_keysDown

• `Private` `Readonly` **\_keysDown**: `Map`<[`Key`](../enums/Key.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:21](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L21)

___

### \_minDragDelta

• `Private` `Readonly` **\_minDragDelta**: `number`

#### Defined in

[events/src/managers/EventsManager.ts:28](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L28)

___

### \_mousePosition

• `Private` `Readonly` **\_mousePosition**: `default`

#### Defined in

[events/src/managers/EventsManager.ts:25](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L25)

___

### \_mousesDown

• `Private` `Readonly` **\_mousesDown**: `Map`<[`MouseButton`](../enums/MouseButton.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:23](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L23)

___

### \_previousKeysDown

• `Private` `Readonly` **\_previousKeysDown**: `Map`<[`Key`](../enums/Key.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L22)

___

### \_previousMousePosition

• `Private` `Readonly` **\_previousMousePosition**: `default`

#### Defined in

[events/src/managers/EventsManager.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L26)

___

### \_previousMousesDown

• `Private` `Readonly` **\_previousMousesDown**: `Map`<[`MouseButton`](../enums/MouseButton.md), `boolean`\>

#### Defined in

[events/src/managers/EventsManager.ts:24](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L24)

___

### \_wheelDelta

• `Private` **\_wheelDelta**: `number`

#### Defined in

[events/src/managers/EventsManager.ts:27](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L27)

___

### canvas

• `Private` `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[events/src/managers/EventsManager.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L19)

___

### canvasRect

• `Private` **canvasRect**: `DOMRect`

#### Defined in

[events/src/managers/EventsManager.ts:20](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L20)

___

### ecs

• `Protected` **ecs**: `default`

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

[events/src/managers/EventsManager.ts:31](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L31)

___

### initialized

• `Private` **initialized**: `boolean` = `false`

#### Defined in

[events/src/managers/EventsManager.ts:29](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L29)

___

### instance

▪ `Static` `Private` `Optional` **instance**: [`EventsManager`](EventsManager.md)

#### Defined in

[events/src/managers/EventsManager.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L18)

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

[events/src/managers/EventsManager.ts:121](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L121)

___

### dragDelta

▸ **dragDelta**(): `default`

#### Returns

`default`

#### Defined in

[events/src/managers/EventsManager.ts:203](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L203)

___

### init

▸ **init**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`Promise`<`void`\>

#### Overrides

Manager.init

#### Defined in

[events/src/managers/EventsManager.ts:105](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L105)

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

[events/src/managers/EventsManager.ts:145](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L145)

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

[events/src/managers/EventsManager.ts:193](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L193)

___

### isWheeling

▸ **isWheeling**(): `boolean`

#### Returns

`boolean`

#### Defined in

[events/src/managers/EventsManager.ts:185](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L185)

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

[events/src/managers/EventsManager.ts:165](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L165)

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

[events/src/managers/EventsManager.ts:169](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L169)

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

[events/src/managers/EventsManager.ts:173](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L173)

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

[events/src/managers/EventsManager.ts:177](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L177)

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

[events/src/managers/EventsManager.ts:211](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L211)

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

[events/src/managers/EventsManager.ts:181](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L181)

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

[events/src/managers/EventsManager.ts:207](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L207)

___

### postUpdate

▸ **postUpdate**(): `void`

#### Returns

`void`

#### Overrides

Manager.postUpdate

#### Defined in

[events/src/managers/EventsManager.ts:127](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L127)

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

[events/src/managers/EventsManager.ts:149](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L149)

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

[events/src/managers/EventsManager.ts:157](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L157)

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

[events/src/managers/EventsManager.ts:95](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L95)

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

[events/src/managers/EventsManager.ts:74](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L74)

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

[events/src/managers/EventsManager.ts:100](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L100)

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

[events/src/managers/EventsManager.ts:90](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L90)

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

[events/src/managers/EventsManager.ts:189](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/events/src/managers/EventsManager.ts#L189)
