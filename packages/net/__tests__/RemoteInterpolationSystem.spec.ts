import { Ecs } from '@mythor/core'
import NetworkManager from '../src/managers/NetworkManager'
import RemoteNetworked from '../src/components/RemoteNetworked'
import RemoteInterpolationSystem from '../src/systems/RemoteInterpolationSystem'
import FakeTransport from './util/FakeTransport'
import Counter from './util/Counter'
import Flag from './util/Flag'

async function setup() {
  const ecs = new Ecs()
  const transport = new FakeTransport()
  const manager = new NetworkManager({ transport })
  ecs.registerManagers(manager)
  ecs.registerSystems(new RemoteInterpolationSystem())
  await ecs.init()
  manager.connect('ws://localhost')

  return { ecs, transport, manager }
}

function snapshot(id: string, value: number): string {
  return JSON.stringify({
    v: 1,
    type: 'snapshot',
    entities: [{ id, components: { Counter: { value } } }],
  })
}

function flagSnapshot(id: string, active: boolean): string {
  return JSON.stringify({
    v: 1,
    type: 'snapshot',
    entities: [{ id, components: { Flag: { active } } }],
  })
}

describe('RemoteInterpolationSystem', () => {
  it('does nothing until at least two samples are received', async () => {
    const { ecs, transport } = await setup()
    const entity = ecs.create('remote')
    entity.add(new Counter(), new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(snapshot('remote', 10))
    ecs.update(0, 0)

    expect(entity.get(Counter).value).toBe(0)
  })

  it('blends between the last two snapshots (interpolatable component)', async () => {
    jest.useFakeTimers()
    const start = 1_000_000
    jest.setSystemTime(start)

    const { ecs, transport } = await setup()
    const entity = ecs.create('remote')
    entity.add(new Counter(), new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(snapshot('remote', 0))
    ecs.update(0, 0)

    jest.setSystemTime(start + 1000)
    transport.emit(snapshot('remote', 10))
    ecs.update(0, 0)

    expect(entity.get(Counter).value).toBeCloseTo(10)

    jest.useRealTimers()
  })

  it('holds last known value when no newer snapshot arrives', async () => {
    jest.useFakeTimers()
    const start = 1_000_000
    jest.setSystemTime(start)

    const { ecs, transport } = await setup()
    const entity = ecs.create('remote')
    entity.add(new Counter(), new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(snapshot('remote', 0))
    ecs.update(0, 0)
    jest.setSystemTime(start + 100)
    transport.emit(snapshot('remote', 10))
    ecs.update(0, 0)

    jest.setSystemTime(start + 100_000)
    ecs.update(0, 0)

    expect(entity.get(Counter).value).toBeCloseTo(10)

    jest.useRealTimers()
  })

  it('snaps (no blend) a component that only implements NetworkSync', async () => {
    jest.useFakeTimers()
    const start = 1_000_000
    jest.setSystemTime(start)

    const { ecs, transport } = await setup()
    const entity = ecs.create('remote')
    entity.add(new Flag(), new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(flagSnapshot('remote', false))
    ecs.update(0, 0)

    // Only 1ms later, i.e. alpha would be tiny if this were blended.
    jest.setSystemTime(start + 1)
    transport.emit(flagSnapshot('remote', true))
    ecs.update(0, 0)

    // Snap-only components jump straight to the latest value, never
    // partially blend regardless of elapsed time.
    expect(entity.get(Flag).active).toBe(true)

    jest.useRealTimers()
  })
})
