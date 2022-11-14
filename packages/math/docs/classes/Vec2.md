[@mythor/math](../README.md) / [Exports](../modules.md) / Vec2

# Class: Vec2

## Table of contents

### Constructors

- [constructor](Vec2.md#constructor)

### Properties

- [\_observers](Vec2.md#_observers)
- [\_x](Vec2.md#_x)
- [\_y](Vec2.md#_y)

### Accessors

- [x](Vec2.md#x)
- [y](Vec2.md#y)

### Methods

- [add](Vec2.md#add)
- [array](Vec2.md#array)
- [distanceSquared](Vec2.md#distancesquared)
- [divide](Vec2.md#divide)
- [observe](Vec2.md#observe)
- [rotate](Vec2.md#rotate)
- [round](Vec2.md#round)
- [set](Vec2.md#set)
- [sub](Vec2.md#sub)
- [times](Vec2.md#times)
- [toAngle](Vec2.md#toangle)
- [toString](Vec2.md#tostring)
- [triggerObservers](Vec2.md#triggerobservers)
- [vDivide](Vec2.md#vdivide)
- [vSet](Vec2.md#vset)
- [vTimes](Vec2.md#vtimes)
- [add](Vec2.md#add-1)
- [create](Vec2.md#create)
- [distanceSquared](Vec2.md#distancesquared-1)
- [divide](Vec2.md#divide-1)
- [fromAngle](Vec2.md#fromangle)
- [medium](Vec2.md#medium)
- [rotate](Vec2.md#rotate-1)
- [round](Vec2.md#round-1)
- [sub](Vec2.md#sub-1)
- [times](Vec2.md#times-1)
- [toAngle](Vec2.md#toangle-1)
- [vDivide](Vec2.md#vdivide-1)
- [vTimes](Vec2.md#vtimes-1)
- [zero](Vec2.md#zero)

## Constructors

### constructor

• **new Vec2**(`x`, `y?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y?` | `number` |

#### Defined in

[Vec2.ts:40](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L40)

## Properties

### \_observers

• `Private` `Readonly` **\_observers**: `ObserveCbFunction`[] = `[]`

#### Defined in

[Vec2.ts:8](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L8)

___

### \_x

• `Private` **\_x**: `number` = `0`

#### Defined in

[Vec2.ts:6](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L6)

___

### \_y

• `Private` **\_y**: `number` = `0`

#### Defined in

[Vec2.ts:7](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L7)

## Accessors

### x

• `get` **x**(): `number`

#### Returns

`number`

#### Defined in

[Vec2.ts:10](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L10)

• `set` **x**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[Vec2.ts:14](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L14)

___

### y

• `get` **y**(): `number`

#### Returns

`number`

#### Defined in

[Vec2.ts:19](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L19)

• `set` **y**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[Vec2.ts:23](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L23)

## Methods

### add

▸ **add**(`v`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:98](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L98)

___

### array

▸ **array**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[Vec2.ts:161](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L161)

___

### distanceSquared

▸ **distanceSquared**(`v2`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v2` | [`Vec2`](Vec2.md) |

#### Returns

`number`

#### Defined in

[Vec2.ts:139](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L139)

___

### divide

▸ **divide**(`n`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:82](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L82)

___

### observe

▸ **observe**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | `ObserveCbFunction` |

#### Returns

`void`

#### Defined in

[Vec2.ts:36](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L36)

___

### rotate

▸ **rotate**(`rotationInRadians`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rotationInRadians` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:126](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L126)

___

### round

▸ **round**(`precision`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `precision` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:147](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L147)

___

### set

▸ **set**(`x`, `y?`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y?` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:52](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L52)

___

### sub

▸ **sub**(`v`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:106](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L106)

___

### times

▸ **times**(`n`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:66](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L66)

___

### toAngle

▸ **toAngle**(): `number`

#### Returns

`number`

#### Defined in

[Vec2.ts:114](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L114)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[Vec2.ts:165](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L165)

___

### triggerObservers

▸ `Private` **triggerObservers**(): `void`

#### Returns

`void`

#### Defined in

[Vec2.ts:28](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L28)

___

### vDivide

▸ **vDivide**(`v`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:90](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L90)

___

### vSet

▸ **vSet**(`v`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:59](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L59)

___

### vTimes

▸ **vTimes**(`v`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:74](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L74)

___

### add

▸ `Static` **add**(`v1`, `v2`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v1` | [`Vec2`](Vec2.md) |
| `v2` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:102](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L102)

___

### create

▸ `Static` **create**(`x`, `y?`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y?` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:44](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L44)

___

### distanceSquared

▸ `Static` **distanceSquared**(`v1`, `v2`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v1` | [`Vec2`](Vec2.md) |
| `v2` | [`Vec2`](Vec2.md) |

#### Returns

`number`

#### Defined in

[Vec2.ts:143](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L143)

___

### divide

▸ `Static` **divide**(`v`, `n`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |
| `n` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:86](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L86)

___

### fromAngle

▸ `Static` **fromAngle**(`rad`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rad` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:122](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L122)

___

### medium

▸ `Static` **medium**(`vectors`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `vectors` | [`Vec2`](Vec2.md)[] |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:155](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L155)

___

### rotate

▸ `Static` **rotate**(`v`, `rotationInRadians`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |
| `rotationInRadians` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:135](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L135)

___

### round

▸ `Static` **round**(`v`, `precision`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |
| `precision` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:151](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L151)

___

### sub

▸ `Static` **sub**(`v1`, `v2`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v1` | [`Vec2`](Vec2.md) |
| `v2` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:110](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L110)

___

### times

▸ `Static` **times**(`v`, `n`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |
| `n` | `number` |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:70](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L70)

___

### toAngle

▸ `Static` **toAngle**(`v`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`Vec2`](Vec2.md) |

#### Returns

`number`

#### Defined in

[Vec2.ts:118](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L118)

___

### vDivide

▸ `Static` **vDivide**(`v1`, `v2`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v1` | [`Vec2`](Vec2.md) |
| `v2` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:94](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L94)

___

### vTimes

▸ `Static` **vTimes**(`v1`, `v2`): [`Vec2`](Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v1` | [`Vec2`](Vec2.md) |
| `v2` | [`Vec2`](Vec2.md) |

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:78](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L78)

___

### zero

▸ `Static` **zero**(): [`Vec2`](Vec2.md)

#### Returns

[`Vec2`](Vec2.md)

#### Defined in

[Vec2.ts:48](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/math/src/Vec2.ts#L48)
