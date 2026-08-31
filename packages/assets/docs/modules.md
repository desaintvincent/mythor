[@mythor/assets](README.md) / Exports

# @mythor/assets

## Table of contents

### Classes

- [AssetManager](classes/AssetManager.md)

### Interfaces

- [AssetManifestEntry](interfaces/AssetManifestEntry.md)

### Type Aliases

- [AssetLoader](modules.md#assetloader)
- [AssetProgressCallback](modules.md#assetprogresscallback)

### Functions

- [loadAudio](modules.md#loadaudio)
- [loadImage](modules.md#loadimage)
- [loadJson](modules.md#loadjson)

## Type Aliases

### AssetLoader

Ƭ **AssetLoader**<`T`\>: (`src`: `string`) => `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Type declaration

▸ (`src`): `Promise`<`T`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `string` |

##### Returns

`Promise`<`T`\>

#### Defined in

[assets/src/types.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/types.ts#L7)

___

### AssetProgressCallback

Ƭ **AssetProgressCallback**: (`current`: `number`, `total`: `number`) => `void`

#### Type declaration

▸ (`current`, `total`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `number` |
| `total` | `number` |

##### Returns

`void`

#### Defined in

[assets/src/types.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/types.ts#L9)

## Functions

### loadAudio

▸ **loadAudio**(`src`): `Promise`<`ArrayBuffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `string` |

#### Returns

`Promise`<`ArrayBuffer`\>

#### Defined in

[assets/src/loaders/audioLoader.ts:1](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/loaders/audioLoader.ts#L1)

___

### loadImage

▸ **loadImage**(`src`): `Promise`<`HTMLImageElement`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `string` |

#### Returns

`Promise`<`HTMLImageElement`\>

#### Defined in

[assets/src/loaders/imageLoader.ts:1](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/loaders/imageLoader.ts#L1)

___

### loadJson

▸ **loadJson**<`T`\>(`src`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `src` | `string` |

#### Returns

`Promise`<`T`\>

#### Defined in

[assets/src/loaders/jsonLoader.ts:1](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/loaders/jsonLoader.ts#L1)
