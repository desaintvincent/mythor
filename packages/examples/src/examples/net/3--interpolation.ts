import {
  NetworkManager,
  RemoteNetworked,
  RemoteInterpolationSystem,
} from '@mythor/net'
import { createGame } from '@mythor/game'
import { Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import { FillRect, Renderable, Renderer, colorGreen } from '@mythor/renderer'
import showDescription from '../../util/showDescription'

/**
 * Demonstrates `RemoteNetworked` + `RemoteInterpolationSystem`: a single
 * entity, fully driven by the server (no input, no prediction), whose
 * position/rotation are smoothed on the client by buffering the last two
 * received snapshots and interpolating between them.
 *
 * The server broadcasts at a deliberately low rate (5 Hz) so the smoothing
 * is visibly necessary — without it, the square would visibly teleport
 * between positions instead of moving continuously.
 */
showDescription(
  'RemoteNetworked snapshot interpolation. This example requires a local ' +
    'server: run `yarn workspace @mythor/examples run server:net-interpolation` ' +
    'in a separate terminal (after `yarn build`), then reload this page.',
  ['The square is fully server-driven — just watch it move smoothly']
)

// Must match `server/interpolation-server.ts`'s BOT_ENTITY_ID.
const BOT_ENTITY_ID = 'bot'

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new NetworkManager()],
  systems: [new Renderer(), new RemoteInterpolationSystem()],
  onInit: async (ecs) => {
    const networkManager = ecs.manager(NetworkManager)

    ecs
      .create(BOT_ENTITY_ID)
      .add(
        new Transform({ position: Vec2.zero(), size: new Vec2(40, 40) }),
        new Renderable(),
        new FillRect({ size: new Vec2(40, 40), color: colorGreen }),
        new RemoteNetworked()
      )

    networkManager.connect('ws://localhost:8083')
  },
})
