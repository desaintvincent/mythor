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

[renderer/src/webgl/shaders/FillTriangle.ts:9](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/FillTriangle.ts#L9)

## Properties

### attributes

• `Protected` `Readonly` **attributes**: `Map`<`string`, `Attribute`\>

#### Inherited from

[Shader](Shader.md).[attributes](Shader.md#attributes)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:50](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L50)

___

### camera

• `Protected` **camera**: [`Camera`](Camera.md)

#### Inherited from

[Shader](Shader.md).[camera](Shader.md#camera)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:47](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L47)

___

### component

• `Optional` **component**: `Constructor`<`Component`\>

#### Inherited from

[Shader](Shader.md).[component](Shader.md#component)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:58](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L58)

___

### drawFunction

• `Protected` `Readonly` **drawFunction**: `DrawFunctionType`

#### Inherited from

[Shader](Shader.md).[drawFunction](Shader.md#drawfunction)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:57](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L57)

___

### elemNumber

• `Protected` **elemNumber**: `number` = `0`

#### Inherited from

[Shader](Shader.md).[elemNumber](Shader.md#elemnumber)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:56](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L56)

___

### gl

• `Protected` `Readonly` **gl**: `WebGL2RenderingContext`

#### Inherited from

[Shader](Shader.md).[gl](Shader.md#gl)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:46](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L46)

___

### maxElements

• `Protected` `Readonly` **maxElements**: `number`

#### Inherited from

[Shader](Shader.md).[maxElements](Shader.md#maxelements)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:55](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L55)

___

### program

• `Protected` `Readonly` **program**: `WebGLProgram`

#### Inherited from

[Shader](Shader.md).[program](Shader.md#program)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:48](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L48)

___

### uniforms

• `Protected` `Readonly` **uniforms**: `Map`<`string`, `WebGLUniformLocation`\>

#### Inherited from

[Shader](Shader.md).[uniforms](Shader.md#uniforms)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:54](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L54)

___

### vao

• `Protected` `Readonly` **vao**: `WebGLVertexArrayObject`

#### Inherited from

[Shader](Shader.md).[vao](Shader.md#vao)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:49](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L49)

## Methods

### beforeDraw

▸ `Protected` **beforeDraw**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[beforeDraw](Shader.md#beforedraw)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:214](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L214)

___

### clear

▸ `Protected` **clear**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[clear](Shader.md#clear)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:116](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L116)

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

[renderer/src/webgl/shaders/FillTriangle.ts:27](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/FillTriangle.ts#L27)

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

[renderer/src/webgl/shaders/FillTriangle.ts:42](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/FillTriangle.ts#L42)

___

### flush

▸ **flush**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[flush](Shader.md#flush)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:194](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L194)

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

[renderer/src/webgl/shaders/Shader.ts:149](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L149)

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

[renderer/src/webgl/shaders/Shader.ts:112](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L112)

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

[renderer/src/webgl/shaders/Shader.ts:107](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L107)

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

[renderer/src/webgl/shaders/Shader.ts:137](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L137)

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

[renderer/src/webgl/shaders/Shader.ts:120](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L120)

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

[renderer/src/webgl/shaders/Shader.ts:178](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L178)

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

[renderer/src/webgl/shaders/Shader.ts:159](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L159)

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Overrides

[Shader](Shader.md).[render](Shader.md#render)

#### Defined in

[renderer/src/webgl/shaders/FillTriangle.ts:22](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/FillTriangle.ts#L22)

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

[renderer/src/webgl/shaders/Shader.ts:218](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L218)

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

[renderer/src/webgl/shaders/Shader.ts:230](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L230)

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

[renderer/src/webgl/shaders/Shader.ts:235](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L235)

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

[renderer/src/webgl/shaders/Shader.ts:236](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L236)

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

[renderer/src/webgl/shaders/Shader.ts:237](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L237)

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

[renderer/src/webgl/shaders/Shader.ts:238](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L238)

___

### shouldDraw

▸ `Protected` **shouldDraw**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Shader](Shader.md).[shouldDraw](Shader.md#shoulddraw)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:276](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L276)

___

### use

▸ `Protected` **use**(): `void`

#### Returns

`void`

#### Inherited from

[Shader](Shader.md).[use](Shader.md#use)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:280](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/renderer/src/webgl/shaders/Shader.ts#L280)
