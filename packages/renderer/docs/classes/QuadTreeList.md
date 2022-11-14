[@mythor/renderer](../README.md) / [Exports](../modules.md) / QuadTreeList

# Class: QuadTreeList

## Hierarchy

- `List`<`Entity`\>

  ↳ **`QuadTreeList`**

## Implements

- `IList`<`Entity`\>

## Table of contents

### Constructors

- [constructor](QuadTreeList.md#constructor)

### Properties

- [\_data](QuadTreeList.md#_data)
- [\_signature](QuadTreeList.md#_signature)
- [quadTree](QuadTreeList.md#quadtree)
- [rendered](QuadTreeList.md#rendered)

### Accessors

- [constructors](QuadTreeList.md#constructors)
- [length](QuadTreeList.md#length)
- [signature](QuadTreeList.md#signature)

### Methods

- [\_\_add](QuadTreeList.md#__add)
- [\_\_remove](QuadTreeList.md#__remove)
- [add](QuadTreeList.md#add)
- [clear](QuadTreeList.md#clear)
- [forEach](QuadTreeList.md#foreach)
- [naiveSearchForeach](QuadTreeList.md#naivesearchforeach)
- [remove](QuadTreeList.md#remove)
- [resize](QuadTreeList.md#resize)
- [searchForEach](QuadTreeList.md#searchforeach)
- [update](QuadTreeList.md#update)

## Constructors

### constructor

• **new QuadTreeList**(`signature`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signature` | `number` |
| `options` | `QuadTreeListOptions` |

#### Overrides

List&lt;Entity\&gt;.constructor

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:16](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L16)

## Properties

### \_data

• `Private` **\_data**: `Map`<`string`, `default`\>

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:12](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L12)

___

### \_signature

• `Readonly` **\_signature**: `number`

#### Inherited from

List.\_signature

#### Defined in

core/lib/lists/List.d.ts:12

___

### quadTree

• **quadTree**: [`QuadTree`](QuadTree.md)

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:14](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L14)

___

### rendered

• `Private` **rendered**: `number` = `0`

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:13](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L13)

## Accessors

### constructors

• `get` **constructors**(): `Constructor`<`Component`\>[]

#### Returns

`Constructor`<`Component`\>[]

#### Implementation of

IList.constructors

#### Inherited from

List.constructors

#### Defined in

core/lib/lists/List.d.ts:18

___

### length

• `get` **length**(): `number`

#### Returns

`number`

#### Implementation of

IList.length

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:89](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L89)

___

### signature

• `get` **signature**(): `number`

#### Returns

`number`

#### Implementation of

IList.signature

#### Inherited from

List.signature

#### Defined in

core/lib/lists/List.d.ts:19

## Methods

### \_\_add

▸ **__add**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Overrides

List.\_\_add

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:33](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L33)

___

### \_\_remove

▸ **__remove**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Overrides

List.\_\_remove

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:38](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L38)

___

### add

▸ **add**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `default` |

#### Returns

`void`

#### Implementation of

IList.add

#### Inherited from

List.add

#### Defined in

core/lib/lists/List.d.ts:20

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Implementation of

IList.clear

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:52](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L52)

___

### forEach

▸ **forEach**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`e`: `default`) => `void` |

#### Returns

`void`

#### Implementation of

IList.forEach

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:61](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L61)

___

### naiveSearchForeach

▸ **naiveSearchForeach**(`rect`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `Rect` |
| `callback` | (`e`: `default`) => `void` |

#### Returns

`void`

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:65](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L65)

___

### remove

▸ **remove**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `default` |

#### Returns

`void`

#### Implementation of

IList.remove

#### Inherited from

List.remove

#### Defined in

core/lib/lists/List.d.ts:21

___

### resize

▸ **resize**(`rect`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `Rect` |

#### Returns

`void`

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:25](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L25)

___

### searchForEach

▸ **searchForEach**(`rect`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `Rect` |
| `callback` | (`e`: `default`) => `void` |

#### Returns

`void`

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:74](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L74)

___

### update

▸ **update**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | `default` |

#### Returns

`void`

#### Defined in

[renderer/src/quadTree/QuadTreeList.ts:56](https://github.com/desaintvincent/mythor/blob/1a100e7/packages/renderer/src/quadTree/QuadTreeList.ts#L56)
