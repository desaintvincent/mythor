[@mythor/ui](README.md) / Exports

# @mythor/ui

## Table of contents

### Classes

- [Button](classes/Button.md)
- [ButtonSystem](classes/ButtonSystem.md)

### Interfaces

- [ButtonOptions](interfaces/ButtonOptions.md)
- [CreateButtonOptions](interfaces/CreateButtonOptions.md)
- [LabelOptions](interfaces/LabelOptions.md)
- [PanelOptions](interfaces/PanelOptions.md)

### Functions

- [createButton](modules.md#createbutton)
- [createLabel](modules.md#createlabel)
- [createPanel](modules.md#createpanel)

## Functions

### createButton

▸ **createButton**(`options?`): `Component`[]

Clickable UI entity: background rect (`FillRect`) + interactive state
(`Button`, driven by `ButtonSystem`) + an optional text label
(`RenderedText`, centered on the button). `Transform.size` is also the
hit-test bounds used by `ButtonSystem`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`CreateButtonOptions`](interfaces/CreateButtonOptions.md) |

#### Returns

`Component`[]

#### Defined in

[ui/src/factories/createButton.ts:32](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L32)

___

### createLabel

▸ **createLabel**(`str`, `options?`): `Component`[]

Text primitive for UI entities. Thin naming wrapper around the existing
`RenderedText` component (already "wraps the renderer's Text object") —
no new rendering logic, purely composition for naming parity with
`Panel`/`Button`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `options?` | [`LabelOptions`](interfaces/LabelOptions.md) |

#### Returns

`Component`[]

#### Defined in

[ui/src/factories/createLabel.ts:23](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createLabel.ts#L23)

___

### createPanel

▸ **createPanel**(`options?`): `Component`[]

Container/background primitive. A `Panel` is plain composition of existing
renderer primitives (`Transform` + `Renderable` + `FillRect`) — grouping
and relative positioning of children is already provided for free by
`Entity.addChild()` + `Transform`'s parent-relative `position`/`rotation`,
so no dedicated layout engine or component is needed here.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`PanelOptions`](interfaces/PanelOptions.md) |

#### Returns

`Component`[]

#### Defined in

[ui/src/factories/createPanel.ts:29](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createPanel.ts#L29)
