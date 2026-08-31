[@mythor/persistence](../README.md) / [Exports](../modules.md) / StorageBackend

# Interface: StorageBackend

Pluggable storage abstraction used by `SaveManager`. Methods may be sync
or async so both `localStorage`-like and `IndexedDB`-like backends can
implement this interface.

## Implemented by

- [`LocalStorageBackend`](../classes/LocalStorageBackend.md)

## Table of contents

### Methods

- [getItem](StorageBackend.md#getitem)
- [keys](StorageBackend.md#keys)
- [removeItem](StorageBackend.md#removeitem)
- [setItem](StorageBackend.md#setitem)

## Methods

### getItem

▸ **getItem**(`key`): ``null`` \| `string` \| `Promise`<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

``null`` \| `string` \| `Promise`<``null`` \| `string`\>

#### Defined in

[persistence/src/storage/StorageBackend.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/StorageBackend.ts#L7)

___

### keys

▸ **keys**(): `string`[] \| `Promise`<`string`[]\>

#### Returns

`string`[] \| `Promise`<`string`[]\>

#### Defined in

[persistence/src/storage/StorageBackend.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/StorageBackend.ts#L10)

___

### removeItem

▸ **removeItem**(`key`): `void` \| `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[persistence/src/storage/StorageBackend.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/StorageBackend.ts#L9)

___

### setItem

▸ **setItem**(`key`, `value`): `void` \| `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

#### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[persistence/src/storage/StorageBackend.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/persistence/src/storage/StorageBackend.ts#L8)
