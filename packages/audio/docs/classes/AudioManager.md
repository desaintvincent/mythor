[@mythor/audio](../README.md) / [Exports](../modules.md) / AudioManager

# Class: AudioManager

Web Audio API wrapper. Mirrors `@mythor/events`'s `EventsManager` shape:
a singleton `Manager` that owns all browser API state, exposed to systems
and game code through simple, ECS-agnostic methods.

Builds a fixed audio graph:
`source -> instanceGain -> [panner ->] channelGain -> masterGain -> destination`

Raw audio data is loaded through `@mythor/assets`'s `AssetManager` (as an
`ArrayBuffer`, using the `'audio'` loader) and decoded/cached here.

## Hierarchy

- `Manager`

  ↳ **`AudioManager`**

## Table of contents

### Constructors

- [constructor](AudioManager.md#constructor)

### Properties

- [buffers](AudioManager.md#buffers)
- [channelGains](AudioManager.md#channelgains)
- [context](AudioManager.md#context)
- [ecs](AudioManager.md#ecs)
- [instances](AudioManager.md#instances)
- [masterGain](AudioManager.md#mastergain)
- [nextHandle](AudioManager.md#nexthandle)
- [instance](AudioManager.md#instance)
- [signature](AudioManager.md#signature)

### Accessors

- [name](AudioManager.md#name)

### Methods

- [clear](AudioManager.md#clear)
- [decode](AudioManager.md#decode)
- [getAssetManager](AudioManager.md#getassetmanager)
- [getChannelGain](AudioManager.md#getchannelgain)
- [getChannelVolume](AudioManager.md#getchannelvolume)
- [getMasterVolume](AudioManager.md#getmastervolume)
- [init](AudioManager.md#init)
- [isDecoded](AudioManager.md#isdecoded)
- [isPlaying](AudioManager.md#isplaying)
- [mute](AudioManager.md#mute)
- [pause](AudioManager.md#pause)
- [play](AudioManager.md#play)
- [postUpdate](AudioManager.md#postupdate)
- [resume](AudioManager.md#resume)
- [setChannelVolume](AudioManager.md#setchannelvolume)
- [setMasterVolume](AudioManager.md#setmastervolume)
- [stop](AudioManager.md#stop)
- [stopAll](AudioManager.md#stopall)
- [unmute](AudioManager.md#unmute)
- [update](AudioManager.md#update)
- [updateSpatial](AudioManager.md#updatespatial)

## Constructors

### constructor

• **new AudioManager**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`AudioManagerOptions`](../interfaces/AudioManagerOptions.md) |

#### Overrides

Manager.constructor

#### Defined in

[audio/src/managers/AudioManager.ts:81](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L81)

## Properties

### buffers

• `Private` `Readonly` **buffers**: `Map`<`string`, `AudioBuffer`\>

#### Defined in

[audio/src/managers/AudioManager.ts:77](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L77)

___

### channelGains

• `Private` `Readonly` **channelGains**: `Map`<`string`, `GainNode`\>

#### Defined in

[audio/src/managers/AudioManager.ts:76](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L76)

___

### context

• `Private` `Readonly` **context**: `AudioContext`

#### Defined in

[audio/src/managers/AudioManager.ts:74](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L74)

___

### ecs

• `Protected` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:5

___

### instances

• `Private` `Readonly` **instances**: `Map`<`number`, `AudioInstance`\>

#### Defined in

[audio/src/managers/AudioManager.ts:78](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L78)

___

### masterGain

• `Private` `Readonly` **masterGain**: `GainNode`

#### Defined in

[audio/src/managers/AudioManager.ts:75](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L75)

___

### nextHandle

• `Private` **nextHandle**: `number` = `1`

#### Defined in

[audio/src/managers/AudioManager.ts:79](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L79)

___

### instance

▪ `Static` `Private` `Optional` **instance**: [`AudioManager`](AudioManager.md)

#### Defined in

[audio/src/managers/AudioManager.ts:73](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L73)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Manager.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

core/lib/ecs/Manager.d.ts:7

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Overrides

Manager.clear

#### Defined in

[audio/src/managers/AudioManager.ts:279](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L279)

___

### decode

▸ **decode**(`key`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[audio/src/managers/AudioManager.ts:119](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L119)

___

### getAssetManager

▸ `Private` **getAssetManager**(): `AssetManager`

#### Returns

`AssetManager`

#### Defined in

[audio/src/managers/AudioManager.ts:109](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L109)

___

### getChannelGain

▸ `Private` **getChannelGain**(`channel`): `GainNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel` | `string` |

#### Returns

`GainNode`

#### Defined in

[audio/src/managers/AudioManager.ts:98](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L98)

___

### getChannelVolume

▸ **getChannelVolume**(`channel`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel` | `string` |

#### Returns

`number`

#### Defined in

[audio/src/managers/AudioManager.ts:238](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L238)

___

### getMasterVolume

▸ **getMasterVolume**(): `number`

#### Returns

`number`

#### Defined in

[audio/src/managers/AudioManager.ts:230](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L230)

___

### init

▸ **init**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Manager.init

#### Defined in

core/lib/ecs/Manager.d.ts:8

___

### isDecoded

▸ **isDecoded**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

#### Defined in

[audio/src/managers/AudioManager.ts:133](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L133)

___

### isPlaying

▸ **isPlaying**(`handle`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `handle` | `number` |

#### Returns

`boolean`

#### Defined in

[audio/src/managers/AudioManager.ts:214](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L214)

___

### mute

▸ **mute**(`channel?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel?` | `string` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:242](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L242)

___

### pause

▸ **pause**(`handle`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `handle` | `number` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:198](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L198)

___

### play

▸ **play**(`key`, `options?`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `options?` | [`PlayOptions`](../interfaces/PlayOptions.md) |

#### Returns

`number`

#### Defined in

[audio/src/managers/AudioManager.ts:137](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L137)

___

### postUpdate

▸ **postUpdate**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`void`

#### Inherited from

Manager.postUpdate

#### Defined in

core/lib/ecs/Manager.d.ts:9

___

### resume

▸ **resume**(`handle`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `handle` | `number` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:206](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L206)

___

### setChannelVolume

▸ **setChannelVolume**(`channel`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel` | `string` |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:234](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L234)

___

### setMasterVolume

▸ **setMasterVolume**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:226](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L226)

___

### stop

▸ **stop**(`handle`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `handle` | `number` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:190](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L190)

___

### stopAll

▸ **stopAll**(`channel?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `channel?` | `string` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:218](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L218)

___

### unmute

▸ **unmute**(`channel?`, `value?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `channel?` | `string` | `undefined` |
| `value` | `number` | `1` |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:250](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L250)

___

### update

▸ **update**(`ecs`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Inherited from

Manager.update

#### Defined in

core/lib/ecs/Manager.d.ts:10

___

### updateSpatial

▸ **updateSpatial**(`handle`, `distance`, `pan`, `falloff?`): `void`

Recomputes gain (from distance falloff) and pan (from angle) of a
spatial instance. Called every frame by `AudioSystem` for entities
carrying a spatial `AudioSource`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `handle` | `number` |
| `distance` | `number` |
| `pan` | `number` |
| `falloff` | [`SpatialFalloffOptions`](../interfaces/SpatialFalloffOptions.md) |

#### Returns

`void`

#### Defined in

[audio/src/managers/AudioManager.ts:263](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/managers/AudioManager.ts#L263)
