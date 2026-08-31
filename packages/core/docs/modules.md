[@mythor/core](README.md) / Exports

# @mythor/core

## Table of contents

### Classes

- [Component](classes/Component.md)
- [ConstructorMap](classes/ConstructorMap.md)
- [Ecs](classes/Ecs.md)
- [Entity](classes/Entity.md)
- [List](classes/List.md)
- [LoadingStateManager](classes/LoadingStateManager.md)
- [Manager](classes/Manager.md)
- [Owner](classes/Owner.md)
- [Signable](classes/Signable.md)
- [SignableMap](classes/SignableMap.md)
- [System](classes/System.md)
- [Transform](classes/Transform.md)

### Interfaces

- [ArrayListOptions](interfaces/ArrayListOptions.md)
- [EcsOptions](interfaces/EcsOptions.md)
- [IList](interfaces/IList.md)
- [LoadingState](interfaces/LoadingState.md)

### Type Aliases

- [Constructor](modules.md#constructor)
- [Logger](modules.md#logger)

### Functions

- [getConstructor](modules.md#getconstructor)
- [getSignature](modules.md#getsignature)
- [isRegistered](modules.md#isregistered)
- [log](modules.md#log)
- [throwError](modules.md#throwerror)

## Type Aliases

### Constructor

Ƭ **Constructor**<`T`\>: (...`args`: `any`[]) => `T` & { `signature?`: `number`  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[collections/Signable.ts:5](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/Signable.ts#L5)

___

### Logger

Ƭ **Logger**: (`text`: `unknown`, `color?`: `string`) => `void`

#### Type declaration

▸ (`text`, `color?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `unknown` |
| `color?` | `string` |

##### Returns

`void`

#### Defined in

[util/log.ts:1](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/util/log.ts#L1)

## Functions

### getConstructor

▸ **getConstructor**<`T`\>(`instance`): [`Constructor`](modules.md#constructor)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`Signable`](classes/Signable.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `T` |

#### Returns

[`Constructor`](modules.md#constructor)<`T`\>

#### Defined in

[collections/Signable.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/Signable.ts#L9)

___

### getSignature

▸ **getSignature**<`T`\>(`constructor`): `number`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`Signable`](classes/Signable.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](modules.md#constructor)<`T`\> |

#### Returns

`number`

#### Defined in

[collections/Signable.ts:13](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/Signable.ts#L13)

___

### isRegistered

▸ **isRegistered**(`constructor`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | [`Constructor`](modules.md#constructor)<[`Signable`](classes/Signable.md)\> |

#### Returns

`boolean`

#### Defined in

[collections/Signable.ts:23](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/collections/Signable.ts#L23)

___

### log

▸ **log**(`text`, `color?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `unknown` |
| `color?` | `string` |

#### Returns

`void`

#### Defined in

[util/log.ts:1](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/util/log.ts#L1)

___

### throwError

▸ **throwError**(`errorString`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorString` | `string` |

#### Returns

`void`

#### Defined in

[util/throwError.ts:1](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/core/src/util/throwError.ts#L1)
