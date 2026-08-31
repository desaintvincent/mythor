[@mythor/renderer](../README.md) / [Exports](../modules.md) / VignetteEffect

# Class: VignetteEffect

## Hierarchy

- [`PostProcessEffect`](PostProcessEffect.md)

  ↳ **`VignetteEffect`**

## Table of contents

### Constructors

- [constructor](VignetteEffect.md#constructor)

### Properties

- [color](VignetteEffect.md#color)
- [colorUniform](VignetteEffect.md#coloruniform)
- [enabled](VignetteEffect.md#enabled)
- [gl](VignetteEffect.md#gl)
- [radius](VignetteEffect.md#radius)
- [radiusUniform](VignetteEffect.md#radiusuniform)
- [softness](VignetteEffect.md#softness)
- [softnessUniform](VignetteEffect.md#softnessuniform)

### Methods

- [apply](VignetteEffect.md#apply)
- [getUniformLocation](VignetteEffect.md#getuniformlocation)
- [init](VignetteEffect.md#init)
- [onInit](VignetteEffect.md#oninit)
- [setUniforms](VignetteEffect.md#setuniforms)

## Constructors

### constructor

• **new VignetteEffect**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `VignetteEffectOptions` |

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[constructor](PostProcessEffect.md#constructor)

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L18)

## Properties

### color

• **color**: [`number`, `number`, `number`, `number`]

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L16)

___

### colorUniform

• `Private` **colorUniform**: `WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:13](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L13)

___

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

### radius

• **radius**: `number`

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L14)

___

### radiusUniform

• `Private` **radiusUniform**: `WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:11](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L11)

___

### softness

• **softness**: `number`

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L15)

___

### softnessUniform

• `Private` **softnessUniform**: `WebGLUniformLocation`

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:12](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L12)

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

[renderer/src/postprocessing/effects/VignetteEffect.ts:25](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L25)

___

### setUniforms

▸ `Protected` **setUniforms**(): `void`

#### Returns

`void`

#### Overrides

[PostProcessEffect](PostProcessEffect.md).[setUniforms](PostProcessEffect.md#setuniforms)

#### Defined in

[renderer/src/postprocessing/effects/VignetteEffect.ts:31](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/effects/VignetteEffect.ts#L31)
