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
- [isInFrame](Renderer.md#isinframe)
- [movedEntities](Renderer.md#movedentities)
- [opts](Renderer.md#opts)
- [shapes](Renderer.md#shapes)
- [toDraw](Renderer.md#todraw)
- [useTree](Renderer.md#usetree)

### Accessors

- [duration](Renderer.md#duration)
- [fov](Renderer.md#fov)
- [name](Renderer.md#name)

### Methods

- [addShader](Renderer.md#addshader)
- [applyDrawingFunctions](Renderer.md#applydrawingfunctions)
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
- [onEntityChange](Renderer.md#onentitychange)
- [onEntityCreation](Renderer.md#onentitycreation)
- [onEntityDestruction](Renderer.md#onentitydestruction)
- [onEntityUpdate](Renderer.md#onentityupdate)
- [onSystemInit](Renderer.md#onsysteminit)
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

[renderer/src/systems/Renderer.ts:65](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L65)

## Properties

### \_duration

• **\_duration**: `number`

#### Inherited from

System.\_duration

#### Defined in

core/lib/ecs/System.d.ts:16

___

### \_shaders

• `Private` `Readonly` **\_shaders**: `ConstructorMap`<`default`\>

#### Defined in

[renderer/src/systems/Renderer.ts:53](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L53)

___

### camera

• `Private` `Readonly` **camera**: [`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:52](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L52)

___

### canvas

• `Private` `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[renderer/src/systems/Renderer.ts:62](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L62)

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

[renderer/src/systems/Renderer.ts:63](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L63)

___

### isInFrame

• `Private` **isInFrame**: `boolean` = `false`

#### Defined in

[renderer/src/systems/Renderer.ts:55](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L55)

___

### movedEntities

• `Private` `Readonly` **movedEntities**: `Map`<`string`, `default`\>

#### Defined in

[renderer/src/systems/Renderer.ts:57](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L57)

___

### opts

• `Private` `Readonly` **opts**: `RendererOptions`

#### Defined in

[renderer/src/systems/Renderer.ts:51](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L51)

___

### shapes

• `Readonly` **shapes**: `Map`<`Constructor`<`Component`\>, `default`[]\>

#### Defined in

[renderer/src/systems/Renderer.ts:56](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L56)

___

### toDraw

• `Private` `Readonly` **toDraw**: `FnToDraw`[] = `[]`

#### Defined in

[renderer/src/systems/Renderer.ts:54](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L54)

___

### useTree

• **useTree**: `boolean`

#### Defined in

[renderer/src/systems/Renderer.ts:61](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L61)

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

[renderer/src/systems/Renderer.ts:124](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L124)

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
| `shader` | `default` |

#### Returns

`Promise`<`void`\>

#### Defined in

[renderer/src/systems/Renderer.ts:210](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L210)

___

### applyDrawingFunctions

▸ `Private` **applyDrawingFunctions**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:386](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L386)

___

### assertIsInFrame

▸ `Private` **assertIsInFrame**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:237](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L237)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Overrides

System.clear

#### Defined in

[renderer/src/systems/Renderer.ts:231](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L231)

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

[renderer/src/systems/Renderer.ts:273](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L273)

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

[renderer/src/systems/Renderer.ts:369](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L369)

___

### fillRect

▸ **fillRect**(`position`, `size`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `size` | `default` |
| `options?` | `Partial`<`FillPolyOptions`\> |

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:245](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L245)

___

### getCamera

▸ **getCamera**(): [`Camera`](Camera.md)

#### Returns

[`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:223](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L223)

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

[renderer/src/systems/Renderer.ts:341](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L341)

___

### lineHeight

▸ **lineHeight**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/systems/Renderer.ts:324](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L324)

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

[renderer/src/systems/Renderer.ts:227](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L227)

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

[renderer/src/systems/Renderer.ts:198](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L198)

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

[renderer/src/systems/Renderer.ts:177](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L177)

___

### onEntityDestruction

▸ `Protected` **onEntityDestruction**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Inherited from

System.onEntityDestruction

#### Defined in

core/lib/ecs/System.d.ts:32

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

[renderer/src/systems/Renderer.ts:139](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L139)

___

### onSystemInit

▸ `Protected` **onSystemInit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

System.onSystemInit

#### Defined in

[renderer/src/systems/Renderer.ts:166](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L166)

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

[renderer/src/systems/Renderer.ts:134](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L134)

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

[renderer/src/systems/Renderer.ts:292](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L292)

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

[renderer/src/systems/Renderer.ts:354](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L354)

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

[renderer/src/systems/Renderer.ts:258](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L258)

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

[renderer/src/systems/Renderer.ts:328](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L328)

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

[renderer/src/systems/Renderer.ts:93](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L93)

___

### updateMovedEntities

▸ `Private` **updateMovedEntities**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:202](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/systems/Renderer.ts#L202)
