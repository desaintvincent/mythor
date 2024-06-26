[@mythor/core](../README.md) / [Exports](../modules.md) / LoadingStateManager

# Class: LoadingStateManager

## Hierarchy

- [`Manager`](Manager.md)

  ↳ **`LoadingStateManager`**

## Table of contents

### Constructors

- [constructor](LoadingStateManager.md#constructor)

### Properties

- [ecs](LoadingStateManager.md#ecs)
- [loadingStates](LoadingStateManager.md#loadingstates)
- [signature](LoadingStateManager.md#signature)

### Accessors

- [name](LoadingStateManager.md#name)

### Methods

- [clear](LoadingStateManager.md#clear)
- [createState](LoadingStateManager.md#createstate)
- [getLoadingDetail](LoadingStateManager.md#getloadingdetail)
- [getLoadingPercentage](LoadingStateManager.md#getloadingpercentage)
- [getState](LoadingStateManager.md#getstate)
- [init](LoadingStateManager.md#init)
- [postUpdate](LoadingStateManager.md#postupdate)
- [update](LoadingStateManager.md#update)

## Constructors

### constructor

• **new LoadingStateManager**()

#### Overrides

[Manager](Manager.md).[constructor](Manager.md#constructor)

#### Defined in

[managers/LoadingStateManager.ts:14](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/managers/LoadingStateManager.ts#L14)

## Properties

### ecs

• `Protected` `Readonly` **ecs**: [`Ecs`](Ecs.md)

#### Inherited from

[Manager](Manager.md).[ecs](Manager.md#ecs)

#### Defined in

[ecs/Manager.ts:6](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Manager.ts#L6)

___

### loadingStates

• `Private` `Readonly` **loadingStates**: `Map`<`string`, [`LoadingState`](../interfaces/LoadingState.md)\>

#### Defined in

[managers/LoadingStateManager.ts:12](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/managers/LoadingStateManager.ts#L12)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

[Manager](Manager.md).[signature](Manager.md#signature)

#### Defined in

[collections/Signable.ts:2](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/collections/Signable.ts#L2)

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

[ecs/Manager.ts:13](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Manager.ts#L13)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

[Manager](Manager.md).[clear](Manager.md#clear)

#### Defined in

[ecs/Manager.ts:35](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Manager.ts#L35)

___

### createState

▸ **createState**(`state`): [`LoadingState`](../interfaces/LoadingState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Partial`<[`LoadingState`](../interfaces/LoadingState.md)\> & { `name`: `string`  } |

#### Returns

[`LoadingState`](../interfaces/LoadingState.md)

#### Defined in

[managers/LoadingStateManager.ts:19](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/managers/LoadingStateManager.ts#L19)

___

### getLoadingDetail

▸ **getLoadingDetail**(): `string`

#### Returns

`string`

#### Defined in

[managers/LoadingStateManager.ts:60](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/managers/LoadingStateManager.ts#L60)

___

### getLoadingPercentage

▸ **getLoadingPercentage**(): `number`

#### Returns

`number`

#### Defined in

[managers/LoadingStateManager.ts:39](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/managers/LoadingStateManager.ts#L39)

___

### getState

▸ **getState**(`stateName`): [`LoadingState`](../interfaces/LoadingState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stateName` | `string` |

#### Returns

[`LoadingState`](../interfaces/LoadingState.md)

#### Defined in

[managers/LoadingStateManager.ts:35](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/managers/LoadingStateManager.ts#L35)

___

### init

▸ **init**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Manager](Manager.md).[init](Manager.md#init)

#### Defined in

[ecs/Manager.ts:18](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Manager.ts#L18)

___

### postUpdate

▸ **postUpdate**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |

#### Returns

`void`

#### Inherited from

[Manager](Manager.md).[postUpdate](Manager.md#postupdate)

#### Defined in

[ecs/Manager.ts:22](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Manager.ts#L22)

___

### update

▸ **update**(`ecs`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | [`Ecs`](Ecs.md) |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Inherited from

[Manager](Manager.md).[update](Manager.md#update)

#### Defined in

[ecs/Manager.ts:25](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/core/src/ecs/Manager.ts#L25)
