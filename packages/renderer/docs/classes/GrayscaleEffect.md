[@mythor/renderer](../README.md) / [Exports](../modules.md) / GrayscaleEffect

# Class: GrayscaleEffect

## Hierarchy

- [`PostProcessEffect`](PostProcessEffect.md)

  ↳ **`GrayscaleEffect`**

## Table of contents

### Constructors

- [constructor](GrayscaleEffect.md#constructor)

### Properties

- [enabled](GrayscaleEffect.md#enabled)
- [gl](GrayscaleEffect.md#gl)
- [intensity](GrayscaleEffect.md#intensity)
- [intensityUniform](GrayscaleEffect.md#intensityuniform)

### Methods

- [apply](GrayscaleEffect.md#apply)
- [getUniformLocation](GrayscaleEffect.md#getuniformlocation)
- [init](GrayscaleEffect.md#init)
- [onInit](GrayscaleEffect.md#oninit)
- [setUniforms](GrayscaleEffect.md#setuniforms)

## Constructors

### constructor

• **new GrayscaleEffect**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `GrayscaleEffectOptions` |

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[constructor](PostProcessEffect.md#constructor)

#### Defined in

[renderer/src/postprocessing/effects/GrayscaleEffect.ts:12](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/GrayscaleEffect.ts#L12)

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

### intensity

• **intensity**: `number`

#### Defined in

[renderer/src/postprocessing/effects/GrayscaleEffect.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/GrayscaleEffect.ts#L10)

___

### intensityUniform

• `Private` **intensityUniform**: `WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/effects/GrayscaleEffect.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/GrayscaleEffect.ts#L9)

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

[renderer/src/postprocessing/effects/GrayscaleEffect.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/GrayscaleEffect.ts#L17)

___

### setUniforms

▸ `Protected` **setUniforms**(): `void`

#### Returns

`void`

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[setUniforms](PostProcessEffect.md#setuniforms)

#### Defined in

[renderer/src/postprocessing/effects/GrayscaleEffect.ts:21](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/GrayscaleEffect.ts#L21)
