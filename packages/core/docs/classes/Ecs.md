[@mythor/core](../README.md) / [Exports](../modules.md) / Ecs

# Class: Ecs

## Implements

- `IEcs`

## Table of contents

### Constructors

- [constructor](Ecs.md#constructor)

### Properties

- [\_duration](Ecs.md#_duration)
- [\_entities](Ecs.md#_entities)
- [\_entitiesToCreate](Ecs.md#_entitiestocreate)
- [\_entitiesToDestroy](Ecs.md#_entitiestodestroy)
- [\_entityCollections](Ecs.md#_entitycollections)
- [\_managers](Ecs.md#_managers)
- [\_queueEntities](Ecs.md#_queueentities)
- [\_systems](Ecs.md#_systems)

### Accessors

- [duration](Ecs.md#duration)
- [entities](Ecs.md#entities)
- [entityCollections](Ecs.md#entitycollections)
- [managers](Ecs.md#managers)
- [systems](Ecs.md#systems)

### Methods

- [\_\_destroyEntity](Ecs.md#__destroyentity)
- [addEntityToCollections](Ecs.md#addentitytocollections)
- [create](Ecs.md#create)
- [createList](Ecs.md#createlist)
- [destroyEntities](Ecs.md#destroyentities)
- [destroyEntity](Ecs.md#destroyentity)
- [entity](Ecs.md#entity)
- [flush](Ecs.md#flush)
- [getEntityNumber](Ecs.md#getentitynumber)
- [init](Ecs.md#init)
- [manager](Ecs.md#manager)
- [registerManagers](Ecs.md#registermanagers)
- [registerSystems](Ecs.md#registersystems)
- [stop](Ecs.md#stop)
- [system](Ecs.md#system)
- [update](Ecs.md#update)

## Constructors

### constructor

• **new Ecs**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`EcsOptions`](../interfaces/EcsOptions.md) |

#### Defined in

[ecs/Ecs.ts:36](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L36)

## Properties

### \_duration

• `Private` **\_duration**: `number`

#### Defined in

[ecs/Ecs.ts:34](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L34)

___

### \_entities

• `Private` `Readonly` **\_entities**: `Map`<`string`, [`Entity`](Entity.md)\>

#### Defined in

[ecs/Ecs.ts:28](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L28)

___

### \_entitiesToCreate

• `Private` `Readonly` **\_entitiesToCreate**: [`Entity`](Entity.md)[] = `[]`

#### Defined in

[ecs/Ecs.ts:31](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L31)

___

### \_entitiesToDestroy

• `Private` `Readonly` **\_entitiesToDestroy**: [`Entity`](Entity.md)[] = `[]`

#### Defined in

[ecs/Ecs.ts:32](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L32)

___

### \_entityCollections

• `Private` `Readonly` **\_entityCollections**: `EntityCollection`

#### Defined in

[ecs/Ecs.ts:27](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L27)

___

### \_managers

• `Private` `Readonly` **\_managers**: [`SignableMap`](SignableMap.md)<[`Manager`](Manager.md)\>

#### Defined in

[ecs/Ecs.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L26)

___

### \_queueEntities

• `Private` **\_queueEntities**: `boolean`

#### Defined in

[ecs/Ecs.ts:30](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L30)

___

### \_systems

• `Private` `Readonly` **\_systems**: [`SignableMap`](SignableMap.md)<[`System`](System.md)\>

#### Defined in

[ecs/Ecs.ts:25](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L25)

## Accessors

### duration

• `get` **duration**(): `number`

#### Returns

`number`

#### Defined in

[ecs/Ecs.ts:76](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L76)

___

### entities

• `get` **entities**(): `Map`<`string`, [`Entity`](Entity.md)\>

#### Returns

`Map`<`string`, [`Entity`](Entity.md)\>

#### Defined in

[ecs/Ecs.ts:56](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L56)

___

### entityCollections

• `get` **entityCollections**(): `EntityCollection`

#### Returns

`EntityCollection`

#### Defined in

[ecs/Ecs.ts:72](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L72)

___

### managers

• `get` **managers**(): [`SignableMap`](SignableMap.md)<[`Manager`](Manager.md)\>

#### Returns

[`SignableMap`](SignableMap.md)<[`Manager`](Manager.md)\>

#### Defined in

[ecs/Ecs.ts:68](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L68)

___

### systems

• `get` **systems**(): [`SignableMap`](SignableMap.md)<[`System`](System.md)\>

#### Returns

[`SignableMap`](SignableMap.md)<[`System`](System.md)\>

#### Defined in

[ecs/Ecs.ts:64](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L64)

## Methods

### \_\_destroyEntity

▸ `Private` **__destroyEntity**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:213](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L213)

___

### addEntityToCollections

▸ **addEntityToCollections**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Implementation of

IEcs.addEntityToCollections

#### Defined in

[ecs/Ecs.ts:188](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L188)

___

### create

▸ **create**(`id?`): [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id?` | `string` |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Ecs.ts:169](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L169)

___

### createList

▸ **createList**(`options`, `listConstructor?`): [`IList`](../interfaces/IList.md)<[`Entity`](Entity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ArrayListOptions`](../interfaces/ArrayListOptions.md)<[`Entity`](Entity.md)\> |
| `listConstructor?` | [`Constructor`](../modules.md#constructor)<[`IList`](../interfaces/IList.md)<[`Entity`](Entity.md)\>\> |

#### Returns

[`IList`](../interfaces/IList.md)<[`Entity`](Entity.md)\>

#### Defined in

[ecs/Ecs.ts:181](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L181)

___

### destroyEntities

▸ `Private` **destroyEntities**(): `void`

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:127](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L127)

___

### destroyEntity

▸ **destroyEntity**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Implementation of

IEcs.destroyEntity

#### Defined in

[ecs/Ecs.ts:195](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L195)

___

### entity

▸ **entity**(`entityId`): `undefined` \| [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityId` | `string` |

#### Returns

`undefined` \| [`Entity`](Entity.md)

#### Defined in

[ecs/Ecs.ts:165](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L165)

___

### flush

▸ **flush**(`reset?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `reset` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:199](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L199)

___

### getEntityNumber

▸ **getEntityNumber**(): `number`

#### Returns

`number`

#### Defined in

[ecs/Ecs.ts:60](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L60)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[ecs/Ecs.ts:80](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L80)

___

### manager

▸ **manager**<`C`\>(`constructor`): `C`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`Manager`](Manager.md)<`C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](../modules.md#constructor)<`C`\> |

#### Returns

`C`

#### Defined in

[ecs/Ecs.ts:161](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L161)

___

### registerManagers

▸ **registerManagers**(...`managerInstances`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...managerInstances` | [`Manager`](Manager.md)[] |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:147](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L147)

___

### registerSystems

▸ **registerSystems**(...`systemInstances`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...systemInstances` | [`System`](System.md)[] |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:137](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L137)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:90](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L90)

___

### system

▸ **system**<`C`\>(`constructor`): `C`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`System`](System.md)<`C`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](../modules.md#constructor)<`C`\> |

#### Returns

`C`

#### Defined in

[ecs/Ecs.ts:157](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L157)

___

### update

▸ **update**(`elapsedTimeInSeconds`, `totalTimeInSeconds`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elapsedTimeInSeconds` | `number` |
| `totalTimeInSeconds` | `number` |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:102](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/ecs/Ecs.ts#L102)
