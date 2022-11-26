[@mythor/core](../README.md) / [Exports](../modules.md) / Ecs

# Class: Ecs

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
| `options?` | `EcsOptions` |

#### Defined in

[ecs/Ecs.ts:31](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L31)

## Properties

### \_duration

• `Private` **\_duration**: `number`

#### Defined in

[ecs/Ecs.ts:29](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L29)

___

### \_entities

• `Private` `Readonly` **\_entities**: `Map`<`string`, [`Entity`](Entity.md)\>

#### Defined in

[ecs/Ecs.ts:23](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L23)

___

### \_entitiesToCreate

• `Private` `Readonly` **\_entitiesToCreate**: [`Entity`](Entity.md)[] = `[]`

#### Defined in

[ecs/Ecs.ts:26](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L26)

___

### \_entitiesToDestroy

• `Private` `Readonly` **\_entitiesToDestroy**: [`Entity`](Entity.md)[] = `[]`

#### Defined in

[ecs/Ecs.ts:27](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L27)

___

### \_entityCollections

• `Private` `Readonly` **\_entityCollections**: `EntityCollection`

#### Defined in

[ecs/Ecs.ts:22](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L22)

___

### \_managers

• `Private` `Readonly` **\_managers**: [`SignableMap`](SignableMap.md)<[`Manager`](Manager.md)\>

#### Defined in

[ecs/Ecs.ts:21](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L21)

___

### \_queueEntities

• `Private` **\_queueEntities**: `boolean`

#### Defined in

[ecs/Ecs.ts:25](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L25)

___

### \_systems

• `Private` `Readonly` **\_systems**: [`SignableMap`](SignableMap.md)<[`System`](System.md)\>

#### Defined in

[ecs/Ecs.ts:20](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L20)

## Accessors

### duration

• `get` **duration**(): `number`

#### Returns

`number`

#### Defined in

[ecs/Ecs.ts:67](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L67)

___

### entities

• `get` **entities**(): `Map`<`string`, [`Entity`](Entity.md)\>

#### Returns

`Map`<`string`, [`Entity`](Entity.md)\>

#### Defined in

[ecs/Ecs.ts:47](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L47)

___

### entityCollections

• `get` **entityCollections**(): `EntityCollection`

#### Returns

`EntityCollection`

#### Defined in

[ecs/Ecs.ts:63](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L63)

___

### managers

• `get` **managers**(): [`SignableMap`](SignableMap.md)<[`Manager`](Manager.md)\>

#### Returns

[`SignableMap`](SignableMap.md)<[`Manager`](Manager.md)\>

#### Defined in

[ecs/Ecs.ts:59](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L59)

___

### systems

• `get` **systems**(): [`SignableMap`](SignableMap.md)<[`System`](System.md)\>

#### Returns

[`SignableMap`](SignableMap.md)<[`System`](System.md)\>

#### Defined in

[ecs/Ecs.ts:55](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L55)

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

[ecs/Ecs.ts:205](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L205)

___

### addEntityToCollections

▸ **addEntityToCollections**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:180](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L180)

___

### create

▸ **create**(`id?`): [`Entity`](Entity.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `any` | `undefined` |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Ecs.ts:161](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L161)

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

[ecs/Ecs.ts:173](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L173)

___

### destroyEntities

▸ `Private` **destroyEntities**(): `void`

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:116](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L116)

___

### destroyEntity

▸ **destroyEntity**(`entity`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entity` | [`Entity`](Entity.md) |

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:187](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L187)

___

### entity

▸ **entity**(`entityId`): [`Entity`](Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entityId` | `string` |

#### Returns

[`Entity`](Entity.md)

#### Defined in

[ecs/Ecs.ts:157](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L157)

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

[ecs/Ecs.ts:191](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L191)

___

### getEntityNumber

▸ **getEntityNumber**(): `number`

#### Returns

`number`

#### Defined in

[ecs/Ecs.ts:51](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L51)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[ecs/Ecs.ts:71](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L71)

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

[ecs/Ecs.ts:153](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L153)

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

[ecs/Ecs.ts:136](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L136)

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

[ecs/Ecs.ts:126](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L126)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[ecs/Ecs.ts:81](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L81)

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

[ecs/Ecs.ts:149](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L149)

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

[ecs/Ecs.ts:91](https://github.com/desaintvincent/mythor/blob/c0bd7c9/packages/core/src/ecs/Ecs.ts#L91)
