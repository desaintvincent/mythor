import {
  NetworkManager,
  OwnedNetworked,
  RemoteNetworked,
  PredictionSystem,
  RemoteInterpolationSystem,
} from '@mythor/net'
import { createGame } from '@mythor/game'
import { EventsManager, Key } from '@mythor/events'
import { Transform } from '@mythor/core'
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
 * spawned dynamically and smoothed via `RemoteNetworked` +
 * `RemoteInterpolationSystem`.
 *
 * `@mythor/net` does not manage entity lifecycle on its own — spawning and
 * despawning remote entities as players join/leave is this example's own
 * responsibility, driven by diffing each incoming snapshot's entity list
 * against the previously known one.
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

function applyMoveInput(
  transform: Transform,
  input: MoveInput,
  dt: number
): void {
  transform.position.vSet(
    transform.position.add(
      new Vec2(input.dx * SPEED * dt, input.dy * SPEED * dt)
    )
  )
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
    new RemoteInterpolationSystem(),
  ],
  onInit: async (ecs) => {
    const networkManager = ecs.manager(NetworkManager)
    const events = ecs.manager(EventsManager)
    const remoteEntityIds = new Set<string>()
    let ownEntityId: string | undefined

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

    networkManager.onSnapshot((message) => {
      const seenThisFrame = new Set<string>()

      message.entities.forEach((snapshotEntity) => {
        // Our own entity is handled by PredictionSystem, not here.
        if (snapshotEntity.ackSeq !== undefined) {
          ownEntityId = snapshotEntity.id

          return
        }

        seenThisFrame.add(snapshotEntity.id)

        if (remoteEntityIds.has(snapshotEntity.id)) {
          return
        }

        remoteEntityIds.add(snapshotEntity.id)
        ecs
          .create(snapshotEntity.id)
          .add(
            new Transform({ size: new Vec2(40, 40) }),
            new Renderable(),
            new FillRect({ size: new Vec2(40, 40), color: colorBlue }),
            new RemoteNetworked()
          )
      })

      remoteEntityIds.forEach((id) => {
        if (seenThisFrame.has(id) || id === ownEntityId) {
          return
        }

        remoteEntityIds.delete(id)
        ecs.entity(id)?.destroy()
      })
    })

    networkManager.connect('ws://localhost:8084')
  },
})
