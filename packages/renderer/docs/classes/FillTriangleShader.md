[@mythor/renderer](../README.md) / [Exports](../modules.md) / FillTriangleShader

# Class: FillTriangleShader

## Hierarchy

- [`Shader`](Shader.md)

  ↳ **`FillTriangleShader`**

## Table of contents

### Constructors

- [constructor](FillTriangleShader.md#constructor)

### Properties

- [attributes](FillTriangleShader.md#attributes)
- [camera](FillTriangleShader.md#camera)
- [component](FillTriangleShader.md#component)
- [drawFunction](FillTriangleShader.md#drawfunction)
- [elemNumber](FillTriangleShader.md#elemnumber)
- [gl](FillTriangleShader.md#gl)
- [logger](FillTriangleShader.md#logger)
- [maxElements](FillTriangleShader.md#maxelements)
- [program](FillTriangleShader.md#program)
- [uniforms](FillTriangleShader.md#uniforms)
- [vao](FillTriangleShader.md#vao)

### Methods

- [beforeDraw](FillTriangleShader.md#beforedraw)
- [clear](FillTriangleShader.md#clear)
- [drawTriangle](FillTriangleShader.md#drawtriangle)
- [fillPoly](FillTriangleShader.md#fillpoly)
- [flush](FillTriangleShader.md#flush)
- [getUniformLocation](FillTriangleShader.md#getuniformlocation)
- [init](FillTriangleShader.md#init)
- [onEntityCreation](FillTriangleShader.md#onentitycreation)
- [onEntityDestruction](FillTriangleShader.md#onentitydestruction)
- [postRender](FillTriangleShader.md#postrender)
- [preRender](FillTriangleShader.md#prerender)
- [pushMultiVertex](FillTriangleShader.md#pushmultivertex)
- [pushVertex](FillTriangleShader.md#pushvertex)
- [render](FillTriangleShader.md#render)
- [setBufferToAttribute](FillTriangleShader.md#setbuffertoattribute)
- [setUniform](FillTriangleShader.md#setuniform)
- [shouldDraw](FillTriangleShader.md#shoulddraw)
- [use](FillTriangleShader.md#use)

## Constructors

### constructor

• **new FillTriangleShader**(`gl`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGL2RenderingContext` |

#### Overrides

[Shader](Shader.md).[constructor](Shader.md#constructor)

#### Defined in

[renderer/src/webgl/shaders/FillTriangle.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/FillTriangle.ts#L9)

## Properties

### attributes

• `Protected` `Readonly` **attributes**: `Map`<`string`, `Attribute`\>

#### Inherited from

[Shader](Shader.md).[attributes](Shader.md#attributes)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:58](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L58)

___

### camera

• `Protected` **camera**: [`Camera`](Camera.md)

#### Inherited from

[Shader](Shader.md).[camera](Shader.md#camera)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:55](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L55)

___

### component

• `Optional` **component**: `Constructor`<`Component`\>

#### Inherited from

[Shader](Shader.md).[component](Shader.md#component)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:67](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L67)

___

### drawFunction

• `Protected` `Readonly` **drawFunction**: `DrawFunctionType`

#### Inherited from

[Shader](Shader.md).[drawFunction](Shader.md#drawfunction)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:65](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L65)

___

### elemNumber

• `Protected` **elemNumber**: `number` = `0`

#### Inherited from

[Shader](Shader.md).[elemNumber](Shader.md#elemnumber)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:64](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L64)

___

### gl

• `Protected` `Readonly` **gl**: `WebGL2RenderingContext`

#### Inherited from

[Shader](Shader.md).[gl](Shader.md#gl)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:54](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L54)

___

### logger

• `Protected` `Readonly` **logger**: `Logger`

#### Inherited from

[Shader](Shader.md).[logger](Shader.md#logger)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:66](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L66)

___

### maxElements

• `Protected` `Readonly` **maxElements**: `number`

#### Inherited from

[Shader](Shader.md).[maxElements](Shader.md#maxelements)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:63](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L63)

___

### program

• `Protected` `Readonly` **program**: `WebGLProgram`

#### Inherited from

[Shader](Shader.md).[program](Shader.md#program)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:56](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L56)

___

### uniforms

• `Protected` `Readonly` **uniforms**: `Map`<`string`, `WebGLUniformLocation`\>

#### Inherited from

[Shader](Shader.md).[uniforms](Shader.md#uniforms)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:62](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L62)

___

### vao

• `Protected` `Readonly` **vao**: `WebGLVertexArrayObject`

#### Inherited from

[Shader](Shader.md).[vao](Shader.md#vao)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:57](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L57)

## Methods

### beforeDraw

▸ `Protected` **beforeDraw**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[beforeDraw](Shader.md#beforedraw)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:229](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L229)

___

### clear

▸ `Protected` **clear**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[clear](Shader.md#clear)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:131](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L131)

___

### drawTriangle

▸ `Private` **drawTriangle**(`a`, `b`, `c`, `color`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `default` |
| `b` | `default` |
| `c` | `default` |
| `color` | [`Color`](../modules.md#color) |

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/FillTriangle.ts:27](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/FillTriangle.ts#L27)

___

### fillPoly

▸ **fillPoly**(`position`, `points`, `params`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `points` | `default`[] |
| `params` | `FillPolyOptions` |

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/FillTriangle.ts:42](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/FillTriangle.ts#L42)

___

### flush

▸ **flush**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[flush](Shader.md#flush)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:209](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L209)

___

### getUniformLocation

▸ `Protected` **getUniformLocation**(`uniformName`): `WebGLUniformLocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uniformName` | `string` |

#### Returns

`WebGLUniformLocation`

#### Inherited from

[Shader](Shader.md).[getUniformLocation](Shader.md#getuniformlocation)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:164](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L164)

___

### init

▸ **init**(`renderer`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `renderer` | [`Renderer`](Renderer.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Shader](Shader.md).[init](Shader.md#init)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:127](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L127)

___

### onEntityCreation

▸ **onEntityCreation**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[onEntityCreation](Shader.md#onentitycreation)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:117](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L117)

___

### onEntityDestruction

▸ **onEntityDestruction**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[onEntityDestruction](Shader.md#onentitydestruction)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:122](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L122)

___

### postRender

▸ **postRender**(`camera`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `camera` | [`Camera`](Camera.md) |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[postRender](Shader.md#postrender)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:152](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L152)

___

### preRender

▸ **preRender**(`camera`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `camera` | [`Camera`](Camera.md) |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[preRender](Shader.md#prerender)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:135](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L135)

___

### pushMultiVertex

▸ `Protected` **pushMultiVertex**(`vertex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vertex` | `Record`<`string`, (`number` \| `number`[])[]\> |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[pushMultiVertex](Shader.md#pushmultivertex)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:193](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L193)

___

### pushVertex

▸ `Protected` **pushVertex**(`vertex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vertex` | `Record`<`string`, `number` \| `number`[]\> |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[pushVertex](Shader.md#pushvertex)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:174](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L174)

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Overrides

[Shader](Shader.md).[render](Shader.md#render)

#### Defined in

[renderer/src/webgl/shaders/FillTriangle.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/FillTriangle.ts#L22)

___

### setBufferToAttribute

▸ `Protected` **setBufferToAttribute**(`name`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `WebGLBuffer` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[setBufferToAttribute](Shader.md#setbuffertoattribute)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:233](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L233)

___

### setUniform

▸ `Protected` **setUniform**(`name`, `type`, `value?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `TEXTURE` |
| `value?` | `WebGLTexture` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[setUniform](Shader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:245](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L245)

▸ `Protected` **setUniform**(`name`, `type`, `value?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `FV_4` |
| `value?` | `V8` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[setUniform](Shader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:250](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L250)

▸ `Protected` **setUniform**(`name`, `type`, `value?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `FV_4` |
| `value?` | `V4` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[setUniform](Shader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:251](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L251)

▸ `Protected` **setUniform**(`name`, `type`, `value?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `FV_2` |
| `value?` | `V2` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[setUniform](Shader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:252](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L252)

▸ `Protected` **setUniform**(`name`, `type`, `value?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `M4` |
| `value?` | `Projection` |

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[setUniform](Shader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:253](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L253)

___

### shouldDraw

▸ `Protected` **shouldDraw**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Shader](Shader.md).[shouldDraw](Shader.md#shoulddraw)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:291](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L291)

___

### use

▸ `Protected` **use**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[use](Shader.md#use)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:295](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L295)
