import StateMachine, { StateTable } from '../src/StateMachine'

type LightState = 'red' | 'green' | 'yellow'

interface LightContext {
  log: string[]
}

function createLightTable(): StateTable<LightState, LightContext> {
  return {
    red: {
      transitions: { next: 'green' },
      onEnter: (context) => context.log.push('enter:red'),
      onExit: (context) => context.log.push('exit:red'),
    },
    green: {
      transitions: { next: 'yellow' },
      onEnter: (context) => context.log.push('enter:green'),
      onExit: (context) => context.log.push('exit:green'),
    },
    yellow: {
      transitions: { next: 'red' },
      onEnter: (context) => context.log.push('enter:yellow'),
      onExit: (context) => context.log.push('exit:yellow'),
    },
  }
}

describe('StateMachine', () => {
  it('starts in the initial state', () => {
    const context: LightContext = { log: [] }
    const machine = new StateMachine(createLightTable(), 'red', context)

    expect(machine.current).toBe('red')
  })

  it('calls onEnter of the initial state on construction', () => {
    const context: LightContext = { log: [] }
    // eslint-disable-next-line no-new
    new StateMachine(createLightTable(), 'red', context)

    expect(context.log).toEqual(['enter:red'])
  })

  it('transitions to the declared state on a valid event', () => {
    const context: LightContext = { log: [] }
    const machine = new StateMachine(createLightTable(), 'red', context)

    const result = machine.fire('next')

    expect(result).toBe(true)
    expect(machine.current).toBe('green')
  })

  it('rejects invalid events without throwing, current state unchanged', () => {
    const context: LightContext = { log: [] }
    const machine = new StateMachine(createLightTable(), 'red', context)

    const result = machine.fire('unknown-event')

    expect(result).toBe(false)
    expect(machine.current).toBe('red')
  })

  it('calls onExit of the old state before onEnter of the new state', () => {
    const context: LightContext = { log: [] }
    const machine = new StateMachine(createLightTable(), 'red', context)
    context.log.length = 0

    machine.fire('next')

    expect(context.log).toEqual(['exit:red', 'enter:green'])
  })

  it('passes the same context instance to every hook call', () => {
    const context: LightContext = { log: [] }
    const machine = new StateMachine(createLightTable(), 'red', context)

    machine.fire('next')
    machine.fire('next')
    machine.fire('next')

    expect(machine.current).toBe('red')
    expect(context.log).toEqual([
      'enter:red',
      'exit:red',
      'enter:green',
      'exit:green',
      'enter:yellow',
      'exit:yellow',
      'enter:red',
    ])
  })

  it('supports states with no hooks at all', () => {
    const table: StateTable<'a' | 'b', undefined> = {
      a: { transitions: { go: 'b' } },
      b: { transitions: { go: 'a' } },
    }
    const machine = new StateMachine(table, 'a', undefined)

    expect(machine.fire('go')).toBe(true)
    expect(machine.current).toBe('b')
  })
})
