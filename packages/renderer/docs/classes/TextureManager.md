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

- [add](TextureManager.md#add)
- [clear](TextureManager.md#clear)
- [createLoadingState](TextureManager.md#createloadingstate)
- [get](TextureManager.md#get)
- [has](TextureManager.md#has)
- [init](TextureManager.md#init)
- [loadTexture](TextureManager.md#loadtexture)
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

[renderer/src/managers/TextureManager.ts:37](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L37)

## Properties

### ecs

• `Protected` `Readonly` **ecs**: `default`

#### Inherited from

Manager.ecs

#### Defined in

core/lib/ecs/Manager.d.ts:5

___

### imagesToLoad

• `Private` `Readonly` **imagesToLoad**: `Map`<`string`, `string`\>

#### Defined in

[renderer/src/managers/TextureManager.ts:33](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L33)

___

### loadingName

• `Private` `Readonly` **loadingName**: `string` = `'Textures'`

#### Defined in

[renderer/src/managers/TextureManager.ts:35](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L35)

___

### textures

• `Private` `Readonly` **textures**: `Map`<`string`, [`Texture`](Texture.md)\>

#### Defined in

[renderer/src/managers/TextureManager.ts:34](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L34)

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

[renderer/src/managers/TextureManager.ts:106](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L106)

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

[renderer/src/managers/TextureManager.ts:57](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L57)

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

[renderer/src/managers/TextureManager.ts:114](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L114)

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

[renderer/src/managers/TextureManager.ts:110](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L110)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

Manager.init

#### Defined in

[renderer/src/managers/TextureManager.ts:84](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L84)

___

### loadTexture

▸ `Private` **loadTexture**(`name`, `path`, `gl`): `Promise`<[`Texture`](Texture.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `path` | `string` |
| `gl` | `WebGL2RenderingContext` |

#### Returns

`Promise`<[`Texture`](Texture.md)\>

#### Defined in

[renderer/src/managers/TextureManager.ts:44](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L44)

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

[renderer/src/managers/TextureManager.ts:69](https://github.com/desaintvincent/mythor/blob/c881de0/packages/renderer/src/managers/TextureManager.ts#L69)

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
