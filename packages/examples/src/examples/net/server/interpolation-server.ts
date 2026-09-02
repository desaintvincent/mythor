import { Connection, startWsServer } from './wsServer'

/**
 * Server for the "interpolation" example: a single bot entity, moved by the
 * server itself along a circular path (no client input involved), broadcast
 * at a deliberately low rate so the benefit of `RemoteInterpolationSystem`'s
 * snapshot smoothing is visible (without it, the bot would visibly "teleport"
 * between positions instead of moving smoothly).
 *
 * Run with: yarn workspace @mythor/examples run server:net-interpolation
 */

const BOT_ENTITY_ID = 'bot'
const RADIUS = 150
const ANGULAR_SPEED = 1 // radians per second
const BROADCAST_RATE_HZ = 5

const connections = new Set<Connection>()

startWsServer({
  port: 8083,
  onConnection: (connection) => {
    connections.add(connection)
  },
  onMessage: () => {
    // No messages are expected from this example's client.
  },
  onClose: (connection) => {
    connections.delete(connection)
  },
})

const startedAt = Date.now()

setInterval(() => {
  const elapsedSeconds = (Date.now() - startedAt) / 1000
  const angle = elapsedSeconds * ANGULAR_SPEED
  const x = Math.cos(angle) * RADIUS
  const y = Math.sin(angle) * RADIUS

  connections.forEach((connection) => {
    connection.send({
      v: 1,
      type: 'snapshot',
      entities: [
        {
          id: BOT_ENTITY_ID,
          transform: { position: [x, y], rotation: angle },
        },
      ],
    })
  })
}, 1000 / BROADCAST_RATE_HZ)
