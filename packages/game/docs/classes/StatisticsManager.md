[@mythor/game](../README.md) / [Exports](../modules.md) / StatisticsManager

# Class: StatisticsManager

## Hierarchy

- `Manager`

  ↳ **`StatisticsManager`**

## Table of contents

### Constructors

- [constructor](StatisticsManager.md#constructor)

### Properties

- [count](StatisticsManager.md#count)
- [display](StatisticsManager.md#display)
- [ecs](StatisticsManager.md#ecs)
- [elem](StatisticsManager.md#elem)
- [entityPanel](StatisticsManager.md#entitypanel)
- [stats](StatisticsManager.md#stats)

### Accessors

- [name](StatisticsManager.md#name)

### Methods

- [clear](StatisticsManager.md#clear)
- [getComponentStats](StatisticsManager.md#getcomponentstats)
- [getManagerStats](StatisticsManager.md#getmanagerstats)
- [getSystemStats](StatisticsManager.md#getsystemstats)
- [init](StatisticsManager.md#init)
- [postUpdate](StatisticsManager.md#postupdate)
- [toggleDisplay](StatisticsManager.md#toggledisplay)
- [update](StatisticsManager.md#update)

## Constructors

### constructor

• **new StatisticsManager**(`debugElementId?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `debugElementId` | `string` | `'statistics'` |

#### Overrides

Manager.constructor

#### Defined in

[game/src/managers/StatisticsManager.ts:68](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L68)

## Properties

### count

• `Private` **count**: `number` = `0`

#### Defined in

[game/src/managers/StatisticsManager.ts:62](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L62)

___

### display

• `Private` **display**: `boolean` = `false`

#### Defined in

[game/src/managers/StatisticsManager.ts:66](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L66)

___

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:4

___

### elem

• `Private` `Optional` `Readonly` **elem**: `HTMLElement`

#### Defined in

[game/src/managers/StatisticsManager.ts:65](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L65)

___

### entityPanel

• `Private` `Readonly` **entityPanel**: `any`

#### Defined in

[game/src/managers/StatisticsManager.ts:64](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L64)

___

### stats

• `Private` `Readonly` **stats**: `Stats`

#### Defined in

[game/src/managers/StatisticsManager.ts:63](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L63)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

core/lib/ecs/Manager.d.ts:6

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Manager.clear

#### Defined in

core/lib/ecs/Manager.d.ts:10

___

### getComponentStats

▸ `Private` **getComponentStats**(`ecs`): `ComponentStats`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`ComponentStats`[]

#### Defined in

[game/src/managers/StatisticsManager.ts:128](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L128)

___

### getManagerStats

▸ `Private` **getManagerStats**(`ecs`): `ManagerStats`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`ManagerStats`[]

#### Defined in

[game/src/managers/StatisticsManager.ts:137](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L137)

___

### getSystemStats

▸ `Private` **getSystemStats**(`ecs`): `SystemStats`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`SystemStats`[]

#### Defined in

[game/src/managers/StatisticsManager.ts:143](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L143)

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

core/lib/ecs/Manager.d.ts:7

___

### postUpdate

▸ **postUpdate**(): `void`

#### Returns

`void`

#### Overrides

Manager.postUpdate

#### Defined in

[game/src/managers/StatisticsManager.ts:100](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L100)

___

### toggleDisplay

▸ `Private` **toggleDisplay**(): `void`

#### Returns

`void`

#### Defined in

[game/src/managers/StatisticsManager.ts:91](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L91)

___

### update

▸ **update**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`void`

#### Overrides

Manager.update

#### Defined in

[game/src/managers/StatisticsManager.ts:104](https://github.com/desaintvincent/mythor/blob/1d60040/packages/game/src/managers/StatisticsManager.ts#L104)
