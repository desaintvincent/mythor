import {
  NetworkManager,
  OwnedNetworked,
  RemoteNetworked,
  RemoteEntitySyncSystem,
  PredictionSystem,
  RemoteInterpolationSystem,
} from '@mythor/net'
import { createGame } from '@mythor/game'
import { EventsManager, Key } from '@mythor/events'
import { Entity, System, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import {
  FillRect,
  Renderable,
  Renderer,
  colorRed,
  colorBlue,
} from '@mythor/renderer'
import showDescription from '../../util/showDescription'

/**
 * Combined multiplayer demo: your own square is predicted/reconciled
 * (`OwnedNetworked` + `PredictionSystem`, same movement rule as
 * `2--prediction.ts`), while every other connected client's square is
 * spawned/despawned automatically by `RemoteEntitySyncSystem` (registered
 * component: `Transform`, which implements `NetworkSync` natively in
 * `@mythor/core`) and smoothed by `RemoteInterpolationSystem` — this
 * example never diffs snapshots by hand.
 *
 * The only thing left for this example to do is presentation: give
 * remote entities their (blue) look as soon as they're spawned, via a
 * tiny local system reacting to `RemoteAppearanceSystem`'s entity
 * creation hook. `@mythor/net` only ever touches network-relevant
 * components (`Transform` here), never rendering ones.
 */
showDescription(
  'Combined multiplayer demo: your square (red) is predicted locally, ' +
    'other players (blue) are interpolated. This example requires a local ' +
    'server: run `yarn workspace @mythor/examples run server:net-multiplayer` ' +
    'in a separate terminal (after `yarn build`), then reload this page.',
  [
    'Arrow keys: move your square',
    'Open this page in a second browser tab to see multiplayer sync',
  ]
)

// Must stay identical to `server/multiplayer-server.ts`'s applyMoveInput,
// otherwise reconciliation will constantly correct/jitter the local square.
const SPEED = 200

interface MoveInput {
  dx: number
  dy: number
}

function applyMoveInput(entity: Entity, input: MoveInput, dt: number): void {
  const transform = entity.get(Transform)
  transform.position.vSet(
    transform.position.add(
      new Vec2(input.dx * SPEED * dt, input.dy * SPEED * dt)
    )
  )
}

class RemoteAppearanceSystem extends System {
  public constructor() {
    super('RemoteAppearanceSystem', [RemoteNetworked])
  }

  protected onEntityCreation(entity: Entity): void {
    entity.add(
      new Renderable(),
      new FillRect({ size: new Vec2(40, 40), color: colorBlue })
    )
  }
}

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new NetworkManager(), new EventsManager()],
  systems: [
    new Renderer(),
    new PredictionSystem(),
    new RemoteEntitySyncSystem(),
    new RemoteAppearanceSystem(),
    new RemoteInterpolationSystem(),
  ],
  onInit: async (ecs) => {
    const networkManager = ecs.manager(NetworkManager)
    const events = ecs.manager(EventsManager)

    networkManager.registerComponent(
      Transform,
      () => new Transform({ size: new Vec2(40, 40) })
    )

    ecs.create().add(
      new Transform({ position: Vec2.zero(), size: new Vec2(40, 40) }),
      new Renderable(),
      new FillRect({ size: new Vec2(40, 40), color: colorRed }),
      new OwnedNetworked<MoveInput>({
        getInput: () => ({
          dx:
            (events.keyIsDown(Key.ArrowRight) ? 1 : 0) -
            (events.keyIsDown(Key.ArrowLeft) ? 1 : 0),
          dy:
            (events.keyIsDown(Key.ArrowDown) ? 1 : 0) -
            (events.keyIsDown(Key.ArrowUp) ? 1 : 0),
        }),
        applyInput: applyMoveInput,
      })
    )

    networkManager.connect('ws://localhost:8084')
  },
})
