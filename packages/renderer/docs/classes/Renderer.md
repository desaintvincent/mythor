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
- [initDefaultShaders](Renderer.md#initdefaultshaders)
- [isInFrame](Renderer.md#isinframe)
- [movedEntities](Renderer.md#movedentities)
- [opts](Renderer.md#opts)
- [shapes](Renderer.md#shapes)
- [toDraw](Renderer.md#todraw)
- [useTree](Renderer.md#usetree)
- [signature](Renderer.md#signature)

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

[renderer/src/systems/Renderer.ts:67](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L67)

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

[renderer/src/systems/Renderer.ts:54](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L54)

___

### camera

• `Private` `Readonly` **camera**: [`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:53](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L53)

___

### canvas

• `Private` `Readonly` **canvas**: `HTMLCanvasElement`

#### Defined in

[renderer/src/systems/Renderer.ts:63](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L63)

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

[renderer/src/systems/Renderer.ts:64](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L64)

___

### initDefaultShaders

• `Private` `Readonly` **initDefaultShaders**: `boolean`

#### Defined in

[renderer/src/systems/Renderer.ts:65](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L65)

___

### isInFrame

• `Private` **isInFrame**: `boolean` = `false`

#### Defined in

[renderer/src/systems/Renderer.ts:56](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L56)

___

### movedEntities

• `Private` `Readonly` **movedEntities**: `Map`<`string`, `default`\>

#### Defined in

[renderer/src/systems/Renderer.ts:58](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L58)

___

### opts

• `Private` `Readonly` **opts**: `RendererOptions`

#### Defined in

[renderer/src/systems/Renderer.ts:52](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L52)

___

### shapes

• `Readonly` **shapes**: `Map`<`Constructor`<`Component`\>, `default`[]\>

#### Defined in

[renderer/src/systems/Renderer.ts:57](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L57)

___

### toDraw

• `Private` `Readonly` **toDraw**: `FnToDraw`[] = `[]`

#### Defined in

[renderer/src/systems/Renderer.ts:55](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L55)

___

### useTree

• **useTree**: `boolean`

#### Defined in

[renderer/src/systems/Renderer.ts:62](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L62)

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

[renderer/src/systems/Renderer.ts:129](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L129)

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

[renderer/src/systems/Renderer.ts:219](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L219)

___

### applyDrawingFunctions

▸ `Private` **applyDrawingFunctions**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:395](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L395)

___

### assertIsInFrame

▸ `Private` **assertIsInFrame**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:246](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L246)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Overrides

System.clear

#### Defined in

[renderer/src/systems/Renderer.ts:240](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L240)

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

[renderer/src/systems/Renderer.ts:282](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L282)

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

[renderer/src/systems/Renderer.ts:378](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L378)

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

[renderer/src/systems/Renderer.ts:254](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L254)

___

### getCamera

▸ **getCamera**(): [`Camera`](Camera.md)

#### Returns

[`Camera`](Camera.md)

#### Defined in

[renderer/src/systems/Renderer.ts:232](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L232)

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

[renderer/src/systems/Renderer.ts:350](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L350)

___

### lineHeight

▸ **lineHeight**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/systems/Renderer.ts:333](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L333)

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

[renderer/src/systems/Renderer.ts:236](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L236)

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

[renderer/src/systems/Renderer.ts:206](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L206)

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

[renderer/src/systems/Renderer.ts:185](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L185)

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

[renderer/src/systems/Renderer.ts:144](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L144)

___

### onSystemInit

▸ `Protected` **onSystemInit**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

System.onSystemInit

#### Defined in

[renderer/src/systems/Renderer.ts:171](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L171)

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

[renderer/src/systems/Renderer.ts:139](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L139)

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

[renderer/src/systems/Renderer.ts:301](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L301)

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

[renderer/src/systems/Renderer.ts:363](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L363)

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

[renderer/src/systems/Renderer.ts:267](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L267)

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

[renderer/src/systems/Renderer.ts:337](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L337)

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

[renderer/src/systems/Renderer.ts:98](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L98)

___

### updateMovedEntities

▸ `Private` **updateMovedEntities**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/systems/Renderer.ts:211](https://github.com/desaintvincent/mythor/blob/d4665fb/packages/renderer/src/systems/Renderer.ts#L211)
