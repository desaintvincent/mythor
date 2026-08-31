[@mythor/fsm](../README.md) / [Exports](../modules.md) / StateMachine

# Class: StateMachine<TState, TContext\>

Generic, ECS-independent finite state machine.

Built from a state table, an initial state and a context object passed to
`onEnter`/`onExit` hooks. `fire(event)` transitions if the current state
declares that event, and silently no-ops (returns `false`) otherwise, so
consumers can fire events speculatively without guarding every call.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | extends `string` |
| `TContext` | `TContext` |

## Table of contents

### Constructors

- [constructor](StateMachine.md#constructor)

### Properties

- [context](StateMachine.md#context)
- [state](StateMachine.md#state)
- [states](StateMachine.md#states)

### Accessors

- [current](StateMachine.md#current)

### Methods

- [fire](StateMachine.md#fire)

## Constructors

### constructor

• **new StateMachine**<`TState`, `TContext`\>(`states`, `initialState`, `context`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TState` | extends `string` |
| `TContext` | `TContext` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `states` | [`StateTable`](../modules.md#statetable)<`TState`, `TContext`\> |
| `initialState` | `TState` |
| `context` | `TContext` |

#### Defined in

[StateMachine.ts:34](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L34)

## Properties

### context

• `Private` `Readonly` **context**: `TContext`

#### Defined in

[StateMachine.ts:30](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L30)

___

### state

• `Private` **state**: `TState`

#### Defined in

[StateMachine.ts:32](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L32)

___

### states

• `Private` `Readonly` **states**: [`StateTable`](../modules.md#statetable)<`TState`, `TContext`\>

#### Defined in

[StateMachine.ts:28](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L28)

## Accessors

### current

• `get` **current**(): `TState`

#### Returns

`TState`

#### Defined in

[StateMachine.ts:46](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L46)

## Methods

### fire

▸ **fire**(`event`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |

#### Returns

`boolean`

#### Defined in

[StateMachine.ts:50](https://github.com/desaintvincent/mythor/blob/ebbac95/packages/fsm/src/StateMachine.ts#L50)
