import { Vec2 } from '@mythor/math'
import {
  Component,
  Entity,
  Ecs,
  Transform,
  System,
  Manager,
} from '@mythor/core'
import {
  TextureManager,
  Texture,
  Renderable,
  Sprite,
  Renderer,
} from '@mythor/renderer'
import { EventsManager, MouseButton, Key } from '@mythor/events'
import { createGame, Game } from '@mythor/game'
import cat from '../assets/cat'

class Velocity extends Vec2 implements Component {
  public _entity: Entity
}

function spawnKitten(
  ecs: Ecs,
  texture: Texture,
  variant: number,
  position?: Vec2
): void {
  ecs.create().add(
    new Transform({
      position: position ?? new Vec2(0, 0),
      size: new Vec2(32, 32),
    }),
    new Velocity(Math.random() * 200 + 100, Math.random() * 100 - 5),
    new Renderable(),
    new Sprite(texture, {
      origin: new Vec2(0, variant / 4),
      size: new Vec2(1, 1 / 4),
    })
  )
}

function removeKitten(ecs: Ecs, howMuch: number): void {
  const iterator = ecs.entities.values()
  for (let i = 0; i < howMuch; i++) {
    const firstIteration = iterator.next()
    if (!firstIteration.value) {
      break
    }
    firstIteration.value.destroy()
  }
}

class CustomPhysic extends System {
  public constructor() {
    super('BatchPhysic', [Transform, Velocity], { systems: [Renderer] })
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const renderer = this.ecs.system(Renderer)
    const size = renderer.getCamera().getSize()
    const transform = entity.get(Transform)
    const velocity = entity.get(Velocity)
    const position = transform.position

    velocity.y += 50
    position.x += elapsedTimeInSeconds * velocity.x
    position.y += elapsedTimeInSeconds * velocity.y

    if (position.x < -size.x / 2) {
      position.x = -size.x / 2
      velocity.x *= -1
    }

    if (position.y < -size.y / 2) {
      position.y = -size.y / 2
      velocity.y *= -1
    }

    if (position.x > size.x / 2) {
      position.x = size.x / 2
      velocity.x *= -1
    }

    if (position.y > size.y / 2) {
      position.y = size.y / 2
      velocity.y *= -0.85

      if (Math.random() > 0.5) {
        velocity.y -= Math.random() * 500
      }
    }
  }
}

class KittenSpawner extends Manager {
  private variant = 0
  private auto = false

  public constructor() {
    super('KittenSpawner')
  }

  public update(
    ecs: Ecs,
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    const event = ecs.manager(EventsManager)
    const total = ecs.duration

    const catTexture = ecs.manager(TextureManager).get('cat')
    const multiplicatorAuto = 50
    const multiplicatorClick = 25

    if (this.auto) {
      if (total < 16) {
        for (let i = 0; i < multiplicatorAuto; i++) {
          spawnKitten(ecs, catTexture, this.variant, event.mousePosition())
        }
      } else {
        removeKitten(ecs, multiplicatorAuto)
      }
    }

    if (event.mouseReleased(MouseButton.Left)) {
      this.variant = (this.variant + 1) % 4
    }

    if (event.keyPressed(Key.w)) {
      this.auto = !this.auto
    }

    if (event.mouseIsDown(MouseButton.Left)) {
      const catTexture = ecs.manager(TextureManager).get('cat')
      for (let i = 0; i < multiplicatorClick; i++) {
        spawnKitten(ecs, catTexture, this.variant, event.mousePosition())
      }
    }

    if (event.mouseIsDown(MouseButton.Right)) {
      removeKitten(ecs, multiplicatorClick)
    }
  }
}

createGame({
  managers: [
    new EventsManager(),
    new KittenSpawner(),
    new TextureManager([['cat', cat]]),
  ],
  onInit: async (ecs) => {
    spawnKitten(ecs, ecs.manager(TextureManager).get('cat'), 0)
  },
  systems: [new CustomPhysic(), new Renderer()],
})
