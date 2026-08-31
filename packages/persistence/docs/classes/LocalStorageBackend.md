[@mythor/persistence](../README.md) / [Exports](../modules.md) / LocalStorageBackend

# Class: LocalStorageBackend

Default `StorageBackend`, backed by `window.localStorage`. Keys are
prefixed to avoid clashing with other data consumers may store there.

## Implements

- [`StorageBackend`](../interfaces/StorageBackend.md)

## Table of contents

### Constructors

- [constructor](LocalStorageBackend.md#constructor)

### Properties

- [prefix](LocalStorageBackend.md#prefix)

### Methods

- [getItem](LocalStorageBackend.md#getitem)
- [key](LocalStorageBackend.md#key)
- [keys](LocalStorageBackend.md#keys)
- [removeItem](LocalStorageBackend.md#removeitem)
- [setItem](LocalStorageBackend.md#setitem)

## Constructors

### constructor

• **new LocalStorageBackend**(`prefix?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `prefix` | `string` | `'mythor:save:'` |

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L10)

## Properties

### prefix

• `Private` `Readonly` **prefix**: `string`

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L8)

## Methods

### getItem

▸ **getItem**(`key`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

``null`` \| `string`

#### Implementation of

[StorageBackend](../interfaces/StorageBackend.md).[getItem](../interfaces/StorageBackend.md#getitem)

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L18)

___

### key

▸ `Private` **key**(`slot`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `slot` | `string` |

#### Returns

`string`

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L14)

___

### keys

▸ **keys**(): `string`[]

#### Returns

`string`[]

#### Implementation of

[StorageBackend](../interfaces/StorageBackend.md).[keys](../interfaces/StorageBackend.md#keys)

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:30](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L30)

___

### removeItem

▸ **removeItem**(`key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`void`

#### Implementation of

[StorageBackend](../interfaces/StorageBackend.md).[removeItem](../interfaces/StorageBackend.md#removeitem)

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L26)

___

### setItem

▸ **setItem**(`key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

#### Returns

`void`

#### Implementation of

[StorageBackend](../interfaces/StorageBackend.md).[setItem](../interfaces/StorageBackend.md#setitem)

#### Defined in

[persistence/src/storage/LocalStorageBackend.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/LocalStorageBackend.ts#L22)
