[@mythor/renderer](../README.md) / [Exports](../modules.md) / Camera

# Class: Camera

## Table of contents

### Constructors

- [constructor](Camera.md#constructor)

### Properties

- [\_dirty](Camera.md#_dirty)
- [\_projection](Camera.md#_projection)
- [\_scale](Camera.md#_scale)
- [\_target](Camera.md#_target)
- [\_targetEntity](Camera.md#_targetentity)
- [angle](Camera.md#angle)
- [at](Camera.md#at)
- [size](Camera.md#size)
- [targetFunction](Camera.md#targetfunction)
- [to](Camera.md#to)

### Accessors

- [projection](Camera.md#projection)
- [scale](Camera.md#scale)

### Methods

- [getPosition](Camera.md#getposition)
- [getSize](Camera.md#getsize)
- [getTargetEntity](Camera.md#gettargetentity)
- [lookat](Camera.md#lookat)
- [move](Camera.md#move)
- [screenToWorld](Camera.md#screentoworld)
- [setTargetFunction](Camera.md#settargetfunction)
- [target](Camera.md#target)
- [targetEntity](Camera.md#targetentity)
- [update](Camera.md#update)
- [worldToScreen](Camera.md#worldtoscreen)
- [zoom](Camera.md#zoom)

## Constructors

### constructor

• **new Camera**(`size?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `size?` | `default` |

#### Defined in

[renderer/src/objects/Camera.ts:44](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L44)

## Properties

### \_dirty

• `Private` **\_dirty**: `boolean` = `true`

#### Defined in

[renderer/src/objects/Camera.ts:39](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L39)

___

### \_projection

• `Private` `Optional` **\_projection**: `Projection`

#### Defined in

[renderer/src/objects/Camera.ts:40](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L40)

___

### \_scale

• `Private` **\_scale**: `number` = `1`

#### Defined in

[renderer/src/objects/Camera.ts:37](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L37)

___

### \_target

• `Private` **\_target**: `default`

#### Defined in

[renderer/src/objects/Camera.ts:35](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L35)

___

### \_targetEntity

• `Private` `Optional` **\_targetEntity**: `default`

#### Defined in

[renderer/src/objects/Camera.ts:41](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L41)

___

### angle

• `Private` `Readonly` **angle**: `number` = `0`

#### Defined in

[renderer/src/objects/Camera.ts:36](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L36)

___

### at

• `Private` `Readonly` **at**: `default`

#### Defined in

[renderer/src/objects/Camera.ts:33](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L33)

___

### size

• `Private` `Readonly` **size**: `default`

#### Defined in

[renderer/src/objects/Camera.ts:38](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L38)

___

### targetFunction

• `Private` `Optional` **targetFunction**: `TargetFunction`

#### Defined in

[renderer/src/objects/Camera.ts:42](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L42)

___

### to

• `Private` **to**: `default`

#### Defined in

[renderer/src/objects/Camera.ts:34](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L34)

## Accessors

### projection

• `get` **projection**(): `Projection`

#### Returns

`Projection`

#### Defined in

[renderer/src/objects/Camera.ts:138](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L138)

___

### scale

• `get` **scale**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/objects/Camera.ts:107](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L107)

• `set` **scale**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/objects/Camera.ts:111](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L111)

## Methods

### getPosition

▸ **getPosition**(): `default`

#### Returns

`default`

#### Defined in

[renderer/src/objects/Camera.ts:66](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L66)

___

### getSize

▸ **getSize**(): `default`

#### Returns

`default`

#### Defined in

[renderer/src/objects/Camera.ts:62](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L62)

___

### getTargetEntity

▸ **getTargetEntity**(): `default`

#### Returns

`default`

#### Defined in

[renderer/src/objects/Camera.ts:82](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L82)

___

### lookat

▸ **lookat**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/objects/Camera.ts:93](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L93)

___

### move

▸ **move**(`offset`, `relatifToZoom?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `offset` | `default` | `undefined` |
| `relatifToZoom` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[renderer/src/objects/Camera.ts:86](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L86)

___

### screenToWorld

▸ **screenToWorld**(`screenPosition`): `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `screenPosition` | `default` |

#### Returns

`default`

#### Defined in

[renderer/src/objects/Camera.ts:116](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L116)

___

### setTargetFunction

▸ **setTargetFunction**(`fn`): [`Camera`](Camera.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `TargetFunction` |

#### Returns

[`Camera`](Camera.md)

#### Defined in

[renderer/src/objects/Camera.ts:70](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L70)

___

### target

▸ **target**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/objects/Camera.ts:99](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L99)

___

### targetEntity

▸ **targetEntity**(`entity?`): [`Camera`](Camera.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity?` | `default` |

#### Returns

[`Camera`](Camera.md)

#### Defined in

[renderer/src/objects/Camera.ts:76](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L76)

___

### update

▸ **update**(`elapsedTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elapsedTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/objects/Camera.ts:48](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L48)

___

### worldToScreen

▸ **worldToScreen**(`worldPosition`): `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `worldPosition` | `default` |

#### Returns

`default`

#### Defined in

[renderer/src/objects/Camera.ts:128](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L128)

___

### zoom

▸ **zoom**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/objects/Camera.ts:103](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/objects/Camera.ts#L103)
