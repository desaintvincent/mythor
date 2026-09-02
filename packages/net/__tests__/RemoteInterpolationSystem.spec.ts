import { Ecs, Transform } from '@mythor/core'
import NetworkManager from '../src/managers/NetworkManager'
import RemoteNetworked from '../src/components/RemoteNetworked'
import RemoteInterpolationSystem from '../src/systems/RemoteInterpolationSystem'
import FakeTransport from './util/FakeTransport'

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

function snapshot(id: string, position: [number, number], rotation: number) {
  return JSON.stringify({
    v: 1,
    type: 'snapshot',
    entities: [{ id, transform: { position, rotation } }],
  })
}

describe('RemoteInterpolationSystem', () => {
  it('does nothing until at least two samples are received', async () => {
    const { ecs, transport } = await setup()
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(snapshot(entity._id, [5, 0], 0))
    ecs.update(0, 0)

    expect(entity.get(Transform).position.x).toBe(0)
  })

  it('blends position/rotation between the last two snapshots', async () => {
    jest.useFakeTimers()
    const start = 1_000_000
    jest.setSystemTime(start)

    const { ecs, transport } = await setup()
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(snapshot(entity._id, [0, 0], 0))
    ecs.update(0, 0)

    jest.setSystemTime(start + 1000) // +1s
    transport.emit(snapshot(entity._id, [10, 0], 0))
    ecs.update(0, 0) // dispatches snapshot then interpolates at renderTime = start+1s

    // renderTime aligns exactly with the second sample -> alpha = 1
    expect(entity.get(Transform).position.x).toBeCloseTo(10)

    jest.useRealTimers()
  })

  it('holds last known position when no newer snapshot arrives', async () => {
    jest.useFakeTimers()
    const start = 1_000_000
    jest.setSystemTime(start)

    const { ecs, transport } = await setup()
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(new RemoteNetworked({ interpolationDelay: 0 }))

    transport.emit(snapshot(entity._id, [0, 0], 0))
    ecs.update(0, 0)
    jest.setSystemTime(start + 100)
    transport.emit(snapshot(entity._id, [10, 0], 0))
    ecs.update(0, 0)

    jest.setSystemTime(start + 100_000) // long after, no new sample
    ecs.update(0, 0)

    expect(entity.get(Transform).position.x).toBeCloseTo(10)

    jest.useRealTimers()
  })
})
