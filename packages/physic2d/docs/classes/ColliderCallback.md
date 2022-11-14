[@mythor/physic2d](../README.md) / [Exports](../modules.md) / ColliderCallback

# Class: ColliderCallback

## Hierarchy

- `Component`

  ↳ **`ColliderCallback`**

## Table of contents

### Constructors

- [constructor](ColliderCallback.md#constructor)

### Properties

- [\_entity](ColliderCallback.md#_entity)
- [cb](ColliderCallback.md#cb)
- [deleteOnContact](ColliderCallback.md#deleteoncontact)
- [disableContact](ColliderCallback.md#disablecontact)
- [sticky](ColliderCallback.md#sticky)
- [signature](ColliderCallback.md#signature)

### Methods

- [callback](ColliderCallback.md#callback)

## Constructors

### constructor

• **new ColliderCallback**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `ColliderCallbackOptions` |

#### Overrides

Component.constructor

#### Defined in

[physic2d/src/components/ColliderCallback.ts:25](https://github.com/desaintvincent/mythor/blob/b67d207/packages/physic2d/src/components/ColliderCallback.ts#L25)

## Properties

### \_entity

• **\_entity**: `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### cb

• `Private` `Optional` `Readonly` **cb**: `CallbackFunction`

#### Defined in

[physic2d/src/components/ColliderCallback.ts:20](https://github.com/desaintvincent/mythor/blob/b67d207/packages/physic2d/src/components/ColliderCallback.ts#L20)

___

### deleteOnContact

• `Readonly` **deleteOnContact**: `boolean`

#### Defined in

[physic2d/src/components/ColliderCallback.ts:23](https://github.com/desaintvincent/mythor/blob/b67d207/packages/physic2d/src/components/ColliderCallback.ts#L23)

___

### disableContact

• `Readonly` **disableContact**: `boolean`

#### Defined in

[physic2d/src/components/ColliderCallback.ts:21](https://github.com/desaintvincent/mythor/blob/b67d207/packages/physic2d/src/components/ColliderCallback.ts#L21)

___

### sticky

• `Readonly` **sticky**: `boolean`

#### Defined in

[physic2d/src/components/ColliderCallback.ts:22](https://github.com/desaintvincent/mythor/blob/b67d207/packages/physic2d/src/components/ColliderCallback.ts#L22)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Methods

### callback

▸ **callback**(`otherEntity`, `contact`, `contactPosition?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `otherEntity` | `default` |
| `contact` | `Contact` |
| `contactPosition?` | `default` |

#### Returns

`void`

#### Defined in

[physic2d/src/components/ColliderCallback.ts:33](https://github.com/desaintvincent/mythor/blob/b67d207/packages/physic2d/src/components/ColliderCallback.ts#L33)
