import { Ecs, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import NetworkManager from '../src/managers/NetworkManager'
import OwnedNetworked from '../src/components/OwnedNetworked'
import PredictionSystem from '../src/systems/PredictionSystem'
import FakeTransport from './util/FakeTransport'

interface Input {
  dx: number
}

function applyInput(transform: Transform, input: Input, dt: number): void {
  transform.position.vSet(transform.position.add(new Vec2(input.dx * dt, 0)))
}

async function setup() {
  const ecs = new Ecs()
  const transport = new FakeTransport()
  const manager = new NetworkManager({ transport })
  ecs.registerManagers(manager)
  ecs.registerSystems(new PredictionSystem())
  await ecs.init()
  manager.connect('ws://localhost')

  return { ecs, transport, manager }
}

describe('PredictionSystem', () => {
  it('predicts by applying input immediately every frame', async () => {
    const { ecs } = await setup()
    let input: Input = { dx: 1 }
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(new OwnedNetworked<Input>({ getInput: () => input, applyInput }))

    ecs.update(1, 1)

    expect(entity.get(Transform).position.x).toBeCloseTo(1)

    input = { dx: 2 }
    ecs.update(1, 2)

    expect(entity.get(Transform).position.x).toBeCloseTo(3)
  })

  it('sends an input message for every predicted frame', async () => {
    const { ecs, transport } = await setup()
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(
      new OwnedNetworked<Input>({ getInput: () => ({ dx: 1 }), applyInput })
    )

    ecs.update(1, 1)
    // Outbox queued during this frame's system pass is only flushed at the
    // start of the manager's *next* update (frame-synced discipline).
    ecs.update(0, 1)

    expect(transport.sent).toHaveLength(1)
    const message = JSON.parse(transport.sent[0])
    expect(message).toEqual({
      v: 1,
      type: 'input',
      entityId: entity._id,
      seq: 0,
      input: { dx: 1 },
    })
  })

  it('reconciles by snapping to authoritative state and replaying unacked inputs', async () => {
    const { ecs, transport } = await setup()
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(
      new OwnedNetworked<Input>({ getInput: () => ({ dx: 1 }), applyInput })
    )

    // Frame 1: predicts seq 0 (dx 1, dt 1) -> position.x = 1 (queued, not
    // yet flushed: outbox flush happens at the start of the *next* frame)
    ecs.update(1, 1)
    // Frame 2: manager flushes seq 0; predicts seq 1 (dx 1, dt 1) -> x = 2
    ecs.update(1, 2)
    expect(entity.get(Transform).position.x).toBeCloseTo(2)
    expect(transport.sent).toHaveLength(1)

    // Server acked seq 0 only, authoritative x is 1 (matches, no misprediction)
    transport.emit(
      JSON.stringify({
        v: 1,
        type: 'snapshot',
        entities: [
          {
            id: entity._id,
            transform: { position: [1, 0], rotation: 0 },
            ackSeq: 0,
          },
        ],
      })
    )

    // Frame 3: manager update dispatches the snapshot (reconcile: snap to
    // x=1, replay pending seq 1 -> x=2), then predicts seq 2 -> x=3
    ecs.update(1, 3)

    expect(entity.get(Transform).position.x).toBeCloseTo(3)
  })

  it('ignores snapshot entries without ackSeq (remote entities)', async () => {
    const { ecs, transport } = await setup()
    const entity = ecs.create()
    entity.add(new Transform())
    entity.add(
      new OwnedNetworked<Input>({ getInput: () => ({ dx: 1 }), applyInput })
    )

    ecs.update(1, 1)
    expect(entity.get(Transform).position.x).toBeCloseTo(1)

    transport.emit(
      JSON.stringify({
        v: 1,
        type: 'snapshot',
        entities: [
          { id: entity._id, transform: { position: [99, 99], rotation: 0 } },
        ],
      })
    )
    ecs.update(1, 2)

    // Not reconciled (no ackSeq): position keeps predicting normally,
    // unaffected by the remote-only snapshot entry.
    expect(entity.get(Transform).position.x).toBeCloseTo(2)
  })
})
