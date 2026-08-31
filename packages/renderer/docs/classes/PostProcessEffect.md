[@mythor/renderer](../README.md) / [Exports](../modules.md) / PostProcessEffect

# Class: PostProcessEffect

## Hierarchy

- **`PostProcessEffect`**

  ↳ [`GrayscaleEffect`](GrayscaleEffect.md)

  ↳ [`VignetteEffect`](VignetteEffect.md)

  ↳ [`ChromaticAberrationEffect`](ChromaticAberrationEffect.md)

  ↳ [`BlurEffect`](BlurEffect.md)

## Table of contents

### Constructors

- [constructor](PostProcessEffect.md#constructor)

### Properties

- [enabled](PostProcessEffect.md#enabled)
- [fragmentShader](PostProcessEffect.md#fragmentshader)
- [gl](PostProcessEffect.md#gl)
- [program](PostProcessEffect.md#program)
- [resolutionUniform](PostProcessEffect.md#resolutionuniform)
- [textureUniform](PostProcessEffect.md#textureuniform)
- [vao](PostProcessEffect.md#vao)

### Methods

- [apply](PostProcessEffect.md#apply)
- [getUniformLocation](PostProcessEffect.md#getuniformlocation)
- [init](PostProcessEffect.md#init)
- [onInit](PostProcessEffect.md#oninit)
- [setUniforms](PostProcessEffect.md#setuniforms)

## Constructors

### constructor

• **new PostProcessEffect**(`fragmentShader`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fragmentShader` | `string` |

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L22)

## Properties

### enabled

• **enabled**: `boolean` = `true`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:20](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L20)

___

### fragmentShader

• `Private` `Readonly` **fragmentShader**: `string`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L15)

___

### gl

• `Protected` **gl**: `WebGL2RenderingContext`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L14)

___

### program

• `Private` **program**: `WebGLProgram`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L16)

___

### resolutionUniform

• `Private` **resolutionUniform**: ``null`` \| `WebGLUniformLocation` = `null`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L19)

___

### textureUniform

• `Private` **textureUniform**: `WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L18)

___

### vao

• `Private` **vao**: `WebGLVertexArrayObject`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L17)

## Methods

### apply

▸ **apply**(`inputTexture`, `target`, `resolution`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputTexture` | `WebGLTexture` |
| `target` | ``null`` \| `RenderTarget` |
| `resolution` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:63](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L63)

___

### getUniformLocation

▸ `Protected` **getUniformLocation**(`name`): `WebGLUniformLocation`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:49](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L49)

___

### init

▸ **init**(`gl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGL2RenderingContext` |

#### Returns

`void`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L26)

___

### onInit

▸ `Protected` **onInit**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:45](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L45)

___

### setUniforms

▸ `Protected` **setUniforms**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:59](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L59)
