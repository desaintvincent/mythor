[@mythor/renderer](../README.md) / [Exports](../modules.md) / Renderer

# Class: Renderer

## Hierarchy

- `System`

  ↳ **`Renderer`**

## Table of contents

### Constructors

- [constructor](Renderer.md#constructor)

### Properties

- [\_duration](Renderer.md#_duration)
- [\_shaders](Renderer.md#_shaders)
- [camera](Renderer.md#camera)
- [canvas](Renderer.md#canvas)
- [components](Renderer.md#components)
- [dependencies](Renderer.md#dependencies)
- [ecs](Renderer.md#ecs)
- [entities](Renderer.md#entities)
- [gl](Renderer.md#gl)
- [guiCamera](Renderer.md#guicamera)
- [initDefaultShaders](Renderer.md#initdefaultshaders)
- [isInFrame](Renderer.md#isinframe)
- [movedEntities](Renderer.md#movedentities)
- [opts](Renderer.md#opts)
- [postProcessPipeline](Renderer.md#postprocesspipeline)
- [shapes](Renderer.md#shapes)
- [toDraw](Renderer.md#todraw)
- [toDrawGui](Renderer.md#todrawgui)
- [useTree](Renderer.md#usetree)
- [signature](Renderer.md#signature)

### Accessors

- [duration](Renderer.md#duration)
- [fov](Renderer.md#fov)
- [name](Renderer.md#name)

### Methods

- [addShader](Renderer.md#addshader)
- [applyDrawingFunctions](Renderer.md#applydrawingfunctions)
- [applyGuiDrawingFunctions](Renderer.md#applyguidrawingfunctions)
- [assertIsInFrame](Renderer.md#assertisinframe)
- [clear](Renderer.md#clear)
- [disabled](Renderer.md#disabled)
- [fillCircle](Renderer.md#fillcircle)
- [fillPoly](Renderer.md#fillpoly)
- [fillRect](Renderer.md#fillrect)
- [getCamera](Renderer.md#getcamera)
- [getEntities](Renderer.md#getentities)
- [init](Renderer.md#init)
- [line](Renderer.md#line)
- [lineHeight](Renderer.md#lineheight)
- [onDraw](Renderer.md#ondraw)
- [onDrawGui](Renderer.md#ondrawgui)
- [onEntityChange](Renderer.md#onentitychange)
- [onEntityCreation](Renderer.md#onentitycreation)
- [onEntityDestruction](Renderer.md#onentitydestruction)
- [onEntityUpdate](Renderer.md#onentityupdate)
- [onSystemInit](Renderer.md#onsysteminit)
- [renderEntity](Renderer.md#renderentity)
- [renderScreenSpaceEntities](Renderer.md#renderscreenspaceentities)
- [setDuration](Renderer.md#setduration)
- [setTree](Renderer.md#settree)
- [shouldBeAdded](Renderer.md#shouldbeadded)
- [strokeCircle](Renderer.md#strokecircle)
- [strokePoly](Renderer.md#strokepoly)
- [strokeRect](Renderer.md#strokerect)
- [text](Renderer.md#text)
- [update](Renderer.md#update)
- [updateMovedEntities](Renderer.md#updatemovedentities)

## Constructors

### constructor

• **new Renderer**(`params?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `RendererParams` |

#### Overrides

System.constructor

#### Defined in

[renderer/src/systems/Renderer.ts:73](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L73)

## Properties

### \_duration

• **\_duration**: `number`

#### Inherited from

System.\_duration

#### Defined in

core/lib/ecs/System.d.ts:16

___

### \_shaders

• `Private` `Readonly` **\_shaders**: `ConstructorMap`<[`Shader`](Shader.md)\>

#### Defined in

[renderer/src/systems/Renderer.ts:57](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L57)

___

### camera

• `Private` `Readonly` **camera**: [`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:56](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L56)

___

### canvas

• `Private` `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[renderer/src/systems/Renderer.ts:68](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L68)

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

### gl

• `Readonly` **gl**: `WebGL2RenderingContext`

#### Defined in

[renderer/src/systems/Renderer.ts:69](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L69)

___

### guiCamera

• `Private` `Readonly` **guiCamera**: [`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:60](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L60)

___

### initDefaultShaders

• `Private` `Readonly` **initDefaultShaders**: `boolean`

#### Defined in

[renderer/src/systems/Renderer.ts:70](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L70)

___

### isInFrame

• `Private` **isInFrame**: `boolean` = `false`

#### Defined in

[renderer/src/systems/Renderer.ts:61](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L61)

___

### movedEntities

• `Private` `Readonly` **movedEntities**: `Map`<`string`, `default`\>

#### Defined in

[renderer/src/systems/Renderer.ts:63](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L63)

___

### opts

• `Private` `Readonly` **opts**: `RendererOptions`

#### Defined in

[renderer/src/systems/Renderer.ts:55](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L55)

___

### postProcessPipeline

• `Private` `Readonly` **postProcessPipeline**: ``null`` \| [`PostProcessPipeline`](PostProcessPipeline.md) = `null`

#### Defined in

[renderer/src/systems/Renderer.ts:71](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L71)

___

### shapes

• `Readonly` **shapes**: `Map`<`Constructor`<`Component`\>, [`Shader`](Shader.md)[]\>

#### Defined in

[renderer/src/systems/Renderer.ts:62](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L62)

___

### toDraw

• `Private` `Readonly` **toDraw**: `FnToDraw`[] = `[]`

#### Defined in

[renderer/src/systems/Renderer.ts:58](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L58)

___

### toDrawGui

• `Private` `Readonly` **toDrawGui**: `FnToDraw`[] = `[]`

#### Defined in

[renderer/src/systems/Renderer.ts:59](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L59)

___

### useTree

• **useTree**: `boolean`

#### Defined in

[renderer/src/systems/Renderer.ts:67](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L67)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

System.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

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

### fov

• `get` **fov**(): `Rect`

#### Returns

`Rect`

#### Defined in

[renderer/src/systems/Renderer.ts:188](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L188)

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

### addShader

▸ **addShader**(`shader`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shader` | [`Shader`](Shader.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[renderer/src/systems/Renderer.ts:303](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L303)

___

### applyDrawingFunctions

▸ `Private` **applyDrawingFunctions**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:492](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L492)

___

### applyGuiDrawingFunctions

▸ `Private` **applyGuiDrawingFunctions**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:502](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L502)

___

### assertIsInFrame

▸ `Private` **assertIsInFrame**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:342](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L342)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Overrides

System.clear

#### Defined in

[renderer/src/systems/Renderer.ts:328](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L328)

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

### fillCircle

▸ **fillCircle**(`position`, `size`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `size` | `number` \| `default` |
| `options?` | `Omit`<`Partial`<`CircleOptions`\>, ``"fill"``\> |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:379](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L379)

___

### fillPoly

▸ **fillPoly**(`position`, `points`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `points` | `default`[] |
| `options?` | `Partial`<`FillPolyOptions`\> |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:475](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L475)

___

### fillRect

▸ **fillRect**(`position`, `size`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `size` | `default` |
| `options?` | `Partial`<`FillPolyOptions`\> & { `radius?`: `number`  } |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:350](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L350)

___

### getCamera

▸ **getCamera**(): [`Camera`](Camera.md)

#### Returns

[`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:316](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L316)

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

### line

▸ **line**(`positionStart`, `positionEnd`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `positionStart` | `default` |
| `positionEnd` | `default` |
| `options?` | `Partial`<`LineOptions`\> |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:447](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L447)

___

### lineHeight

▸ **lineHeight**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/systems/Renderer.ts:430](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L430)

___

### onDraw

▸ **onDraw**(`fn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `FnToDraw` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:320](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L320)

___

### onDrawGui

▸ **onDrawGui**(`fn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `FnToDraw` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:324](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L324)

___

### onEntityChange

▸ `Private` **onEntityChange**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:288](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L288)

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

[renderer/src/systems/Renderer.ts:258](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L258)

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

[renderer/src/systems/Renderer.ts:279](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L279)

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

#### Overrides

System.onEntityUpdate

#### Defined in

[renderer/src/systems/Renderer.ts:203](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L203)

___

### onSystemInit

▸ `Protected` **onSystemInit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

System.onSystemInit

#### Defined in

[renderer/src/systems/Renderer.ts:244](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L244)

___

### renderEntity

▸ `Private` **renderEntity**(`entity`, `camera`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |
| `camera` | [`Camera`](Camera.md) |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:221](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L221)

___

### renderScreenSpaceEntities

▸ `Private` **renderScreenSpaceEntities**(`elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:172](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L172)

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

### setTree

▸ **setTree**(`rect`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `Rect` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:198](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L198)

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

### strokeCircle

▸ **strokeCircle**(`position`, `size`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `size` | `number` \| `default` |
| `options?` | `Omit`<`Partial`<`CircleOptions`\>, ``"fill"``\> & { `diagonal?`: `boolean`  } |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:398](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L398)

___

### strokePoly

▸ **strokePoly**(`position`, `points`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `points` | `default`[] |
| `options?` | `Partial`<`StrokePolyOptions`\> |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:460](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L460)

___

### strokeRect

▸ **strokeRect**(`position`, `size`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `size` | `default` |
| `options?` | `Partial`<`StrokePolyOptions`\> |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:364](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L364)

___

### text

▸ **text**(`position`, `text`, `params?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `text` | `string` |
| `params?` | `Object` |
| `params.color?` | [`Color`](../modules.md#color) |
| `params.size?` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:434](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L434)

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

#### Overrides

System.update

#### Defined in

[renderer/src/systems/Renderer.ts:118](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L118)

___

### updateMovedEntities

▸ `Private` **updateMovedEntities**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:295](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/systems/Renderer.ts#L295)
