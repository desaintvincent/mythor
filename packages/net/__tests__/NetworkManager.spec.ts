import { Ecs } from '@mythor/core'
import NetworkManager from '../src/managers/NetworkManager'
import FakeTransport from './util/FakeTransport'

describe('NetworkManager', () => {
  it('starts idle and transitions through connecting/open', () => {
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    expect(manager.state).toBe('idle')

    manager.connect('ws://localhost')
    expect(manager.state).toBe('open')
  })

  it('transitions to closed on disconnect', () => {
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    manager.connect('ws://localhost')

    manager.disconnect()

    expect(manager.state).toBe('closed')
  })

  it('transitions to closed on transport error', () => {
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    manager.connect('ws://localhost')

    transport.emitError(new Error('boom'))

    expect(manager.state).toBe('closed')
  })

  it('notifies onStateChange subscribers', () => {
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    const states: string[] = []
    manager.onStateChange((state) => states.push(state))

    manager.connect('ws://localhost')

    expect(states).toEqual(['connecting', 'open'])
  })

  it('unsubscribes onStateChange handler', () => {
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    const states: string[] = []
    const unsubscribe = manager.onStateChange((state) => states.push(state))
    unsubscribe()

    manager.connect('ws://localhost')

    expect(states).toEqual([])
  })

  it('queues outgoing app messages and flushes them on update', () => {
    const ecs = new Ecs()
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    ecs.registerManagers(manager)
    manager.connect('ws://localhost')

    manager.send({ hello: 'world' })
    expect(transport.sent).toHaveLength(0)

    ecs.update(0, 0)

    expect(transport.sent).toHaveLength(1)
    expect(JSON.parse(transport.sent[0])).toEqual({
      v: 1,
      type: 'message',
      payload: { hello: 'world' },
    })
  })

  it('queues sendInput as an input message', () => {
    const ecs = new Ecs()
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    ecs.registerManagers(manager)
    manager.connect('ws://localhost')

    manager.sendInput('entity-1', 3, { dx: 1 })
    ecs.update(0, 0)

    expect(JSON.parse(transport.sent[0])).toEqual({
      v: 1,
      type: 'input',
      entityId: 'entity-1',
      seq: 3,
      input: { dx: 1 },
    })
  })

  it('does not dispatch inbound messages until update() runs', () => {
    const ecs = new Ecs()
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    ecs.registerManagers(manager)
    manager.connect('ws://localhost')
    const received: unknown[] = []
    manager.onMessage((payload) => received.push(payload))

    transport.emit(JSON.stringify({ v: 1, type: 'message', payload: 'hi' }))
    expect(received).toHaveLength(0)

    ecs.update(0, 0)
    expect(received).toEqual(['hi'])
  })

  it('dispatches snapshot messages to onSnapshot subscribers', () => {
    const ecs = new Ecs()
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    ecs.registerManagers(manager)
    manager.connect('ws://localhost')
    const snapshots: unknown[] = []
    manager.onSnapshot((message) => snapshots.push(message))

    transport.emit(
      JSON.stringify({
        v: 1,
        type: 'snapshot',
        entities: [{ id: 'e1', transform: { position: [1, 2], rotation: 0 } }],
      })
    )
    ecs.update(0, 0)

    expect(snapshots).toHaveLength(1)
  })

  it('ignores malformed/non-JSON inbound data', () => {
    const ecs = new Ecs()
    const transport = new FakeTransport()
    const manager = new NetworkManager({ transport })
    ecs.registerManagers(manager)
    manager.connect('ws://localhost')
    const received: unknown[] = []
    manager.onMessage((payload) => received.push(payload))

    transport.emit('not json{{{')
    expect(() => ecs.update(0, 0)).not.toThrow()
    expect(received).toHaveLength(0)
  })

  it('defaults to a WebSocketTransport when none is provided', () => {
    expect(() => new NetworkManager()).not.toThrow()
  })
})
