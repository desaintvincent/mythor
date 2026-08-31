[@mythor/audio](../README.md) / [Exports](../modules.md) / PlayOptions

# Interface: PlayOptions

## Table of contents

### Properties

- [channel](PlayOptions.md#channel)
- [loop](PlayOptions.md#loop)
- [spatial](PlayOptions.md#spatial)
- [volume](PlayOptions.md#volume)

## Properties

### channel

• `Optional` **channel**: `string`

#### Defined in

[audio/src/types.ts:24](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L24)

___

### loop

• `Optional` **loop**: `boolean`

#### Defined in

[audio/src/types.ts:27](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L27)

___

### spatial

• `Optional` **spatial**: `boolean`

When `true`, the instance is routed through a `StereoPannerNode` and its
gain/pan are expected to be driven every frame via
`AudioManager.updateSpatial()` (done automatically by `AudioSystem` for
entities carrying an `AudioSource`). Defaults to `false`.

#### Defined in

[audio/src/types.ts:34](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L34)

___

### volume

• `Optional` **volume**: `number`

`0`..`1`, multiplied with the channel and master volume. Defaults to `1`.

#### Defined in

[audio/src/types.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L26)
