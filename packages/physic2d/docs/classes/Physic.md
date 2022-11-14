[@mythor/physic2d](../README.md) / [Exports](../modules.md) / Physic

# Class: Physic

## Hierarchy

- `Component`

  ↳ **`Physic`**

## Table of contents

### Constructors

- [constructor](Physic.md#constructor)

### Properties

- [\_entity](Physic.md#_entity)
- [body](Physic.md#body)
- [bullet](Physic.md#bullet)
- [density](Physic.md#density)
- [dynamic](Physic.md#dynamic)
- [ellipses](Physic.md#ellipses)
- [fixedRotation](Physic.md#fixedrotation)
- [friction](Physic.md#friction)
- [gravityScale](Physic.md#gravityscale)
- [initialLinearVelocity](Physic.md#initiallinearvelocity)
- [interactWithWorld](Physic.md#interactwithworld)
- [linearDamping](Physic.md#lineardamping)
- [mass](Physic.md#mass)
- [offset](Physic.md#offset)
- [polygons](Physic.md#polygons)
- [restitution](Physic.md#restitution)
- [size](Physic.md#size)
- [signature](Physic.md#signature)

### Methods

- [setBody](Physic.md#setbody)

## Constructors

### constructor

• **new Physic**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `PhysicParams` |

#### Overrides

Component.constructor

#### Defined in

[physic2d/src/components/Physic.ts:41](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L41)

## Properties

### \_entity

• **\_entity**: `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### body

• **body**: `Body`

#### Defined in

[physic2d/src/components/Physic.ts:24](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L24)

___

### bullet

• `Readonly` **bullet**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:36](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L36)

___

### density

• `Readonly` **density**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:34](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L34)

___

### dynamic

• `Readonly` **dynamic**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:25](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L25)

___

### ellipses

• `Readonly` **ellipses**: `number`[]

#### Defined in

[physic2d/src/components/Physic.ts:29](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L29)

___

### fixedRotation

• `Readonly` **fixedRotation**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:26](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L26)

___

### friction

• `Readonly` **friction**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:32](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L32)

___

### gravityScale

• `Readonly` **gravityScale**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:38](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L38)

___

### initialLinearVelocity

• `Readonly` **initialLinearVelocity**: `default`

#### Defined in

[physic2d/src/components/Physic.ts:37](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L37)

___

### interactWithWorld

• `Readonly` **interactWithWorld**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:39](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L39)

___

### linearDamping

• `Readonly` **linearDamping**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:35](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L35)

___

### mass

• `Readonly` **mass**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:27](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L27)

___

### offset

• `Readonly` **offset**: `default`

#### Defined in

[physic2d/src/components/Physic.ts:31](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L31)

___

### polygons

• `Readonly` **polygons**: { `x`: `number` ; `y`: `number`  }[][]

#### Defined in

[physic2d/src/components/Physic.ts:28](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L28)

___

### restitution

• `Readonly` **restitution**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:33](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L33)

___

### size

• `Optional` `Readonly` **size**: `default`

#### Defined in

[physic2d/src/components/Physic.ts:30](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L30)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2

## Methods

### setBody

▸ **setBody**(`body`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `Body` |

#### Returns

`void`

#### Defined in

[physic2d/src/components/Physic.ts:60](https://github.com/desaintvincent/mythor/blob/b5b1f22/packages/physic2d/src/components/Physic.ts#L60)
