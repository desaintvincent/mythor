import { Ecs, Entity, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import {
  BroadcastSystem,
  Networked,
  ServerNetworkManager,
} from '@mythor/net/server'

/**
 * Server for the "prediction" example: a headless `@mythor/core` `Ecs`
 * running one `Transform`-carrying entity per connection, moved with
 * `dx`/`dy` input. Replication is entirely generic: this file never
 * builds a snapshot payload itself, `BroadcastSystem` does that for every
 * `Networked` entity's `NetworkSync` components (here, `Transform`,
 * which implements it natively in `@mythor/core`).
 *
 * `applyMoveInput` below is deliberately duplicated from the client
 * example (`2--prediction.ts`). This is not an oversight: `@mythor/net`'s
 * client-side prediction replays inputs locally using the client's own
 * `applyInput` function, so the server MUST run the exact same
 * deterministic movement rule, or the client's prediction will constantly
 * be corrected by the server (visible as jitter/rubber-banding). In a real
 * project this function should live in a single shared module imported by
 * both the client and the server.
 *
 * Run with: yarn workspace @mythor/examples run server:net-prediction
 */

const PORT = 8082
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

  // Entities are keyed by the id the client's own `OwnedNetworked` entity
  // generated locally: the server has no way to know it ahead of time, so
  // it lazily creates the authoritative entity on the first input seen
  // for that id.
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
