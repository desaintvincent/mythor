[@mythor/ui](../README.md) / [Exports](../modules.md) / Button

# Class: Button

Interactive state for a clickable UI entity. Combined with a `Transform`
(for hit-testing bounds) and driven every frame by `ButtonSystem`, which is
the only place allowed to mutate `hovered`/`pressed`/`clicked`.

## Hierarchy

- `Component`

  ↳ **`Button`**

## Table of contents

### Constructors

- [constructor](Button.md#constructor)

### Properties

- [\_entity](Button.md#_entity)
- [clicked](Button.md#clicked)
- [disabled](Button.md#disabled)
- [hovered](Button.md#hovered)
- [onClick](Button.md#onclick)
- [onHoverChange](Button.md#onhoverchange)
- [pressed](Button.md#pressed)
- [signature](Button.md#signature)

## Constructors

### constructor

• **new Button**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ButtonOptions`](../interfaces/ButtonOptions.md) |

#### Overrides

Component.constructor

#### Defined in

[ui/src/components/Button.ts:22](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L22)

## Properties

### \_entity

• **\_entity**: `undefined` \| `default`

#### Inherited from

Component.\_entity

#### Defined in

core/lib/ecs/Component.d.ts:4

___

### clicked

• **clicked**: `boolean` = `false`

#### Defined in

[ui/src/components/Button.ts:17](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L17)

___

### disabled

• **disabled**: `boolean`

#### Defined in

[ui/src/components/Button.ts:18](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L18)

___

### hovered

• **hovered**: `boolean` = `false`

#### Defined in

[ui/src/components/Button.ts:15](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L15)

___

### onClick

• `Optional` **onClick**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[ui/src/components/Button.ts:19](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L19)

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

#### Defined in

[ui/src/components/Button.ts:20](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L20)

___

### pressed

• **pressed**: `boolean` = `false`

#### Defined in

[ui/src/components/Button.ts:16](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/ui/src/components/Button.ts#L16)

___

### signature

▪ `Static` `Optional` **signature**: `number`

#### Inherited from

Component.signature

#### Defined in

core/lib/collections/Signable.d.ts:2
