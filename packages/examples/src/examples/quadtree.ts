import { Ecs, Manager, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import {
  Renderable,
  Renderer,
  Sprite,
  Texture,
  TextureManager,
} from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import { createGame } from '@mythor/game'
import cat from '../assets/cat'

class KittenSpawner extends Manager {
  public constructor() {
    super('KittenSpawner')
  }

  public update(ecs: Ecs): void {
    const event = ecs.manager(EventsManager)

    const catTexture = ecs.manager(TextureManager).get('cat')

    if (event.mousePressed(MouseButton.Right)) {
      spawnKitten(ecs, catTexture, event.mousePosition())
    }
  }
}

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

createGame({
  managers: [new TextureManager([['cat', cat]]), new KittenSpawner()],
  onInit: async (ecs) => {
    spawnKitten(ecs, ecs.manager(TextureManager).get('cat'))
  },
  systems: [new Renderer({ useTree: true })],
})
