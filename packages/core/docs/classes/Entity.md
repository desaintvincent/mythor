[@mythor/core](../README.md) / [Exports](../modules.md) / Entity

# Class: Entity

## Table of contents

### Constructors

- [constructor](Entity.md#constructor)

### Properties

- [\_children](Entity.md#_children)
- [\_components](Entity.md#_components)
- [\_ecs](Entity.md#_ecs)
- [\_id](Entity.md#_id)
- [\_parent](Entity.md#_parent)
- [\_tags](Entity.md#_tags)

### Accessors

- [children](Entity.md#children)
- [components](Entity.md#components)
- [parent](Entity.md#parent)

### Methods

- [add](Entity.md#add)
- [addChild](Entity.md#addchild)
- [addComponent](Entity.md#addcomponent)
- [destroy](Entity.md#destroy)
- [forEachChild](Entity.md#foreachchild)
- [get](Entity.md#get)
- [getRecursive](Entity.md#getrecursive)
- [has](Entity.md#has)
- [hasTag](Entity.md#hastag)
- [remove](Entity.md#remove)
- [setEcs](Entity.md#setecs)
- [tag](Entity.md#tag)

## Constructors

### constructor

• **new Entity**(`id?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id?` | `string` |

#### Defined in

[ecs/Entity.ts:20](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L20)

## Properties

### \_children

• `Private` `Readonly` **\_children**: [`Entity`](Entity.md)[] = `[]`

#### Defined in

[ecs/Entity.ts:14](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L14)

___

### \_components

• `Private` `Readonly` **\_components**: `Map`<`number`, [`Component`](Component.md)\>

#### Defined in

[ecs/Entity.ts:17](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L17)

___

### \_ecs

• `Private` `Optional` **\_ecs**: [`Ecs`](Ecs.md)

#### Defined in

[ecs/Entity.ts:15](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L15)

___

### \_id

• `Readonly` **\_id**: `string`

#### Defined in

[ecs/Entity.ts:13](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L13)

___

### \_parent

• `Private` `Optional` **\_parent**: [`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:18](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L18)

___

### \_tags

• `Private` `Readonly` **\_tags**: `string`[] = `[]`

#### Defined in

[ecs/Entity.ts:16](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L16)

## Accessors

### children

• `get` **children**(): [`Entity`](Entity.md)[]

#### Returns

[`Entity`](Entity.md)[]

#### Defined in

[ecs/Entity.ts:29](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L29)

___

### components

• `get` **components**(): [`Component`](Component.md)[]

#### Returns

[`Component`](Component.md)[]

#### Defined in

[ecs/Entity.ts:33](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L33)

___

### parent

• `get` **parent**(): [`Entity`](Entity.md)

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:25](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L25)

## Methods

### add

▸ **add**(...`components`): [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...components` | [`Component`](Component.md)[] |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:60](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L60)

___

### addChild

▸ **addChild**(`otherEntity`): [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `otherEntity` | [`Entity`](Entity.md) |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:41](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L41)

___

### addComponent

▸ **addComponent**<`T`\>(`componentInstance`): [`Entity`](Entity.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Component`](Component.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentInstance` | `T` |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:48](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L48)

___

### destroy

▸ **destroy**(`cascade?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cascade` | `boolean` | `true` |

#### Returns

`void`

#### Defined in

[ecs/Entity.ts:128](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L128)

___

### forEachChild

▸ **forEachChild**(`cb`, `recursive?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cb` | (`e`: [`Entity`](Entity.md)) => `void` | `undefined` |
| `recursive` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[ecs/Entity.ts:90](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L90)

___

### get

▸ **get**<`C`\>(`constructor`): `C`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`Component`](Component.md)<`C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](../modules.md#constructor)<`C`\> |

#### Returns

`C`

#### Defined in

[ecs/Entity.ts:71](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L71)

___

### getRecursive

▸ **getRecursive**<`T`\>(`constructor`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Component`](Component.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](../modules.md#constructor)<`T`\> |

#### Returns

`T`

#### Defined in

[ecs/Entity.ts:76](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L76)

___

### has

▸ **has**(`componentConstructor`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentConstructor` | [`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\> |

#### Returns

`boolean`

#### Defined in

[ecs/Entity.ts:99](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L99)

___

### hasTag

▸ **hasTag**(`tagName`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tagName` | `string` |

#### Returns

`boolean`

#### Defined in

[ecs/Entity.ts:113](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L113)

___

### remove

▸ **remove**(`componentConstructor`): [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `componentConstructor` | [`Constructor`](../modules.md#constructor)<[`Component`](Component.md)\> |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:117](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L117)

___

### setEcs

▸ **setEcs**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |

#### Returns

`void`

#### Defined in

[ecs/Entity.ts:37](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L37)

___

### tag

▸ **tag**(`tagName`): [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tagName` | `string` |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Entity.ts:107](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Entity.ts#L107)
