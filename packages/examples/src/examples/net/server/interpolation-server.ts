import { Ecs, Transform } from '@mythor/core'
import {
  Networked,
  BroadcastSystem,
  ServerNetworkManager,
} from '@mythor/net/server'

/**
 * Server for the "interpolation" example: a single bot entity, moved by
 * the server itself along a circular path (no client input involved),
 * broadcast at a deliberately low rate so the benefit of
 * `RemoteInterpolationSystem`'s snapshot smoothing is visible (without
 * it, the bot would visibly "teleport" between positions instead of
 * moving smoothly). Replication itself is handled generically by
 * `BroadcastSystem` — this file only moves the bot's `Transform`.
 *
 * Run with: yarn workspace @mythor/examples run server:net-interpolation
 */

const PORT = 8083
const BOT_ENTITY_ID = 'bot'
const RADIUS = 150
const ANGULAR_SPEED = 1 // radians per second
const BROADCAST_RATE_HZ = 5

async function main() {
  const ecs = new Ecs()
  const manager = new ServerNetworkManager({ port: PORT })
  ecs.registerManagers(manager)
  ecs.registerSystems(new BroadcastSystem())
  await ecs.init()

  const bot = ecs.create(BOT_ENTITY_ID)
  bot.add(new Transform(), new Networked())

  manager.listen()
  // eslint-disable-next-line no-console
  console.log(`Listening on ws://localhost:${PORT}`)

  const startedAt = Date.now()

  setInterval(() => {
    const elapsedSeconds = (Date.now() - startedAt) / 1000
    const angle = elapsedSeconds * ANGULAR_SPEED

    bot.get(Transform).deserialize({
      position: [Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS],
      rotation: angle,
    })

    ecs.update(0, elapsedSeconds)
  }, 1000 / BROADCAST_RATE_HZ)
}

main()
