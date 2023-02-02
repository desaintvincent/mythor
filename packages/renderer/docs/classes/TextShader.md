[@mythor/renderer](../README.md) / [Exports](../modules.md) / TextShader

# Class: TextShader

## Hierarchy

- [`SpriteShader`](SpriteShader.md)

  ↳ **`TextShader`**

## Table of contents

### Constructors

- [constructor](TextShader.md#constructor)

### Properties

- [attributes](TextShader.md#attributes)
- [camera](TextShader.md#camera)
- [component](TextShader.md#component)
- [currentFont](TextShader.md#currentfont)
- [currentTexture](TextShader.md#currenttexture)
- [drawFunction](TextShader.md#drawfunction)
- [elemNumber](TextShader.md#elemnumber)
- [gl](TextShader.md#gl)
- [maxElements](TextShader.md#maxelements)
- [program](TextShader.md#program)
- [uniforms](TextShader.md#uniforms)
- [vao](TextShader.md#vao)

### Methods

- [beforeDraw](TextShader.md#beforedraw)
- [clear](TextShader.md#clear)
- [drawLetter](TextShader.md#drawletter)
- [flush](TextShader.md#flush)
- [getUniformLocation](TextShader.md#getuniformlocation)
- [init](TextShader.md#init)
- [lineHeight](TextShader.md#lineheight)
- [onEntityCreation](TextShader.md#onentitycreation)
- [postRender](TextShader.md#postrender)
- [preRender](TextShader.md#prerender)
- [pushMultiVertex](TextShader.md#pushmultivertex)
- [pushVertex](TextShader.md#pushvertex)
- [render](TextShader.md#render)
- [setBufferToAttribute](TextShader.md#setbuffertoattribute)
- [setUniform](TextShader.md#setuniform)
- [shouldDraw](TextShader.md#shoulddraw)
- [text](TextShader.md#text)
- [use](TextShader.md#use)

## Constructors

### constructor

• **new TextShader**(`gl`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGL2RenderingContext` |

#### Overrides

[SpriteShader](SpriteShader.md).[constructor](SpriteShader.md#constructor)

#### Defined in

[renderer/src/webgl/shaders/Text.ts:13](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L13)

## Properties

### attributes

• `Protected` `Readonly` **attributes**: `Map`<`string`, `Attribute`\>

#### Inherited from

[SpriteShader](SpriteShader.md).[attributes](SpriteShader.md#attributes)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:50](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L50)

___

### camera

• `Protected` **camera**: [`Camera`](Camera.md)

#### Inherited from

[SpriteShader](SpriteShader.md).[camera](SpriteShader.md#camera)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:47](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L47)

___

### component

• `Optional` **component**: `Constructor`<`Component`\>

#### Inherited from

[SpriteShader](SpriteShader.md).[component](SpriteShader.md#component)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:58](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L58)

___

### currentFont

• `Private` `Optional` **currentFont**: `default`

#### Defined in

[renderer/src/webgl/shaders/Text.ts:11](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L11)

___

### currentTexture

• `Protected` **currentTexture**: [`Texture`](Texture.md)

#### Inherited from

[SpriteShader](SpriteShader.md).[currentTexture](SpriteShader.md#currenttexture)

#### Defined in

[renderer/src/webgl/shaders/Sprite.ts:15](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Sprite.ts#L15)

___

### drawFunction

• `Protected` `Readonly` **drawFunction**: `DrawFunctionType`

#### Inherited from

[SpriteShader](SpriteShader.md).[drawFunction](SpriteShader.md#drawfunction)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:57](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L57)

___

### elemNumber

• `Protected` **elemNumber**: `number` = `0`

#### Inherited from

[SpriteShader](SpriteShader.md).[elemNumber](SpriteShader.md#elemnumber)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:56](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L56)

___

### gl

• `Protected` `Readonly` **gl**: `WebGL2RenderingContext`

#### Inherited from

[SpriteShader](SpriteShader.md).[gl](SpriteShader.md#gl)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:46](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L46)

___

### maxElements

• `Protected` `Readonly` **maxElements**: `number`

#### Inherited from

[SpriteShader](SpriteShader.md).[maxElements](SpriteShader.md#maxelements)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:55](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L55)

___

### program

• `Protected` `Readonly` **program**: `WebGLProgram`

#### Inherited from

[SpriteShader](SpriteShader.md).[program](SpriteShader.md#program)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:48](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L48)

___

### uniforms

• `Protected` `Readonly` **uniforms**: `Map`<`string`, `WebGLUniformLocation`\>

#### Inherited from

[SpriteShader](SpriteShader.md).[uniforms](SpriteShader.md#uniforms)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:54](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L54)

___

### vao

• `Protected` `Readonly` **vao**: `WebGLVertexArrayObject`

#### Inherited from

[SpriteShader](SpriteShader.md).[vao](SpriteShader.md#vao)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:49](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L49)

## Methods

### beforeDraw

▸ `Protected` **beforeDraw**(): `void`

#### Returns

`void`

#### Overrides

[SpriteShader](SpriteShader.md).[beforeDraw](SpriteShader.md#beforedraw)

#### Defined in

[renderer/src/webgl/shaders/Text.ts:111](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L111)

___

### clear

▸ `Protected` **clear**(): `void`

#### Returns

`void`

#### Inherited from

[SpriteShader](SpriteShader.md).[clear](SpriteShader.md#clear)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:116](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L116)

___

### drawLetter

▸ `Protected` **drawLetter**(`letter`, `position`, `__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `letter` | `string` |
| `position` | `default` |
| `__namedParameters` | `Object` |
| `__namedParameters.color` | [`Color`](../modules.md#color) |
| `__namedParameters.font` | `default` |
| `__namedParameters.size?` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/Text.ts:81](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L81)

___

### flush

▸ **flush**(): `void`

#### Returns

`void`

#### Inherited from

[SpriteShader](SpriteShader.md).[flush](SpriteShader.md#flush)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:194](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L194)

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

[SpriteShader](SpriteShader.md).[getUniformLocation](SpriteShader.md#getuniformlocation)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:149](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L149)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[SpriteShader](SpriteShader.md).[init](SpriteShader.md#init)

#### Defined in

[renderer/src/webgl/shaders/Text.ts:17](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L17)

___

### lineHeight

▸ **lineHeight**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/webgl/shaders/Text.ts:73](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L73)

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

[SpriteShader](SpriteShader.md).[onEntityCreation](SpriteShader.md#onentitycreation)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:107](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L107)

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

[SpriteShader](SpriteShader.md).[postRender](SpriteShader.md#postrender)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:137](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L137)

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

[SpriteShader](SpriteShader.md).[preRender](SpriteShader.md#prerender)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:120](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L120)

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

[SpriteShader](SpriteShader.md).[pushMultiVertex](SpriteShader.md#pushmultivertex)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:178](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L178)

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

[SpriteShader](SpriteShader.md).[pushVertex](SpriteShader.md#pushvertex)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:159](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L159)

___

### render

▸ **render**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Overrides

[SpriteShader](SpriteShader.md).[render](SpriteShader.md#render)

#### Defined in

[renderer/src/webgl/shaders/Text.ts:25](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L25)

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

[SpriteShader](SpriteShader.md).[setBufferToAttribute](SpriteShader.md#setbuffertoattribute)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:218](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L218)

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

[SpriteShader](SpriteShader.md).[setUniform](SpriteShader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:230](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L230)

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

[SpriteShader](SpriteShader.md).[setUniform](SpriteShader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:235](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L235)

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

[SpriteShader](SpriteShader.md).[setUniform](SpriteShader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:236](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L236)

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

[SpriteShader](SpriteShader.md).[setUniform](SpriteShader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:237](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L237)

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

[SpriteShader](SpriteShader.md).[setUniform](SpriteShader.md#setuniform)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:238](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L238)

___

### shouldDraw

▸ `Protected` **shouldDraw**(): `boolean`

#### Returns

`boolean`

#### Overrides

[SpriteShader](SpriteShader.md).[shouldDraw](SpriteShader.md#shoulddraw)

#### Defined in

[renderer/src/webgl/shaders/Text.ts:119](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L119)

___

### text

▸ **text**(`position`, `text`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |
| `text` | `string` |
| `options?` | `Object` |
| `options.color?` | [`Color`](../modules.md#color) |
| `options.font?` | `default` |
| `options.size?` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/webgl/shaders/Text.ts:39](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Text.ts#L39)

___

### use

▸ `Protected` **use**(): `void`

#### Returns

`void`

#### Inherited from

[SpriteShader](SpriteShader.md).[use](SpriteShader.md#use)

#### Defined in

[renderer/src/webgl/shaders/Shader.ts:280](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/webgl/shaders/Shader.ts#L280)
