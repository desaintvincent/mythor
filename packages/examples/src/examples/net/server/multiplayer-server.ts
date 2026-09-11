import { Ecs, Entity, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import {
  BroadcastSystem,
  Networked,
  ServerNetworkManager,
} from '@mythor/net/server'

/**
 * Server for the combined "multiplayer" example: every connection
 * controls its own entity (same movement rule as the "prediction"
 * example) and sees every other connection's entity as a remote,
 * interpolated entity.
 *
 * This is functionally identical to `prediction-server.ts` — the
 * per-recipient snapshot shaping (only the owning connection sees
 * `ackSeq` on its own entity) is handled generically by `BroadcastSystem`
 * for every connection, not something this example has to build by hand.
 * It's kept as a separate file/port only to match this demo's own client
 * (`4--multiplayer.ts`).
 *
 * `applyMoveInput` is duplicated from the client example for the same
 * reason as in `prediction-server.ts`: it must run identically on both
 * sides for prediction/reconciliation to work without jitter.
 *
 * Run with: yarn workspace @mythor/examples run server:net-multiplayer
 */

const PORT = 8084
const SPEED = 200 // pixels per second
const TICK_RATE_HZ = 20

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

async function main() {
  const ecs = new Ecs()
  const manager = new ServerNetworkManager({ port: PORT })
  ecs.registerManagers(manager)
  ecs.registerSystems(new BroadcastSystem())
  await ecs.init()

  const entityIdByConnectionId = new Map<string, string>()

  manager.onDisconnect((connection) => {
    const entityId = entityIdByConnectionId.get(connection.id)
    entityIdByConnectionId.delete(connection.id)

    if (entityId) {
      ecs.entity(entityId)?.destroy()
    }
  })

  manager.onInput((connection, entityId, seq, input) => {
    let entity = ecs.entity(entityId)

    if (!entity) {
      entity = ecs.create(entityId)
      entity.add(
        new Transform(),
        new Networked({ ownerConnectionId: connection.id })
      )
      entityIdByConnectionId.set(connection.id, entityId)
    }

    void seq
    applyMoveInput(entity, input as MoveInput, 1 / TICK_RATE_HZ)
  })

  manager.listen()
  // eslint-disable-next-line no-console
  console.log(`Listening on ws://localhost:${PORT}`)

  setInterval(() => ecs.update(1 / TICK_RATE_HZ, 0), 1000 / TICK_RATE_HZ)
}

main()
