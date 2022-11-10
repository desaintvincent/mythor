[@mythor/game](../README.md) / [Exports](../modules.md) / RendererDebugManager

# Class: RendererDebugManager

## Hierarchy

- `Manager`

  ↳ **`RendererDebugManager`**

## Table of contents

### Constructors

- [constructor](RendererDebugManager.md#constructor)

### Properties

- [ecs](RendererDebugManager.md#ecs)
- [show](RendererDebugManager.md#show)

### Accessors

- [name](RendererDebugManager.md#name)

### Methods

- [clear](RendererDebugManager.md#clear)
- [drawQuadTree](RendererDebugManager.md#drawquadtree)
- [init](RendererDebugManager.md#init)
- [isTopLeft](RendererDebugManager.md#istopleft)
- [offsetCamera](RendererDebugManager.md#offsetcamera)
- [postUpdate](RendererDebugManager.md#postupdate)
- [prettyRect](RendererDebugManager.md#prettyrect)
- [render](RendererDebugManager.md#render)
- [update](RendererDebugManager.md#update)

## Constructors

### constructor

• **new RendererDebugManager**()

#### Overrides

Manager.constructor

#### Defined in

[game/src/managers/RendererDebugManager.ts:16](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L16)

## Properties

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:4

___

### show

• `Private` **show**: `boolean` = `false`

#### Defined in

[game/src/managers/RendererDebugManager.ts:14](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L14)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

core/lib/ecs/Manager.d.ts:6

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Manager.clear

#### Defined in

core/lib/ecs/Manager.d.ts:10

___

### drawQuadTree

▸ `Private` **drawQuadTree**(`renderer`, `quadTree?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | `Renderer` |
| `quadTree?` | `QuadTree` |

#### Returns

`void`

#### Defined in

[game/src/managers/RendererDebugManager.ts:64](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L64)

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

Manager.init

#### Defined in

core/lib/ecs/Manager.d.ts:7

___

### isTopLeft

▸ `Private` **isTopLeft**(`q`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `q` | `QuadTree` |

#### Returns

`boolean`

#### Defined in

[game/src/managers/RendererDebugManager.ts:56](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L56)

___

### offsetCamera

▸ `Private` **offsetCamera**(`vec`): `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vec` | `default` |

#### Returns

`default`

#### Defined in

[game/src/managers/RendererDebugManager.ts:45](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L45)

___

### postUpdate

▸ **postUpdate**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`void`

#### Inherited from

Manager.postUpdate

#### Defined in

core/lib/ecs/Manager.d.ts:8

___

### prettyRect

▸ `Private` **prettyRect**(`rect`, `newLine?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `rect` | `Rect` | `undefined` |
| `newLine` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

[game/src/managers/RendererDebugManager.ts:96](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L96)

___

### render

▸ `Private` **render**(): `void`

#### Returns

`void`

#### Defined in

[game/src/managers/RendererDebugManager.ts:104](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L104)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Overrides

Manager.update

#### Defined in

[game/src/managers/RendererDebugManager.ts:20](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/RendererDebugManager.ts#L20)
