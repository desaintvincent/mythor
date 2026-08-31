[@mythor/renderer](../README.md) / [Exports](../modules.md) / Shader

# Class: Shader

## Hierarchy

- **`Shader`**

  ↳ [`LineShader`](LineShader.md)

  ↳ [`CircleShader`](CircleShader.md)

  ↳ [`FillRectShader`](FillRectShader.md)

  ↳ [`FillTriangleShader`](FillTriangleShader.md)

  ↳ [`SpriteShader`](SpriteShader.md)

## Table of contents

### Constructors

- [constructor](Shader.md#constructor)

### Properties

- [attributes](Shader.md#attributes)
- [camera](Shader.md#camera)
- [component](Shader.md#component)
- [drawFunction](Shader.md#drawfunction)
- [elemNumber](Shader.md#elemnumber)
- [gl](Shader.md#gl)
- [logger](Shader.md#logger)
- [maxElements](Shader.md#maxelements)
- [program](Shader.md#program)
- [uniforms](Shader.md#uniforms)
- [vao](Shader.md#vao)

### Methods

- [beforeDraw](Shader.md#beforedraw)
- [clear](Shader.md#clear)
- [flush](Shader.md#flush)
- [getUniformLocation](Shader.md#getuniformlocation)
- [init](Shader.md#init)
- [onEntityCreation](Shader.md#onentitycreation)
- [onEntityDestruction](Shader.md#onentitydestruction)
- [postRender](Shader.md#postrender)
- [preRender](Shader.md#prerender)
- [pushMultiVertex](Shader.md#pushmultivertex)
- [pushVertex](Shader.md#pushvertex)
- [render](Shader.md#render)
- [setBufferToAttribute](Shader.md#setbuffertoattribute)
- [setUniform](Shader.md#setuniform)
- [shouldDraw](Shader.md#shoulddraw)
- [use](Shader.md#use)

## Constructors

### constructor

• **new Shader**(`gl`, `vertexShader`, `fragmentShader`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGL2RenderingContext` |
| `vertexShader` | `string` |
| `fragmentShader` | `string` |
| `options?` | `ShaderOptions` |

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:69](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L69)

## Properties

### attributes

• `Protected` `Readonly` **attributes**: `Map`<`string`, `Attribute`\>

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:58](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L58)

___

### camera

• `Protected` **camera**: [`Camera`](Camera.md)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:55](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L55)

___

### component

• `Optional` **component**: `Constructor`<`Component`\>

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:67](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L67)

___

### drawFunction

• `Protected` `Readonly` **drawFunction**: `DrawFunctionType`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:65](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L65)

___

### elemNumber

• `Protected` **elemNumber**: `number` = `0`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:64](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L64)

___

### gl

• `Protected` `Readonly` **gl**: `WebGL2RenderingContext`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:54](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L54)

___

### logger

• `Protected` `Readonly` **logger**: `Logger`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:66](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L66)

___

### maxElements

• `Protected` `Readonly` **maxElements**: `number`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:63](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L63)

___

### program

• `Protected` `Readonly` **program**: `WebGLProgram`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:56](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L56)

___

### uniforms

• `Protected` `Readonly` **uniforms**: `Map`<`string`, `WebGLUniformLocation`\>

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:62](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L62)

___

### vao

• `Protected` `Readonly` **vao**: `WebGLVertexArrayObject`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:57](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L57)

## Methods

### beforeDraw

▸ `Protected` **beforeDraw**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:229](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L229)

___

### clear

▸ `Protected` **clear**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:131](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L131)

___

### flush

▸ **flush**(): `void`

#### Returns

`void`

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

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:174](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L174)

___

### render

▸ **render**(`entity`, `camera`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

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

[renderer/src/webgl/shaders/Shader.ts:139](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L139)

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

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:253](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L253)

___

### shouldDraw

▸ `Protected` **shouldDraw**(): `boolean`

#### Returns

`boolean`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:291](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L291)

___

### use

▸ `Protected` **use**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:295](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/webgl/shaders/Shader.ts#L295)
