[@mythor/renderer](../README.md) / [Exports](../modules.md) / Renderable

# Class: Renderable

## Hierarchy

- `Component`

  ↳ **`Renderable`**

## Table of contents

### Constructors

- [constructor](Renderable.md#constructor)

### Properties

- [\_entity](Renderable.md#_entity)
- [layer](Renderable.md#layer)
- [quadTree](Renderable.md#quadtree)
- [shapes](Renderable.md#shapes)
- [static](Renderable.md#static)
- [visible](Renderable.md#visible)
- [signature](Renderable.md#signature)

## Constructors

### constructor

• **new Renderable**(`params?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `RenderableParameters` |

#### Overrides

Component.constructor

#### Defined in

[renderer/src/components/Renderable.ts:17](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/renderer/src/components/Renderable.ts#L17)

## Properties

### \_entity

• **\_entity**: `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### layer

• `Readonly` **layer**: `number` = `0`

#### Defined in

[renderer/src/components/Renderable.ts:13](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/renderer/src/components/Renderable.ts#L13)

___

### quadTree

• **quadTree**: [`QuadTree`](QuadTree.md) = `null`

#### Defined in

[renderer/src/components/Renderable.ts:15](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/renderer/src/components/Renderable.ts#L15)

___

### shapes

• `Readonly` **shapes**: `Constructor`<`Component`\>[] = `[]`

#### Defined in

[renderer/src/components/Renderable.ts:14](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/renderer/src/components/Renderable.ts#L14)

___

### static

• `Readonly` **static**: `boolean` = `false`

#### Defined in

[renderer/src/components/Renderable.ts:12](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/renderer/src/components/Renderable.ts#L12)

___

### visible

• `Readonly` **visible**: `boolean` = `true`

#### Defined in

[renderer/src/components/Renderable.ts:11](https://github.com/desaintvincent/mythor/blob/eecdc4f/packages/renderer/src/components/Renderable.ts#L11)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
