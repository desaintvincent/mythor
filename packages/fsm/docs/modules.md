[@mythor/fsm](README.md) / Exports

# @mythor/fsm

## Table of contents

### Classes

- [StateMachine](classes/StateMachine.md)

### Interfaces

- [StateDefinition](interfaces/StateDefinition.md)

### Type Aliases

- [StateTable](modules.md#statetable)

## Type Aliases

### StateTable

Ƭ **StateTable**<`TState`, `TContext`\>: `Record`<`TState`, [`StateDefinition`](interfaces/StateDefinition.md)<`TState`, `TContext`\>\>

The full set of states a `StateMachine` can be in, keyed by state name.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | extends `string` |
| `TContext` | `TContext` |

#### Defined in

[StateMachine.ts:14](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L14)
