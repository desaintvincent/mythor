import { Ecs } from '@mythor/core'
import NetworkManager from '../src/managers/NetworkManager'
import Networked from '../src/components/Networked'
import RemoteNetworked from '../src/components/RemoteNetworked'
import RemoteEntitySyncSystem from '../src/systems/RemoteEntitySyncSystem'
import FakeTransport from './util/FakeTransport'
import Counter from './util/Counter'

async function setup() {
  const ecs = new Ecs()
  const transport = new FakeTransport()
  const manager = new NetworkManager({ transport })
  manager.registerComponent(Counter, () => new Counter())
  ecs.registerManagers(manager)
  ecs.registerSystems(new RemoteEntitySyncSystem())
  await ecs.init()
  manager.connect('ws://localhost')

  return { ecs, transport, manager }
}

function snapshot(ids: string[]): string {
  return JSON.stringify({
    v: 1,
    type: 'snapshot',
    entities: ids.map((id) => ({ id, components: { Counter: { value: 1 } } })),
  })
}

describe('RemoteEntitySyncSystem', () => {
  it('spawns a remote entity with its registered components on first sight', async () => {
    const { ecs, transport } = await setup()

    transport.emit(snapshot(['a']))
    ecs.update(0, 0)

    const entity = ecs.entity('a')
    expect(entity).toBeDefined()
    expect(entity?.has(Networked)).toBe(true)
    expect(entity?.has(RemoteNetworked)).toBe(true)
    expect(entity?.has(Counter)).toBe(true)
  })

  it('does not re-spawn an already-known remote entity', async () => {
    const { ecs, transport } = await setup()

    transport.emit(snapshot(['a']))
    ecs.update(0, 0)
    const first = ecs.entity('a')

    transport.emit(snapshot(['a']))
    ecs.update(0, 0)
    const second = ecs.entity('a')

    expect(second).toBe(first)
  })

  it('despawns an entity no longer present in the latest snapshot', async () => {
    const { ecs, transport } = await setup()

    transport.emit(snapshot(['a']))
    ecs.update(0, 0)
    ecs.update(0, 0)
    expect(ecs.entity('a')).toBeDefined()

    transport.emit(snapshot([]))
    ecs.update(0, 0)
    ecs.update(0, 0)

    expect(ecs.entity('a')).toBeUndefined()
  })

  it('re-spawns an entity that reappears after being despawned', async () => {
    const { ecs, transport } = await setup()

    transport.emit(snapshot(['a']))
    ecs.update(0, 0)
    ecs.update(0, 0)

    transport.emit(snapshot([]))
    ecs.update(0, 0)
    ecs.update(0, 0)
    expect(ecs.entity('a')).toBeUndefined()

    transport.emit(snapshot(['a']))
    ecs.update(0, 0)

    expect(ecs.entity('a')).toBeDefined()
  })

  it('ignores entries with ackSeq (owned by this client, not remote)', async () => {
    const { ecs, transport } = await setup()

    transport.emit(
      JSON.stringify({
        v: 1,
        type: 'snapshot',
        entities: [
          { id: 'mine', components: { Counter: { value: 1 } }, ackSeq: 0 },
        ],
      })
    )
    ecs.update(0, 0)

    expect(ecs.entity('mine')).toBeUndefined()
  })
})
