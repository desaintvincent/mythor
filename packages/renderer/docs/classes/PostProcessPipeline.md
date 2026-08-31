[@mythor/renderer](../README.md) / [Exports](../modules.md) / PostProcessPipeline

# Class: PostProcessPipeline

## Table of contents

### Constructors

- [constructor](PostProcessPipeline.md#constructor)

### Properties

- [effects](PostProcessPipeline.md#effects)
- [gl](PostProcessPipeline.md#gl)
- [size](PostProcessPipeline.md#size)
- [targets](PostProcessPipeline.md#targets)

### Methods

- [ensureTargets](PostProcessPipeline.md#ensuretargets)
- [getEntryTarget](PostProcessPipeline.md#getentrytarget)
- [hasEnabledEffects](PostProcessPipeline.md#hasenabledeffects)
- [render](PostProcessPipeline.md#render)

## Constructors

### constructor

• **new PostProcessPipeline**(`gl`, `effects`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gl` | `WebGL2RenderingContext` |
| `effects` | [`PostProcessEffect`](PostProcessEffect.md)[] |

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:11](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L11)

## Properties

### effects

• `Private` `Readonly` **effects**: [`PostProcessEffect`](PostProcessEffect.md)[]

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L7)

___

### gl

• `Private` `Readonly` **gl**: `WebGL2RenderingContext`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:6](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L6)

___

### size

• `Private` **size**: ``null`` \| `default` = `null`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L9)

___

### targets

• `Private` **targets**: ``null`` \| [`RenderTarget`, `RenderTarget`] = `null`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L8)

## Methods

### ensureTargets

▸ `Private` **ensureTargets**(`size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L17)

___

### getEntryTarget

▸ **getEntryTarget**(`size`): `RenderTarget`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `default` |

#### Returns

`RenderTarget`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:34](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L34)

___

### hasEnabledEffects

▸ **hasEnabledEffects**(): `boolean`

#### Returns

`boolean`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:40](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L40)

___

### render

▸ **render**(`size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/postprocessing/PostProcessPipeline.ts:44](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/postprocessing/PostProcessPipeline.ts#L44)
