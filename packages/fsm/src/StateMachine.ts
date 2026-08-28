/**
 * A single state definition within a state table: which events transition to
 * which state, plus optional side-effect hooks run on entering/exiting it.
 */
export interface StateDefinition<TState extends string, TContext> {
  transitions: Partial<Record<string, TState>>
  onEnter?: (context: TContext) => void
  onExit?: (context: TContext) => void
}

/**
 * The full set of states a `StateMachine` can be in, keyed by state name.
 */
export type StateTable<TState extends string, TContext> = Record<
  TState,
  StateDefinition<TState, TContext>
>

/**
 * Generic, ECS-independent finite state machine.
 *
 * Built from a state table, an initial state and a context object passed to
 * `onEnter`/`onExit` hooks. `fire(event)` transitions if the current state
 * declares that event, and silently no-ops (returns `false`) otherwise, so
 * consumers can fire events speculatively without guarding every call.
 */
export default class StateMachine<TState extends string, TContext> {
  private readonly states: StateTable<TState, TContext>

  private readonly context: TContext

  private state: TState

  public constructor(
    states: StateTable<TState, TContext>,
    initialState: TState,
    context: TContext
  ) {
    this.states = states
    this.context = context
    this.state = initialState

    this.states[this.state].onEnter?.(this.context)
  }

  public get current(): TState {
    return this.state
  }

  public fire(event: string): boolean {
    const nextState = this.states[this.state].transitions[event]

    if (nextState === undefined) {
      return false
    }

    this.states[this.state].onExit?.(this.context)
    this.state = nextState
    this.states[this.state].onEnter?.(this.context)

    return true
  }
}
