[@mythor/renderer](README.md) / Exports

# @mythor/renderer

## Table of contents

### Enumerations

- [TimingFunction](enums/TimingFunction.md)

### Classes

- [Animation](classes/Animation.md)
- [Animator](classes/Animator.md)
- [Camera](classes/Camera.md)
- [FillRect](classes/FillRect.md)
- [ParticleEmitter](classes/ParticleEmitter.md)
- [QuadTree](classes/QuadTree.md)
- [QuadTreeList](classes/QuadTreeList.md)
- [Renderable](classes/Renderable.md)
- [RenderedText](classes/RenderedText.md)
- [Renderer](classes/Renderer.md)
- [Sprite](classes/Sprite.md)
- [Texture](classes/Texture.md)
- [TextureManager](classes/TextureManager.md)

### Type Aliases

- [Color](modules.md#color)

### Variables

- [colorBlack](modules.md#colorblack)
- [colorBlue](modules.md#colorblue)
- [colorGreen](modules.md#colorgreen)
- [colorRed](modules.md#colorred)
- [colorWhite](modules.md#colorwhite)

### Functions

- [lerpCamera](modules.md#lerpcamera)

## Type Aliases

### Color

Ƭ **Color**: [`number`, `number`, `number`, `number`]

#### Defined in

[renderer/src/color/Color.ts:1](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/color/Color.ts#L1)

## Variables

### colorBlack

• `Const` **colorBlack**: [`Color`](modules.md#color)

#### Defined in

[renderer/src/color/Color.ts:4](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/color/Color.ts#L4)

___

### colorBlue

• `Const` **colorBlue**: [`Color`](modules.md#color)

#### Defined in

[renderer/src/color/Color.ts:7](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/color/Color.ts#L7)

___

### colorGreen

• `Const` **colorGreen**: [`Color`](modules.md#color)

#### Defined in

[renderer/src/color/Color.ts:6](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/color/Color.ts#L6)

___

### colorRed

• `Const` **colorRed**: [`Color`](modules.md#color)

#### Defined in

[renderer/src/color/Color.ts:5](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/color/Color.ts#L5)

___

### colorWhite

• `Const` **colorWhite**: [`Color`](modules.md#color)

#### Defined in

[renderer/src/color/Color.ts:3](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/color/Color.ts#L3)

## Functions

### lerpCamera

▸ **lerpCamera**(`lerpAmout?`): (`target`: `default`, `currentPosition`: `default`, `elapsedTimeInSeconds`: `number`, `camera`: [`Camera`](classes/Camera.md)) => `default`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `lerpAmout` | `number` | `0.05` |

#### Returns

`fn`

▸ (`target`, `currentPosition`, `elapsedTimeInSeconds`, `camera`): `default`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `default` |
| `currentPosition` | `default` |
| `elapsedTimeInSeconds` | `number` |
| `camera` | [`Camera`](classes/Camera.md) |

##### Returns

`default`

#### Defined in

[renderer/src/lerpCamera.ts:5](https://github.com/desaintvincent/mythor/blob/8675b4d/packages/renderer/src/lerpCamera.ts#L5)
