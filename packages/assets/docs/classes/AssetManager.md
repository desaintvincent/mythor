[@mythor/assets](../README.md) / [Exports](../modules.md) / AssetManager

# Class: AssetManager

## Hierarchy

- `Manager`

  ↳ **`AssetManager`**

## Table of contents

### Constructors

- [constructor](AssetManager.md#constructor)

### Properties

- [assets](AssetManager.md#assets)
- [ecs](AssetManager.md#ecs)
- [loaders](AssetManager.md#loaders)
- [progressCallbacks](AssetManager.md#progresscallbacks)
- [signature](AssetManager.md#signature)

### Accessors

- [name](AssetManager.md#name)

### Methods

- [clear](AssetManager.md#clear)
- [createLoadingState](AssetManager.md#createloadingstate)
- [get](AssetManager.md#get)
- [has](AssetManager.md#has)
- [init](AssetManager.md#init)
- [load](AssetManager.md#load)
- [notifyProgress](AssetManager.md#notifyprogress)
- [onProgress](AssetManager.md#onprogress)
- [postUpdate](AssetManager.md#postupdate)
- [registerLoader](AssetManager.md#registerloader)
- [setLoadingState](AssetManager.md#setloadingstate)
- [update](AssetManager.md#update)

## Constructors

### constructor

• **new AssetManager**()

#### Overrides

Manager.constructor

#### Defined in

[assets/src/managers/AssetManager.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L19)

## Properties

### assets

• `Private` `Readonly` **assets**: `Map`<`string`, `unknown`\>

#### Defined in

[assets/src/managers/AssetManager.ts:13](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L13)

___

### ecs

• `Protected` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:5

___

### loaders

• `Private` `Readonly` **loaders**: `Map`<`string`, [`AssetLoader`](../modules.md#assetloader)\>

#### Defined in

[assets/src/managers/AssetManager.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L15)

___

### progressCallbacks

• `Private` `Readonly` **progressCallbacks**: `Set`<[`AssetProgressCallback`](../modules.md#assetprogresscallback)\>

#### Defined in

[assets/src/managers/AssetManager.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L17)

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

### createLoadingState

▸ `Private` **createLoadingState**(`total`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `total` | `number` |

#### Returns

`void`

#### Defined in

[assets/src/managers/AssetManager.ts:93](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L93)

___

### get

▸ **get**<`T`\>(`name`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`T`

#### Defined in

[assets/src/managers/AssetManager.ts:46](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L46)

___

### has

▸ **has**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Defined in

[assets/src/managers/AssetManager.ts:42](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L42)

___

### init

▸ **init**(`ecs`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ecs` | `default` |

#### Returns

`Promise`<`void`\>

#### Overrides

Manager.init

#### Defined in

[assets/src/managers/AssetManager.ts:30](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L30)

___

### load

▸ **load**(`manifest`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `manifest` | readonly [`AssetManifestEntry`](../interfaces/AssetManifestEntry.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[assets/src/managers/AssetManager.ts:56](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L56)

___

### notifyProgress

▸ `Private` **notifyProgress**(`current`, `total`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `number` |
| `total` | `number` |

#### Returns

`void`

#### Defined in

[assets/src/managers/AssetManager.ts:120](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L120)

___

### onProgress

▸ **onProgress**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`AssetProgressCallback`](../modules.md#assetprogresscallback) |

#### Returns

`void`

#### Defined in

[assets/src/managers/AssetManager.ts:38](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L38)

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

### registerLoader

▸ **registerLoader**<`T`\>(`type`, `loader`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `loader` | [`AssetLoader`](../modules.md#assetloader)<`T`\> |

#### Returns

`void`

#### Defined in

[assets/src/managers/AssetManager.ts:34](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L34)

___

### setLoadingState

▸ `Private` **setLoadingState**(`current`, `total`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `number` |
| `total` | `number` |

#### Returns

`void`

#### Defined in

[assets/src/managers/AssetManager.ts:105](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/assets/src/managers/AssetManager.ts#L105)

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
