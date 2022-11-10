import cat from '../assets/cat'
import { Ecs, Manager, Transform } from '@mythor/core'
import {
  Renderable,
  Renderer,
  Sprite,
  Texture,
  TextureManager,
} from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import { EventsManager, Key, MouseButton } from '@mythor/events'
import { createGame } from '@mythor/game'

function spawnKitten(
  ecs: Ecs,
  texture: Texture,
  position = Vec2.zero(),
  layer = 0
): void {
  ecs.create().add(
    new Renderable({
      layer: layer,
    }),
    new Transform({
      position: position,
      size: new Vec2(32, 32),
    }),
    new Sprite(texture, {
      origin: new Vec2(0, layer / 4),
      size: new Vec2(1, 1 / 4),
    })
  )
}

class SpawnKitten extends Manager {
  private layer = 0
  public constructor() {
    super('SpawnKitten')
  }

  public update(): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      const camera = renderer.getCamera()

      renderer.text(
        camera.getPosition().add(camera.getSize().times(-0.4 / camera.scale)),
        `Selected Layer: ${this.layer}`
      )
    })

    const events = this.ecs.manager(EventsManager)

    if (events.keyPressed(Key.Space)) {
      this.layer = (this.layer + 1) % 4
    }

    if (events.mousePressed(MouseButton.Left)) {
      spawnKitten(
        this.ecs,
        this.ecs.manager(TextureManager).get('cat'),
        events.mousePosition(),
        this.layer
      )
    }
  }
}

createGame({
  managers: [
    new EventsManager(),
    new SpawnKitten(),
    new TextureManager([['cat', cat]]),
  ],
  onInit: async (ecs) => {
    spawnKitten(ecs, ecs.manager(TextureManager).get('cat'))
  },
  systems: [new Renderer()],
})
