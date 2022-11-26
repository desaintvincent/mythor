[@mythor/renderer](../README.md) / [Exports](../modules.md) / Texture

# Class: Texture

## Table of contents

### Constructors

- [constructor](Texture.md#constructor)

### Properties

- [alphaTest](Texture.md#alphatest)
- [glTexture](Texture.md#gltexture)
- [size](Texture.md#size)
- [smooth](Texture.md#smooth)
- [source](Texture.md#source)

### Accessors

- [webGLTexture](Texture.md#webgltexture)

## Constructors

### constructor

• **new Texture**(`source`, `gl`, `alphaTest?`, `smooth?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `source` | `HTMLCanvasElement` \| `HTMLImageElement` | `undefined` |
| `gl` | `WebGL2RenderingContext` | `undefined` |
| `alphaTest` | `number` | `0` |
| `smooth` | `boolean` | `true` |

#### Defined in

[renderer/src/objects/Texture.ts:10](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L10)

## Properties

### alphaTest

• `Private` `Readonly` **alphaTest**: `number`

#### Defined in

[renderer/src/objects/Texture.ts:5](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L5)

___

### glTexture

• `Private` `Readonly` **glTexture**: `WebGLTexture` = `0`

#### Defined in

[renderer/src/objects/Texture.ts:8](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L8)

___

### size

• `Readonly` **size**: `default`

#### Defined in

[renderer/src/objects/Texture.ts:7](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L7)

___

### smooth

• `Private` `Readonly` **smooth**: `boolean`

#### Defined in

[renderer/src/objects/Texture.ts:6](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L6)

___

### source

• `Private` `Readonly` **source**: `HTMLCanvasElement` \| `HTMLImageElement`

#### Defined in

[renderer/src/objects/Texture.ts:4](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L4)

## Accessors

### webGLTexture

• `get` **webGLTexture**(): `WebGLTexture`

#### Returns

`WebGLTexture`

#### Defined in

[renderer/src/objects/Texture.ts:61](https://github.com/desaintvincent/mythor/blob/5baab6f/packages/renderer/src/objects/Texture.ts#L61)
