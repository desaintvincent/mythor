import { Ecs } from '@mythor/core'
import NetworkManager from '../src/managers/NetworkManager'
import OwnedNetworked from '../src/components/OwnedNetworked'
import PredictionSystem from '../src/systems/PredictionSystem'
import FakeTransport from './util/FakeTransport'
import Counter, { CounterData } from './util/Counter'

interface Input {
  delta: number
}

function applyInput(
  entity: import('@mythor/core').Entity,
  input: Input,
  dt: number
): void {
  entity.get(Counter).value += input.delta * dt
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

function snapshot(
  id: string,
  components: Record<string, unknown>,
  ackSeq: number
): string {
  return JSON.stringify({
    v: 1,
    type: 'snapshot',
    entities: [{ id, components, ackSeq }],
  })
}

describe('PredictionSystem', () => {
  it('predicts input locally every frame using a generic component', async () => {
    const { ecs, transport } = await setup()
    let delta = 1

    const entity = ecs.create()
    entity.add(
      new Counter(),
      new OwnedNetworked<Input>({ getInput: () => ({ delta }), applyInput })
    )

    ecs.update(1, 1)
    expect(entity.get(Counter).value).toBeCloseTo(1)

    delta = 2
    ecs.update(1, 2)
    expect(entity.get(Counter).value).toBeCloseTo(3)

    void transport
  })

  it('sends an input message for every predicted frame', async () => {
    const { ecs, transport } = await setup()

    const entity = ecs.create()
    entity.add(
      new Counter(),
      new OwnedNetworked<Input>({ getInput: () => ({ delta: 1 }), applyInput })
    )

    ecs.update(1, 1)
    ecs.update(0, 1)

    expect(transport.sent).toHaveLength(1)
    expect(JSON.parse(transport.sent[0])).toEqual({
      v: 1,
      type: 'input',
      entityId: entity._id,
      seq: 0,
      input: { delta: 1 },
    })
  })

  it('reconciles a generic NetworkSync component from an authoritative snapshot', async () => {
    const { ecs, transport } = await setup()

    const entity = ecs.create()
    entity.add(
      new Counter(),
      new OwnedNetworked<Input>({ getInput: () => ({ delta: 1 }), applyInput })
    )

    ecs.update(1, 1) // predicts seq 0 -> value 1 (not yet flushed)
    ecs.update(1, 2) // flushes seq 0, predicts seq 1 -> value 2
    expect(transport.sent).toHaveLength(1)

    const data: CounterData = { value: 1 }
    transport.emit(snapshot(entity._id, { Counter: data }, 0))

    ecs.update(1, 3) // reconciles: snaps to 1, replays seq1(dt=1)->2, predicts seq2(dt=1)->3
    expect(entity.get(Counter).value).toBeCloseTo(3)
  })

  it('ignores snapshot entries without ackSeq', async () => {
    const { ecs, transport } = await setup()

    const entity = ecs.create()
    entity.add(
      new Counter(),
      new OwnedNetworked<Input>({ getInput: () => ({ delta: 1 }), applyInput })
    )

    ecs.update(1, 1)

    transport.emit(
      JSON.stringify({
        v: 1,
        type: 'snapshot',
        entities: [{ id: entity._id, components: { Counter: { value: 999 } } }],
      })
    )

    ecs.update(1, 2)
    expect(entity.get(Counter).value).toBeCloseTo(2)
  })
})
