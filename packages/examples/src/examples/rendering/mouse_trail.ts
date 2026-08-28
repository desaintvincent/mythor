import { Manager, Transform } from '@mythor/core'
import { EventsManager } from '@mythor/events'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import { Renderable, Renderer } from '@mythor/renderer'
import ParticleEmitter from '@mythor/renderer/lib/components/ParticleEmitter'
import showDescription from '../../util/showDescription'

showDescription('A particle trail following the mouse cursor.', [
  'Move the mouse to leave a trail',
])

// The particle system's spawn shader only accepts a single spawn position
// per frame (see `u_spawnPosition` in `@mythor/renderer`'s
// `particleUpdate.vs.ts`), so a single continuously moving emitter can't
// interpolate its spawn point along the path travelled within a frame:
// fast mouse movements would leave visible gaps. To fix that, we spawn one
// short-lived "stamp" emitter entity per path segment instead, evenly
// distributed along the distance travelled since the last frame. This used
// to leak GPU buffers on every destroyed entity (fixed in `@mythor/renderer`
// by adding a `Shader.onEntityDestruction` cleanup hook).
const STAMP_SIZE = 16
const STAMP_DISTANCE = STAMP_SIZE / 12
// Bounds the number of entities spawned in a single frame so a very fast
// mouse flick can't create an unbounded burst of stamps.
const MAX_STAMPS_PER_FRAME = 40

class TrailEmitter extends Manager {
  private lastPosition?: Vec2

  public constructor() {
    super('trailEmitter')
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)
    const pointer = events.mousePosition()

    if (!this.lastPosition) {
      this.lastPosition = Vec2.create(pointer.x, pointer.y)

      return
    }

    const dx = pointer.x - this.lastPosition.x
    const dy = pointer.y - this.lastPosition.y
    const distance = Math.hypot(dx, dy)

    if (distance >= STAMP_DISTANCE) {
      const stampCount = Math.min(
        Math.floor(distance / STAMP_DISTANCE),
        MAX_STAMPS_PER_FRAME
      )

      for (let i = 1; i <= stampCount; i++) {
        const t = i / stampCount

        this.spawnStamp(
          Vec2.create(
            this.lastPosition.x + dx * t,
            this.lastPosition.y + dy * t
          )
        )
      }

      this.lastPosition = Vec2.create(pointer.x, pointer.y)
    }
  }

  private spawnStamp(position: Vec2): void {
    this.ecs.create().add(
      new Renderable({ visible: true }),
      new Transform({ position }),
      new ParticleEmitter(1, {
        color: {
          end: [0.13, 0.6, 1, 0],
          start: [0.9, 1, 1, 1],
        },
        deleteOnEndOfLife: true,
        frequency: Infinity,
        // Fixed lifetime: keeps every stamp fading identically, which is
        // what makes the trail read as smooth. Randomizing it produces a
        // flickering "lightning bolt" look instead.
        lifeTime: {
          max: 0.4,
          min: 0.4,
        },
        size: Vec2.create(STAMP_SIZE, STAMP_SIZE),
        speed: 0,
      })
    )
  }
}

createGame({
  managers: [new TrailEmitter()],
  systems: [new Renderer()],
})
