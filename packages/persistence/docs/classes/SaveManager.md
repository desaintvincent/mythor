[@mythor/persistence](../README.md) / [Exports](../modules.md) / SaveManager

# Class: SaveManager

Saves/loads ECS state to a `StorageBackend` (`localStorage` by default).
Only components implementing `Serializable` are persisted; components
that should be restored on load must first be registered via
`registerComponent`.

## Hierarchy

- `Manager`

  ↳ **`SaveManager`**

## Table of contents

### Constructors

- [constructor](SaveManager.md#constructor)

### Properties

- [backend](SaveManager.md#backend)
- [ecs](SaveManager.md#ecs)
- [factories](SaveManager.md#factories)
- [signature](SaveManager.md#signature)

### Accessors

- [name](SaveManager.md#name)

### Methods

- [clear](SaveManager.md#clear)
- [clearWorld](SaveManager.md#clearworld)
- [deleteSlot](SaveManager.md#deleteslot)
- [init](SaveManager.md#init)
- [listSlots](SaveManager.md#listslots)
- [load](SaveManager.md#load)
- [postUpdate](SaveManager.md#postupdate)
- [registerComponent](SaveManager.md#registercomponent)
- [save](SaveManager.md#save)
- [update](SaveManager.md#update)

## Constructors

### constructor

• **new SaveManager**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SaveManagerOptions`](../interfaces/SaveManagerOptions.md) |

#### Overrides

Manager.constructor

#### Defined in

[persistence/src/managers/SaveManager.ts:32](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L32)

## Properties

### backend

• `Private` `Readonly` **backend**: [`StorageBackend`](../interfaces/StorageBackend.md)

#### Defined in

[persistence/src/managers/SaveManager.ts:29](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L29)

___

### ecs

• `Protected` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:5

___

### factories

• `Private` `Readonly` **factories**: `Map`<`string`, `ComponentFactory`<`Component`\>\>

#### Defined in

[persistence/src/managers/SaveManager.ts:30](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L30)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Manager.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Accessors

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Inherited from

Manager.name

#### Defined in

core/lib/ecs/Manager.d.ts:7

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Inherited from

Manager.clear

#### Defined in

core/lib/ecs/Manager.d.ts:11

___

### clearWorld

▸ `Private` **clearWorld**(): `void`

#### Returns

`void`

#### Defined in

[persistence/src/managers/SaveManager.ts:107](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L107)

___

### deleteSlot

▸ **deleteSlot**(`slot`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[persistence/src/managers/SaveManager.ts:100](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L100)

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

core/lib/ecs/Manager.d.ts:8

___

### listSlots

▸ **listSlots**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[persistence/src/managers/SaveManager.ts:96](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L96)

___

### load

▸ **load**(`slot`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[persistence/src/managers/SaveManager.ts:67](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L67)

___

### postUpdate

▸ **postUpdate**(`ecs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`void`

#### Inherited from

Manager.postUpdate

#### Defined in

core/lib/ecs/Manager.d.ts:9

___

### registerComponent

▸ **registerComponent**<`T`\>(`constructor`, `deserialize`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Component`<`T`\> & [`Serializable`](../interfaces/Serializable.md)<`unknown`, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | `Constructor`<`T`\> |
| `deserialize` | `ComponentFactory`<`T`\> |

#### Returns

`void`

#### Defined in

[persistence/src/managers/SaveManager.ts:37](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L37)

___

### save

▸ **save**(`slot`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[persistence/src/managers/SaveManager.ts:44](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/managers/SaveManager.ts#L44)

___

### update

▸ **update**(`ecs`, `elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Inherited from

Manager.update

#### Defined in

core/lib/ecs/Manager.d.ts:10
