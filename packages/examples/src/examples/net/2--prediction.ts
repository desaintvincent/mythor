import { NetworkManager, OwnedNetworked, PredictionSystem } from '@mythor/net'
import { createGame } from '@mythor/game'
import { EventsManager, Key } from '@mythor/events'
import { Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import { FillRect, Renderable, Renderer, colorRed } from '@mythor/renderer'
import showDescription from '../../util/showDescription'

/**
 * Demonstrates `OwnedNetworked` + `PredictionSystem`: an entity you control
 * is moved immediately on the client (prediction) and corrected/replayed
 * whenever the server sends back an authoritative snapshot
 * (reconciliation).
 *
 * `applyMoveInput` below MUST stay identical to the server's own copy
 * (`server/prediction-server.ts`) — it is the deterministic movement rule
 * replayed during reconciliation, and the server runs the exact same rule
 * authoritatively.
 */
showDescription(
  'Client-side prediction + reconciliation with a server-authoritative ' +
    'entity. This example requires a local server: run ' +
    '`yarn workspace @mythor/examples run server:net-prediction` in a ' +
    'separate terminal (after `yarn build`), then reload this page.',
  ['Arrow keys: move the square']
)

const SPEED = 200 // pixels per second

interface MoveInput {
  dx: number
  dy: number
}

function applyMoveInput(transform: Transform, input: MoveInput, dt: number) {
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
  systems: [new Renderer(), new PredictionSystem()],
  onInit: async (ecs) => {
    const networkManager = ecs.manager(NetworkManager)
    const events = ecs.manager(EventsManager)

    networkManager.connect('ws://localhost:8082')

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
  },
})
