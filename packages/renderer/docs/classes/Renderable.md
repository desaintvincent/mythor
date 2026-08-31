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
- [screenSpace](Renderable.md#screenspace)
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

[renderer/src/components/Renderable.ts:26](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L26)

## Properties

### \_entity

• **\_entity**: `undefined` \| `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### layer

• `Readonly` **layer**: `number` = `0`

#### Defined in

[renderer/src/components/Renderable.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L14)

___

### quadTree

• **quadTree**: ``null`` \| [`QuadTree`](QuadTree.md) = `null`

#### Defined in

[renderer/src/components/Renderable.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L16)

___

### screenSpace

• `Readonly` **screenSpace**: `boolean` = `false`

When true, this entity is rendered with the renderer's fixed GUI camera
instead of the world camera: its `Transform.position` is expressed in
screen pixels and stays fixed on screen regardless of camera pan/zoom/
rotation. It is also excluded from world-space frustum culling. Intended
for HUD/UI entities (see `@mythor/ui`).

#### Defined in

[renderer/src/components/Renderable.ts:24](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L24)

___

### shapes

• `Readonly` **shapes**: `Constructor`<`Component`\>[] = `[]`

#### Defined in

[renderer/src/components/Renderable.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L15)

___

### static

• `Readonly` **static**: `boolean` = `false`

#### Defined in

[renderer/src/components/Renderable.ts:13](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L13)

___

### visible

• `Readonly` **visible**: `boolean` = `true`

#### Defined in

[renderer/src/components/Renderable.ts:12](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/renderer/src/components/Renderable.ts#L12)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
