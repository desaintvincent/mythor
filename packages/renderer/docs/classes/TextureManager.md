[@mythor/renderer](../README.md) / [Exports](../modules.md) / TextureManager

# Class: TextureManager

## Hierarchy

- `Manager`

  ↳ **`TextureManager`**

## Table of contents

### Constructors

- [constructor](TextureManager.md#constructor)

### Properties

- [ecs](TextureManager.md#ecs)
- [imagesToLoad](TextureManager.md#imagestoload)
- [loadingName](TextureManager.md#loadingname)
- [textures](TextureManager.md#textures)
- [signature](TextureManager.md#signature)

### Accessors

- [name](TextureManager.md#name)

### Methods

- [\_loadAndTrack](TextureManager.md#_loadandtrack)
- [add](TextureManager.md#add)
- [clear](TextureManager.md#clear)
- [createLoadingState](TextureManager.md#createloadingstate)
- [get](TextureManager.md#get)
- [has](TextureManager.md#has)
- [init](TextureManager.md#init)
- [postUpdate](TextureManager.md#postupdate)
- [setLoadingState](TextureManager.md#setloadingstate)
- [update](TextureManager.md#update)

## Constructors

### constructor

• **new TextureManager**(`images?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `images` | [`string`, `string`][] | `[]` |

#### Overrides

Manager.constructor

#### Defined in

[renderer/src/managers/TextureManager.ts:11](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L11)

## Properties

### ecs

• `Protected` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:5

___

### imagesToLoad

• `Private` `Readonly` **imagesToLoad**: `Map`<`string`, `string`\>

#### Defined in

[renderer/src/managers/TextureManager.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L7)

___

### loadingName

• `Private` `Readonly` **loadingName**: `string` = `'Textures'`

#### Defined in

[renderer/src/managers/TextureManager.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L9)

___

### textures

• `Private` `Readonly` **textures**: `Map`<`string`, [`Texture`](Texture.md)\>

#### Defined in

[renderer/src/managers/TextureManager.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L8)

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

### \_loadAndTrack

▸ `Private` **_loadAndTrack**(`name`, `path`, `gl`): `Promise`<[`Texture`](Texture.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `path` | `string` |
| `gl` | `WebGL2RenderingContext` |

#### Returns

`Promise`<[`Texture`](Texture.md)\>

#### Defined in

[renderer/src/managers/TextureManager.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L18)

___

### add

▸ **add**(`name`, `path`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `path` | `string` |

#### Returns

`void`

#### Defined in

[renderer/src/managers/TextureManager.ts:81](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L81)

___

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

▸ `Private` **createLoadingState**(`textureNumber`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `textureNumber` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/managers/TextureManager.ts:31](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L31)

___

### get

▸ **get**(`name`): [`Texture`](Texture.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

[`Texture`](Texture.md)

#### Defined in

[renderer/src/managers/TextureManager.ts:89](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L89)

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

[renderer/src/managers/TextureManager.ts:85](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L85)

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

[renderer/src/managers/TextureManager.ts:58](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L58)

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

### setLoadingState

▸ `Private` **setLoadingState**(`current`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `number` |

#### Returns

`void`

#### Defined in

[renderer/src/managers/TextureManager.ts:43](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/managers/TextureManager.ts#L43)

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
