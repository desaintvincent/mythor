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
- [ellipses](Physic.md#ellipses)
- [filterCategoryBits](Physic.md#filtercategorybits)
- [filterMaskBits](Physic.md#filtermaskbits)
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
- [type](Physic.md#type)
- [signature](Physic.md#signature)

## Constructors

### constructor

• **new Physic**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`PhysicParams`](../interfaces/PhysicParams.md) |

#### Overrides

Component.constructor

#### Defined in

[physic2d/src/components/Physic.ts:51](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L51)

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

[physic2d/src/components/Physic.ts:32](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L32)

___

### bullet

• `Readonly` **bullet**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:43](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L43)

___

### density

• `Readonly` **density**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:41](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L41)

___

### ellipses

• `Readonly` **ellipses**: `number`[]

#### Defined in

[physic2d/src/components/Physic.ts:36](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L36)

___

### filterCategoryBits

• `Optional` **filterCategoryBits**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:48](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L48)

___

### filterMaskBits

• `Optional` **filterMaskBits**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:49](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L49)

___

### fixedRotation

• **fixedRotation**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:33](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L33)

___

### friction

• `Readonly` **friction**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:39](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L39)

___

### gravityScale

• **gravityScale**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:45](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L45)

___

### initialLinearVelocity

• `Readonly` **initialLinearVelocity**: `default`

#### Defined in

[physic2d/src/components/Physic.ts:44](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L44)

___

### interactWithWorld

• `Readonly` **interactWithWorld**: `boolean`

#### Defined in

[physic2d/src/components/Physic.ts:46](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L46)

___

### linearDamping

• `Readonly` **linearDamping**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:42](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L42)

___

### mass

• `Readonly` **mass**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:34](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L34)

___

### offset

• `Readonly` **offset**: `default`

#### Defined in

[physic2d/src/components/Physic.ts:38](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L38)

___

### polygons

• `Readonly` **polygons**: { `x`: `number` ; `y`: `number`  }[][]

#### Defined in

[physic2d/src/components/Physic.ts:35](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L35)

___

### restitution

• `Readonly` **restitution**: `number`

#### Defined in

[physic2d/src/components/Physic.ts:40](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L40)

___

### size

• `Optional` `Readonly` **size**: `default`

#### Defined in

[physic2d/src/components/Physic.ts:37](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L37)

___

### type

• **type**: [`PhysicType`](../enums/PhysicType.md)

#### Defined in

[physic2d/src/components/Physic.ts:47](https://github.com/desaintvincent/mythor/blob/53eaf4e/packages/physic2d/src/components/Physic.ts#L47)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
