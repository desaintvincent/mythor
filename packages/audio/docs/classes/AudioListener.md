[@mythor/audio](../README.md) / [Exports](../modules.md) / AudioListener

# Class: AudioListener

Marker component for the entity acting as the 2D spatial audio listener.
Must be combined with a `Transform`. `AudioSystem` uses the first entity
carrying both `Transform` and an enabled `AudioListener` as the reference
point for spatial `AudioSource`s; falls back to world origin `(0, 0)` if
none is found.

## Hierarchy

- `Component`

  ↳ **`AudioListener`**

## Table of contents

### Constructors

- [constructor](AudioListener.md#constructor)

### Properties

- [\_entity](AudioListener.md#_entity)
- [enabled](AudioListener.md#enabled)
- [signature](AudioListener.md#signature)

## Constructors

### constructor

• **new AudioListener**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`AudioListenerOptions`](../interfaces/AudioListenerOptions.md) |

#### Overrides

Component.constructor

#### Defined in

[audio/src/components/AudioListener.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioListener.ts#L17)

## Properties

### \_entity

• **\_entity**: `undefined` \| `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### enabled

• **enabled**: `boolean`

#### Defined in

[audio/src/components/AudioListener.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/audio/src/components/AudioListener.ts#L15)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
