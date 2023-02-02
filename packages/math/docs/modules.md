[@mythor/math](README.md) / Exports

# @mythor/math

## Table of contents

### Classes

- [Vec2](classes/Vec2.md)

### Interfaces

- [Rect](interfaces/Rect.md)

### Functions

- [contains](modules.md#contains)
- [getBottomRight](modules.md#getbottomright)
- [getPolygonCentroid](modules.md#getpolygoncentroid)
- [getTopLeft](modules.md#gettopleft)
- [lerp](modules.md#lerp)
- [moveTowards](modules.md#movetowards)
- [overlaps](modules.md#overlaps)
- [root](modules.md#root)
- [round](modules.md#round)

## Functions

### contains

▸ **contains**(`rect`, `r`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | [`Rect`](interfaces/Rect.md) |
| `r` | [`Rect`](interfaces/Rect.md) |

#### Returns

`boolean`

#### Defined in

[Rect.ts:8](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/Rect.ts#L8)

___

### getBottomRight

▸ **getBottomRight**(`rect`): [`Vec2`](classes/Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | [`Rect`](interfaces/Rect.md) |

#### Returns

[`Vec2`](classes/Vec2.md)

#### Defined in

[Rect.ts:41](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/Rect.ts#L41)

___

### getPolygonCentroid

▸ **getPolygonCentroid**(`opts`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`Vec2`](classes/Vec2.md)[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `centroid` | [`Vec2`](classes/Vec2.md) |
| `size` | [`Vec2`](classes/Vec2.md) |

#### Defined in

[util.ts:30](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/util.ts#L30)

___

### getTopLeft

▸ **getTopLeft**(`rect`): [`Vec2`](classes/Vec2.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | [`Rect`](interfaces/Rect.md) |

#### Returns

[`Vec2`](classes/Vec2.md)

#### Defined in

[Rect.ts:38](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/Rect.ts#L38)

___

### lerp

▸ **lerp**(`value1`, `value2`, `amount?`): `number`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value1` | `number` | `undefined` |
| `value2` | `number` | `undefined` |
| `amount` | `number` | `0.5` |

#### Returns

`number`

#### Defined in

[util.ts:9](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/util.ts#L9)

___

### moveTowards

▸ **moveTowards**(`current`, `target`, `maxDelta`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `number` |
| `target` | `number` |
| `maxDelta` | `number` |

#### Returns

`number`

#### Defined in

[util.ts:18](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/util.ts#L18)

___

### overlaps

▸ **overlaps**(`rect`, `r`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | [`Rect`](interfaces/Rect.md) |
| `r` | [`Rect`](interfaces/Rect.md) |

#### Returns

`boolean`

#### Defined in

[Rect.ts:23](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/Rect.ts#L23)

___

### root

▸ **root**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[util.ts:16](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/util.ts#L16)

___

### round

▸ **round**(`number`, `precision?`): `number`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `number` | `number` | `undefined` |
| `precision` | `number` | `3` |

#### Returns

`number`

#### Defined in

[util.ts:3](https://github.com/desaintvincent/mythor/blob/c881de0/packages/math/src/util.ts#L3)
