[@mythor/renderer](../README.md) / [Exports](../modules.md) / Sprite

# Class: Sprite

## Hierarchy

- `Component`

  ↳ **`Sprite`**

## Table of contents

### Constructors

- [constructor](Sprite.md#constructor)

### Properties

- [\_entity](Sprite.md#_entity)
- [alpha](Sprite.md#alpha)
- [anchor](Sprite.md#anchor)
- [offset](Sprite.md#offset)
- [origin](Sprite.md#origin)
- [parallax](Sprite.md#parallax)
- [scale](Sprite.md#scale)
- [size](Sprite.md#size)
- [texture](Sprite.md#texture)
- [tint](Sprite.md#tint)
- [visible](Sprite.md#visible)
- [signature](Sprite.md#signature)

## Constructors

### constructor

• **new Sprite**(`texture`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `texture` | [`Texture`](Texture.md) |
| `options?` | `SpriteOptions` |

#### Overrides

Component.constructor

#### Defined in

[renderer/src/components/Sprite.ts:28](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L28)

## Properties

### \_entity

• **\_entity**: `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### alpha

• **alpha**: `number`

#### Defined in

[renderer/src/components/Sprite.ts:21](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L21)

___

### anchor

• **anchor**: `default`

#### Defined in

[renderer/src/components/Sprite.ts:19](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L19)

___

### offset

• **offset**: `default`

#### Defined in

[renderer/src/components/Sprite.ts:24](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L24)

___

### origin

• **origin**: `default`

#### Defined in

[renderer/src/components/Sprite.ts:22](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L22)

___

### parallax

• **parallax**: `default`

#### Defined in

[renderer/src/components/Sprite.ts:23](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L23)

___

### scale

• **scale**: `default`

#### Defined in

[renderer/src/components/Sprite.ts:26](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L26)

___

### size

• **size**: `default`

#### Defined in

[renderer/src/components/Sprite.ts:25](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L25)

___

### texture

• `Readonly` **texture**: [`Texture`](Texture.md)

#### Defined in

[renderer/src/components/Sprite.ts:17](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L17)

___

### tint

• **tint**: `number`

#### Defined in

[renderer/src/components/Sprite.ts:20](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L20)

___

### visible

• **visible**: `boolean`

#### Defined in

[renderer/src/components/Sprite.ts:18](https://github.com/desaintvincent/mythor/blob/6cabc00/packages/renderer/src/components/Sprite.ts#L18)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
