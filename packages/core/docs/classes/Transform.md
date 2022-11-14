[@mythor/core](../README.md) / [Exports](../modules.md) / Transform

# Class: Transform

## Hierarchy

- [`Component`](Component.md)

  ↳ **`Transform`**

## Table of contents

### Constructors

- [constructor](Transform.md#constructor)

### Properties

- [\_entity](Transform.md#_entity)
- [\_position](Transform.md#_position)
- [\_rotation](Transform.md#_rotation)
- [\_size](Transform.md#_size)
- [signature](Transform.md#signature)

### Accessors

- [position](Transform.md#position)
- [rotation](Transform.md#rotation)
- [size](Transform.md#size)

## Constructors

### constructor

• **new Transform**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `TransformOptions` |

#### Overrides

[Component](Component.md).[constructor](Component.md#constructor)

#### Defined in

[components/Transform.ts:15](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L15)

## Properties

### \_entity

• **\_entity**: [`Entity`](Entity.md)

#### Inherited from

[Component](Component.md).[_entity](Component.md#_entity)

#### Defined in

[ecs/Component.ts:6](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/ecs/Component.ts#L6)

___

### \_position

• `Private` `Readonly` **\_position**: `default`

#### Defined in

[components/Transform.ts:12](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L12)

___

### \_rotation

• `Private` **\_rotation**: `number`

#### Defined in

[components/Transform.ts:11](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L11)

___

### \_size

• `Private` `Readonly` **\_size**: `default`

#### Defined in

[components/Transform.ts:13](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L13)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

[Component](Component.md).[signature](Component.md#signature)

#### Defined in

[collections/Signable.ts:2](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/collections/Signable.ts#L2)

## Accessors

### position

• `get` **position**(): `default`

#### Returns

`default`

#### Defined in

[components/Transform.ts:30](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L30)

___

### rotation

• `get` **rotation**(): `number`

#### Returns

`number`

#### Defined in

[components/Transform.ts:46](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L46)

• `set` **rotation**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[components/Transform.ts:58](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L58)

___

### size

• `get` **size**(): `default`

#### Returns

`default`

#### Defined in

[components/Transform.ts:26](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/core/src/components/Transform.ts#L26)
