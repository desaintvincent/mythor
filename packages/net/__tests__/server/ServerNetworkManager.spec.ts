import { Ecs } from '@mythor/core'
import ServerNetworkManager from '../../src/server/ServerNetworkManager'
import FakeServerTransport from './util/FakeServerTransport'

async function setup() {
  const ecs = new Ecs()
  const transport = new FakeServerTransport()
  const manager = new ServerNetworkManager({ port: 0, transport })
  ecs.registerManagers(manager)
  await ecs.init()
  manager.listen()

  return { ecs, manager, transport }
}

describe('ServerNetworkManager', () => {
  it('tracks connections as they connect and disconnect', async () => {
    const { manager, transport } = await setup()

    const socket = transport.connect()
    expect(manager.connections).toHaveLength(1)

    socket.disconnect()
    expect(manager.connections).toHaveLength(0)
  })

  it('dispatches input messages and tracks lastProcessedSeqFor', async () => {
    const { ecs, manager, transport } = await setup()
    const received: Array<{ entityId: string; seq: number; input: unknown }> =
      []
    manager.onInput((connection, entityId, seq, input) => {
      void connection
      received.push({ entityId, seq, input })
    })

    const socket = transport.connect()
    socket.emit(
      JSON.stringify({
        v: 1,
        type: 'input',
        entityId: 'e1',
        seq: 3,
        input: { dx: 1 },
      })
    )

    ecs.update(0, 0)

    expect(received).toEqual([{ entityId: 'e1', seq: 3, input: { dx: 1 } }])
    expect(manager.lastProcessedSeqFor('e1')).toBe(3)
  })

  it('broadcast() sends to every open connection, flushed on update()', async () => {
    const { ecs, manager, transport } = await setup()
    const a = transport.connect()
    const b = transport.connect()

    manager.broadcast({ sound: 'explosion' })
    expect(a.sent).toHaveLength(0)

    ecs.update(0, 0)

    expect(JSON.parse(a.sent[0])).toEqual({
      v: 1,
      type: 'message',
      payload: { sound: 'explosion' },
    })
    expect(JSON.parse(b.sent[0])).toEqual({
      v: 1,
      type: 'message',
      payload: { sound: 'explosion' },
    })
  })

  it('sendTo() only sends to the targeted connection', async () => {
    const { ecs, manager, transport } = await setup()
    const a = transport.connect()
    const b = transport.connect()
    const [connectionA] = manager.connections

    manager.sendTo(connectionA.id, { sound: 'ping' })
    ecs.update(0, 0)

    expect(a.sent).toHaveLength(1)
    expect(b.sent).toHaveLength(0)
  })

  it('malformed inbound data is silently ignored', async () => {
    const { ecs, manager, transport } = await setup()
    const inputs: unknown[] = []
    manager.onInput((...args) => inputs.push(args))

    const socket = transport.connect()
    socket.emit('not json')
    ecs.update(0, 0)

    expect(inputs).toHaveLength(0)
  })
})
