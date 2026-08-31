[@mythor/audio](../README.md) / [Exports](../modules.md) / SpatialFalloffOptions

# Interface: SpatialFalloffOptions

## Table of contents

### Properties

- [distanceModel](SpatialFalloffOptions.md#distancemodel)
- [maxDistance](SpatialFalloffOptions.md#maxdistance)
- [refDistance](SpatialFalloffOptions.md#refdistance)
- [rolloffFactor](SpatialFalloffOptions.md#rollofffactor)

## Properties

### distanceModel

• `Optional` **distanceModel**: [`DistanceModel`](../modules.md#distancemodel)

Defaults to `'inverse'`.

#### Defined in

[audio/src/types.ts:20](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L20)

___

### maxDistance

• `Optional` **maxDistance**: `number`

Distance beyond which volume reaches `0`. Defaults to `1000`.

#### Defined in

[audio/src/types.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L16)

___

### refDistance

• `Optional` **refDistance**: `number`

Distance under which volume is at its maximum. Defaults to `1`.

#### Defined in

[audio/src/types.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L14)

___

### rolloffFactor

• `Optional` **rolloffFactor**: `number`

Defaults to `1`. Only used by the `linear` and `exponential` models.

#### Defined in

[audio/src/types.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/types.ts#L18)
