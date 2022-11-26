[@mythor/renderer](../README.md) / [Exports](../modules.md) / ParticleEmitter

# Class: ParticleEmitter

## Hierarchy

- `Component`

  ↳ **`ParticleEmitter`**

## Table of contents

### Constructors

- [constructor](ParticleEmitter.md#constructor)

### Properties

- [\_entity](ParticleEmitter.md#_entity)
- [age](ParticleEmitter.md#age)
- [buffers](ParticleEmitter.md#buffers)
- [colorTimingBezier](ParticleEmitter.md#colortimingbezier)
- [deleteOnEndOfLife](ParticleEmitter.md#deleteonendoflife)
- [endColor](ParticleEmitter.md#endcolor)
- [frequency](ParticleEmitter.md#frequency)
- [gravity](ParticleEmitter.md#gravity)
- [maxParticleNumber](ParticleEmitter.md#maxparticlenumber)
- [minMaxLifeTime](ParticleEmitter.md#minmaxlifetime)
- [minMaxRotation](ParticleEmitter.md#minmaxrotation)
- [minMaxSize](ParticleEmitter.md#minmaxsize)
- [minMaxSpeed](ParticleEmitter.md#minmaxspeed)
- [minMaxTheta](ParticleEmitter.md#minmaxtheta)
- [minMaxTorque](ParticleEmitter.md#minmaxtorque)
- [offset](ParticleEmitter.md#offset)
- [onEndOfLife](ParticleEmitter.md#onendoflife)
- [particleNumber](ParticleEmitter.md#particlenumber)
- [respawn](ParticleEmitter.md#respawn)
- [sizeTimingBezier](ParticleEmitter.md#sizetimingbezier)
- [startColor](ParticleEmitter.md#startcolor)
- [texture](ParticleEmitter.md#texture)
- [textureOriginBuffer](ParticleEmitter.md#textureoriginbuffer)
- [textureOriginFunction](ParticleEmitter.md#textureoriginfunction)
- [textureSizeBuffer](ParticleEmitter.md#texturesizebuffer)
- [textureSizeFunction](ParticleEmitter.md#texturesizefunction)
- [signature](ParticleEmitter.md#signature)

## Constructors

### constructor

• **new ParticleEmitter**(`maxParticleNumber`, `params?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxParticleNumber` | `number` |
| `params?` | `ParticleEmitterParameters` |

#### Overrides

Component.constructor

#### Defined in

[renderer/src/components/ParticleEmitter.ts:163](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L163)

## Properties

### \_entity

• **\_entity**: `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### age

• **age**: `number` = `0`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:157](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L157)

___

### buffers

• **buffers**: `Map`<`string`, `BufferContent`\>

#### Defined in

[renderer/src/components/ParticleEmitter.ts:138](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L138)

___

### colorTimingBezier

• **colorTimingBezier**: `TimingValues`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:160](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L160)

___

### deleteOnEndOfLife

• **deleteOnEndOfLife**: `boolean`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:158](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L158)

___

### endColor

• `Readonly` **endColor**: [`Color`](../modules.md#color)

#### Defined in

[renderer/src/components/ParticleEmitter.ts:150](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L150)

___

### frequency

• `Readonly` **frequency**: `number`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:148](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L148)

___

### gravity

• `Readonly` **gravity**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:151](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L151)

___

### maxParticleNumber

• `Readonly` **maxParticleNumber**: `any`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:140](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L140)

___

### minMaxLifeTime

• `Readonly` **minMaxLifeTime**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:142](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L142)

___

### minMaxRotation

• `Readonly` **minMaxRotation**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:145](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L145)

___

### minMaxSize

• `Readonly` **minMaxSize**: [`number`, `number`, `number`, `number`]

#### Defined in

[renderer/src/components/ParticleEmitter.ts:155](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L155)

___

### minMaxSpeed

• `Readonly` **minMaxSpeed**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:144](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L144)

___

### minMaxTheta

• `Readonly` **minMaxTheta**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:143](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L143)

___

### minMaxTorque

• `Readonly` **minMaxTorque**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:146](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L146)

___

### offset

• `Readonly` **offset**: `default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:147](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L147)

___

### onEndOfLife

• `Optional` **onEndOfLife**: (`entity`: `default`) => `void`

#### Type declaration

▸ (`entity`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

##### Returns

`void`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:159](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L159)

___

### particleNumber

• **particleNumber**: `number` = `0`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:141](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L141)

___

### respawn

• `Readonly` **respawn**: `boolean`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:156](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L156)

___

### sizeTimingBezier

• **sizeTimingBezier**: `TimingValues`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:161](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L161)

___

### startColor

• `Readonly` **startColor**: [`Color`](../modules.md#color)

#### Defined in

[renderer/src/components/ParticleEmitter.ts:149](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L149)

___

### texture

• `Optional` **texture**: [`Texture`](Texture.md)

#### Defined in

[renderer/src/components/ParticleEmitter.ts:152](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L152)

___

### textureOriginBuffer

• **textureOriginBuffer**: `WebGLBuffer`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:136](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L136)

___

### textureOriginFunction

• **textureOriginFunction**: () => `default`

#### Type declaration

▸ (): `default`

##### Returns

`default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:153](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L153)

___

### textureSizeBuffer

• **textureSizeBuffer**: `WebGLBuffer`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:137](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L137)

___

### textureSizeFunction

• **textureSizeFunction**: () => `default`

#### Type declaration

▸ (): `default`

##### Returns

`default`

#### Defined in

[renderer/src/components/ParticleEmitter.ts:154](https://github.com/desaintvincent/mythor/blob/94ee943/packages/renderer/src/components/ParticleEmitter.ts#L154)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
