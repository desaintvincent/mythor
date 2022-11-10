[@mythor/renderer](../README.md) / [Exports](../modules.md) / QuadTree

# Class: QuadTree

## Table of contents

### Constructors

- [constructor](QuadTree.md#constructor)

### Properties

- [depth](QuadTree.md#depth)
- [items](QuadTree.md#items)
- [leaveRects](QuadTree.md#leaverects)
- [leaves](QuadTree.md#leaves)
- [parent](QuadTree.md#parent)
- [rect](QuadTree.md#rect)

### Accessors

- [itemLength](QuadTree.md#itemlength)
- [length](QuadTree.md#length)

### Methods

- [clear](QuadTree.md#clear)
- [getAllItems](QuadTree.md#getallitems)
- [insert](QuadTree.md#insert)
- [remove](QuadTree.md#remove)
- [resize](QuadTree.md#resize)
- [search](QuadTree.md#search)

## Constructors

### constructor

• **new QuadTree**(`rect`, `parent?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `Rect` |
| `parent?` | [`QuadTree`](QuadTree.md) |

#### Defined in

[renderer/src/quadTree/QuadTree.ts:21](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L21)

## Properties

### depth

• `Readonly` **depth**: `number`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:16](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L16)

___

### items

• `Private` `Readonly` **items**: `Map`<`string`, `default`\>

#### Defined in

[renderer/src/quadTree/QuadTree.ts:15](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L15)

___

### leaveRects

• `Private` `Readonly` **leaveRects**: `Rect`[] = `[]`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:19](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L19)

___

### leaves

• `Readonly` **leaves**: [`QuadTree`](QuadTree.md)[] = `[]`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:18](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L18)

___

### parent

• `Optional` `Readonly` **parent**: [`QuadTree`](QuadTree.md)

#### Defined in

[renderer/src/quadTree/QuadTree.ts:17](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L17)

___

### rect

• **rect**: `Rect`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:14](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L14)

## Accessors

### itemLength

• `get` **itemLength**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:31](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L31)

___

### length

• `get` **length**(): `number`

#### Returns

`number`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:27](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L27)

## Methods

### clear

▸ `Private` **clear**(): `void`

#### Returns

`void`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:125](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L125)

___

### getAllItems

▸ **getAllItems**(): `default`[]

#### Returns

`default`[]

#### Defined in

[renderer/src/quadTree/QuadTree.ts:89](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L89)

___

### insert

▸ **insert**(`entity`): [`QuadTree`](QuadTree.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

[`QuadTree`](QuadTree.md)

#### Defined in

[renderer/src/quadTree/QuadTree.ts:35](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L35)

___

### remove

▸ **remove**(`entity`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`boolean`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:85](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L85)

___

### resize

▸ `Private` **resize**(`rect`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `Rect` |

#### Returns

`void`

#### Defined in

[renderer/src/quadTree/QuadTree.ts:95](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L95)

___

### search

▸ **search**(`rArea`, `cb?`): `default`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `rArea` | `Rect` |
| `cb?` | (`entity`: `default`) => `void` |

#### Returns

`default`[]

#### Defined in

[renderer/src/quadTree/QuadTree.ts:54](https://github.com/desaintvincent/mythor/blob/4a55505/packages/renderer/src/quadTree/QuadTree.ts#L54)
