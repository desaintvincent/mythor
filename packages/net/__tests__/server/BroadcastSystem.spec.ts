import { Ecs } from '@mythor/core'
import ServerNetworkManager from '../../src/server/ServerNetworkManager'
import BroadcastSystem from '../../src/server/BroadcastSystem'
import Networked from '../../src/components/Networked'
import FakeServerTransport from './util/FakeServerTransport'
import Counter from '../util/Counter'

async function setup() {
  const ecs = new Ecs()
  const transport = new FakeServerTransport()
  const manager = new ServerNetworkManager({ port: 0, transport })
  ecs.registerManagers(manager)
  ecs.registerSystems(new BroadcastSystem())
  await ecs.init()
  manager.listen()

  return { ecs, manager, transport }
}

describe('BroadcastSystem', () => {
  it('serializes every NetworkSync component of Networked entities', async () => {
    const { ecs, transport } = await setup()
    const socket = transport.connect()

    const entity = ecs.create('e1')
    const counter = new Counter()
    counter.value = 42
    entity.add(new Networked(), counter)

    ecs.update(0, 0)
    ecs.update(0, 0)

    const message = JSON.parse(socket.sent[socket.sent.length - 1])
    expect(message.type).toBe('snapshot')
    expect(message.entities).toEqual([
      { id: 'e1', components: { Counter: { value: 42 } }, ackSeq: undefined },
    ])
  })

  it('only sets ackSeq for the owning connection', async () => {
    const { ecs, manager, transport } = await setup()
    const ownerSocket = transport.connect()
    const otherSocket = transport.connect()
    const [ownerConnection] = manager.connections

    const entity = ecs.create('player')
    entity.add(
      new Networked({ ownerConnectionId: ownerConnection.id }),
      new Counter()
    )

    ownerSocket.emit(
      JSON.stringify({
        v: 1,
        type: 'input',
        entityId: 'player',
        seq: 7,
        input: {},
      })
    )
    ecs.update(0, 0) // flushes the input (sets lastProcessedSeq)
    ecs.update(0, 0) // broadcasts, flushed one frame later (same as client)

    const ownerMessage = JSON.parse(
      ownerSocket.sent[ownerSocket.sent.length - 1]
    )
    const otherMessage = JSON.parse(
      otherSocket.sent[otherSocket.sent.length - 1]
    )

    expect(ownerMessage.entities[0].ackSeq).toBe(7)
    expect(otherMessage.entities[0].ackSeq).toBeUndefined()
  })

  it('excludes entities with no NetworkSync components attached', async () => {
    const { ecs, transport } = await setup()
    const socket = transport.connect()

    ecs.create('empty').add(new Networked())
    ecs.create('withData').add(new Networked(), new Counter())

    ecs.update(0, 0)
    ecs.update(0, 0)

    const message = JSON.parse(socket.sent[socket.sent.length - 1])
    expect(message.entities.map((e: { id: string }) => e.id)).toEqual([
      'withData',
    ])
  })
})
