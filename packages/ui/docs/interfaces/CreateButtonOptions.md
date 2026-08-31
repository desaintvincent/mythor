[@mythor/ui](../README.md) / [Exports](../modules.md) / CreateButtonOptions

# Interface: CreateButtonOptions

## Hierarchy

- [`ButtonOptions`](ButtonOptions.md)

  ↳ **`CreateButtonOptions`**

## Table of contents

### Properties

- [color](CreateButtonOptions.md#color)
- [disabled](CreateButtonOptions.md#disabled)
- [label](CreateButtonOptions.md#label)
- [labelColor](CreateButtonOptions.md#labelcolor)
- [layer](CreateButtonOptions.md#layer)
- [onClick](CreateButtonOptions.md#onclick)
- [onHoverChange](CreateButtonOptions.md#onhoverchange)
- [position](CreateButtonOptions.md#position)
- [radius](CreateButtonOptions.md#radius)
- [screenSpace](CreateButtonOptions.md#screenspace)
- [size](CreateButtonOptions.md#size)

## Properties

### color

• `Optional` **color**: `Color`

#### Defined in

[ui/src/factories/createButton.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L16)

___

### disabled

• `Optional` **disabled**: `boolean`

#### Inherited from

[ButtonOptions](ButtonOptions.md).[disabled](ButtonOptions.md#disabled)

#### Defined in

[ui/src/components/Button.ts:4](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L4)

___

### label

• `Optional` **label**: `string`

#### Defined in

[ui/src/factories/createButton.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L17)

___

### labelColor

• `Optional` **labelColor**: `Color`

#### Defined in

[ui/src/factories/createButton.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L18)

___

### layer

• `Optional` **layer**: `number`

#### Defined in

[ui/src/factories/createButton.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L19)

___

### onClick

• `Optional` **onClick**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Inherited from

[ButtonOptions](ButtonOptions.md).[onClick](ButtonOptions.md#onclick)

#### Defined in

[ui/src/components/Button.ts:5](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L5)

___

### onHoverChange

• `Optional` **onHoverChange**: (`hovered`: `boolean`) => `void`

#### Type declaration

▸ (`hovered`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `hovered` | `boolean` |

##### Returns

`void`

#### Inherited from

[ButtonOptions](ButtonOptions.md).[onHoverChange](ButtonOptions.md#onhoverchange)

#### Defined in

[ui/src/components/Button.ts:6](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L6)

___

### position

• `Optional` **position**: `default`

#### Defined in

[ui/src/factories/createButton.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L14)

___

### radius

• `Optional` **radius**: `number`

Corner radius in pixels, forwarded to the background `FillRect`.

#### Defined in

[ui/src/factories/createButton.ts:21](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L21)

___

### screenSpace

• `Optional` **screenSpace**: `boolean`

See `PanelOptions.screenSpace`. Defaults to `true`.

#### Defined in

[ui/src/factories/createButton.ts:23](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L23)

___

### size

• `Optional` **size**: `default`

#### Defined in

[ui/src/factories/createButton.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/factories/createButton.ts#L15)
