[@mythor/audio](../README.md) / [Exports](../modules.md) / AudioSource

# Class: AudioSource

Declarative sound emitter. Data-only: playback is entirely driven by
`AudioSystem`, which is the sole place allowed to read `_pendingPlay`/
`_pendingStop`/`handle` (same ownership rule as `@mythor/ui`'s `Button`,
whose derived state is only mutated by `ButtonSystem`).

Call `play()`/`stop()` to request playback; the actual `AudioManager`
call happens on the next `AudioSystem` update.

## Hierarchy

- `Component`

  ↳ **`AudioSource`**

## Table of contents

### Constructors

- [constructor](AudioSource.md#constructor)

### Properties

- [\_entity](AudioSource.md#_entity)
- [autoplay](AudioSource.md#autoplay)
- [autoplayed](AudioSource.md#autoplayed)
- [channel](AudioSource.md#channel)
- [distanceModel](AudioSource.md#distancemodel)
- [handle](AudioSource.md#handle)
- [key](AudioSource.md#key)
- [loop](AudioSource.md#loop)
- [maxDistance](AudioSource.md#maxdistance)
- [pendingPlay](AudioSource.md#pendingplay)
- [pendingStop](AudioSource.md#pendingstop)
- [refDistance](AudioSource.md#refdistance)
- [rolloffFactor](AudioSource.md#rollofffactor)
- [spatial](AudioSource.md#spatial)
- [volume](AudioSource.md#volume)
- [signature](AudioSource.md#signature)

### Methods

- [isPlaying](AudioSource.md#isplaying)
- [play](AudioSource.md#play)
- [stop](AudioSource.md#stop)

## Constructors

### constructor

• **new AudioSource**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`AudioSourceOptions`](../interfaces/AudioSourceOptions.md) |

#### Overrides

Component.constructor

#### Defined in

[audio/src/components/AudioSource.ts:48](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L48)

## Properties

### \_entity

• **\_entity**: `undefined` \| `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### autoplay

• **autoplay**: `boolean`

#### Defined in

[audio/src/components/AudioSource.ts:32](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L32)

___

### autoplayed

• **autoplayed**: `boolean` = `false`

owned by `AudioSystem`

#### Defined in

[audio/src/components/AudioSource.ts:42](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L42)

___

### channel

• **channel**: `string`

#### Defined in

[audio/src/components/AudioSource.ts:29](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L29)

___

### distanceModel

• **distanceModel**: [`DistanceModel`](../modules.md#distancemodel)

#### Defined in

[audio/src/components/AudioSource.ts:37](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L37)

___

### handle

• `Optional` **handle**: `number`

owned by `AudioSystem`

#### Defined in

[audio/src/components/AudioSource.ts:40](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L40)

___

### key

• **key**: `string`

#### Defined in

[audio/src/components/AudioSource.ts:28](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L28)

___

### loop

• **loop**: `boolean`

#### Defined in

[audio/src/components/AudioSource.ts:31](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L31)

___

### maxDistance

• **maxDistance**: `number`

#### Defined in

[audio/src/components/AudioSource.ts:35](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L35)

___

### pendingPlay

• **pendingPlay**: `boolean` = `false`

owned by `AudioSystem`

#### Defined in

[audio/src/components/AudioSource.ts:44](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L44)

___

### pendingStop

• **pendingStop**: `boolean` = `false`

owned by `AudioSystem`

#### Defined in

[audio/src/components/AudioSource.ts:46](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L46)

___

### refDistance

• **refDistance**: `number`

#### Defined in

[audio/src/components/AudioSource.ts:34](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L34)

___

### rolloffFactor

• **rolloffFactor**: `number`

#### Defined in

[audio/src/components/AudioSource.ts:36](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L36)

___

### spatial

• **spatial**: `boolean`

#### Defined in

[audio/src/components/AudioSource.ts:33](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L33)

___

### volume

• **volume**: `number`

#### Defined in

[audio/src/components/AudioSource.ts:30](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L30)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Methods

### isPlaying

▸ **isPlaying**(): `boolean`

#### Returns

`boolean`

#### Defined in

[audio/src/components/AudioSource.ts:70](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L70)

___

### play

▸ **play**(): `void`

#### Returns

`void`

#### Defined in

[audio/src/components/AudioSource.ts:62](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L62)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[audio/src/components/AudioSource.ts:66](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioSource.ts#L66)
