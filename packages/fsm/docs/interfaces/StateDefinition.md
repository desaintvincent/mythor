[@mythor/fsm](../README.md) / [Exports](../modules.md) / StateDefinition

# Interface: StateDefinition<TState, TContext\>

A single state definition within a state table: which events transition to
which state, plus optional side-effect hooks run on entering/exiting it.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | extends `string` |
| `TContext` | `TContext` |

## Table of contents

### Properties

- [onEnter](StateDefinition.md#onenter)
- [onExit](StateDefinition.md#onexit)
- [transitions](StateDefinition.md#transitions)

## Properties

### onEnter

• `Optional` **onEnter**: (`context`: `TContext`) => `void`

#### Type declaration

▸ (`context`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `TContext` |

##### Returns

`void`

#### Defined in

[StateMachine.ts:7](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L7)

___

### onExit

• `Optional` **onExit**: (`context`: `TContext`) => `void`

#### Type declaration

▸ (`context`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `TContext` |

##### Returns

`void`

#### Defined in

[StateMachine.ts:8](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L8)

___

### transitions

• **transitions**: `Partial`<`Record`<`string`, `TState`\>\>

#### Defined in

[StateMachine.ts:6](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L6)
