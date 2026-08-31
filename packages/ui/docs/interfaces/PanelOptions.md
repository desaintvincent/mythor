[@mythor/ui](../README.md) / [Exports](../modules.md) / PanelOptions

# Interface: PanelOptions

## Table of contents

### Properties

- [color](PanelOptions.md#color)
- [layer](PanelOptions.md#layer)
- [position](PanelOptions.md#position)
- [radius](PanelOptions.md#radius)
- [rotation](PanelOptions.md#rotation)
- [screenSpace](PanelOptions.md#screenspace)
- [size](PanelOptions.md#size)

## Properties

### color

• `Optional` **color**: `Color`

#### Defined in

[ui/src/factories/createPanel.ts:9](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L9)

___

### layer

• `Optional` **layer**: `number`

#### Defined in

[ui/src/factories/createPanel.ts:10](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L10)

___

### position

• `Optional` **position**: `default`

#### Defined in

[ui/src/factories/createPanel.ts:6](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L6)

___

### radius

• `Optional` **radius**: `number`

Corner radius in pixels, forwarded to the background `FillRect`.

#### Defined in

[ui/src/factories/createPanel.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L19)

___

### rotation

• `Optional` **rotation**: `number`

#### Defined in

[ui/src/factories/createPanel.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L8)

___

### screenSpace

• `Optional` **screenSpace**: `boolean`

Whether this panel is fixed to the screen, independent of the world
camera's pan/zoom/rotation (see `Renderable.screenSpace`). Defaults to
`true`, since UI is expected to stay put on screen. Set to `false` for
world-space UI (e.g. a nameplate anchored to a moving entity).

#### Defined in

[ui/src/factories/createPanel.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L17)

___

### size

• `Optional` **size**: `default`

#### Defined in

[ui/src/factories/createPanel.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L7)
