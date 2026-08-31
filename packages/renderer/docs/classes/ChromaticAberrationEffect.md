[@mythor/renderer](../README.md) / [Exports](../modules.md) / ChromaticAberrationEffect

# Class: ChromaticAberrationEffect

## Hierarchy

- [`PostProcessEffect`](PostProcessEffect.md)

  ↳ **`ChromaticAberrationEffect`**

## Table of contents

### Constructors

- [constructor](ChromaticAberrationEffect.md#constructor)

### Properties

- [enabled](ChromaticAberrationEffect.md#enabled)
- [gl](ChromaticAberrationEffect.md#gl)
- [strength](ChromaticAberrationEffect.md#strength)
- [strengthUniform](ChromaticAberrationEffect.md#strengthuniform)

### Methods

- [apply](ChromaticAberrationEffect.md#apply)
- [getUniformLocation](ChromaticAberrationEffect.md#getuniformlocation)
- [init](ChromaticAberrationEffect.md#init)
- [onInit](ChromaticAberrationEffect.md#oninit)
- [setUniforms](ChromaticAberrationEffect.md#setuniforms)

## Constructors

### constructor

• **new ChromaticAberrationEffect**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `ChromaticAberrationEffectOptions` |

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[constructor](PostProcessEffect.md#constructor)

#### Defined in

[renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts:12](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts#L12)

## Properties

### enabled

• **enabled**: `boolean` = `true`

#### Inherited from

[PostProcessEffect](PostProcessEffect.md).[enabled](PostProcessEffect.md#enabled)

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:20](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L20)

___

### gl

• `Protected` **gl**: `WebGL2RenderingContext`

#### Inherited from

[PostProcessEffect](PostProcessEffect.md).[gl](PostProcessEffect.md#gl)

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L14)

___

### strength

• **strength**: `number`

#### Defined in

[renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts#L10)

___

### strengthUniform

• `Private` **strengthUniform**: `WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts#L9)

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

#### Inherited from

[PostProcessEffect](PostProcessEffect.md).[apply](PostProcessEffect.md#apply)

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

#### Inherited from

[PostProcessEffect](PostProcessEffect.md).[getUniformLocation](PostProcessEffect.md#getuniformlocation)

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

#### Inherited from

[PostProcessEffect](PostProcessEffect.md).[init](PostProcessEffect.md#init)

#### Defined in

[renderer/src/postprocessing/PostProcessEffect.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessEffect.ts#L26)

___

### onInit

▸ `Protected` **onInit**(): `void`

#### Returns

`void`

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[onInit](PostProcessEffect.md#oninit)

#### Defined in

[renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts#L17)

___

### setUniforms

▸ `Protected` **setUniforms**(): `void`

#### Returns

`void`

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[setUniforms](PostProcessEffect.md#setuniforms)

#### Defined in

[renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts:21](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/ChromaticAberrationEffect.ts#L21)
