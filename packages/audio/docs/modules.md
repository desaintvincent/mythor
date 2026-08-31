[@mythor/audio](README.md) / Exports

# @mythor/audio

## Table of contents

### Classes

- [AudioListener](classes/AudioListener.md)
- [AudioManager](classes/AudioManager.md)
- [AudioSource](classes/AudioSource.md)
- [AudioSystem](classes/AudioSystem.md)

### Interfaces

- [AudioListenerOptions](interfaces/AudioListenerOptions.md)
- [AudioManagerOptions](interfaces/AudioManagerOptions.md)
- [AudioSourceOptions](interfaces/AudioSourceOptions.md)
- [PlayOptions](interfaces/PlayOptions.md)
- [SpatialFalloffOptions](interfaces/SpatialFalloffOptions.md)

### Type Aliases

- [AudioChannel](modules.md#audiochannel)
- [AudioInstanceHandle](modules.md#audioinstancehandle)
- [DistanceModel](modules.md#distancemodel)

### Variables

- [AudioChannels](modules.md#audiochannels)

## Type Aliases

### AudioChannel

Ƭ **AudioChannel**: `string`

Channel a sound is routed through. Modeled as a plain `string` (like
`AssetManifestEntry.type` in `@mythor/assets`) instead of a closed enum, so
consumers can register/use their own channel names without needing changes
in this package. `AudioChannels` only lists the defaults `AudioManager`
assumes callers will commonly want.

#### Defined in

[audio/src/definitions/AudioChannel.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/definitions/AudioChannel.ts#L8)

___

### AudioInstanceHandle

Ƭ **AudioInstanceHandle**: `number`

Opaque handle returned by `AudioManager.play()`, used to `stop`/`pause`/
`resume` a specific playing instance and, for spatial instances, to push
updated pan/gain values from `AudioSystem`.

#### Defined in

[audio/src/types.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L8)

___

### DistanceModel

Ƭ **DistanceModel**: ``"linear"`` \| ``"inverse"`` \| ``"exponential"``

#### Defined in

[audio/src/types.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L10)

## Variables

### AudioChannels

• `Const` **AudioChannels**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Music` | ``"music"`` |
| `Sfx` | ``"sfx"`` |
| `Ui` | ``"ui"`` |

#### Defined in

[audio/src/definitions/AudioChannel.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/definitions/AudioChannel.ts#L10)
