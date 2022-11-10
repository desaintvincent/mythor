import { Component, Entity, System, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import { createGame } from '@mythor/game'
import { Renderable, Renderer, Sprite, TextureManager } from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import f from '../assets/f.png'

class Player extends Component {}

class MovePlayer extends System {
  public constructor() {
    super('MovePlayer', [Player, Transform], { managers: [EventsManager] })
  }

  protected onEntityUpdate(entity: Entity): void {
    const events = this.ecs.manager(EventsManager)
    const transform = entity.get(Transform)

    transform.position.vSet(events.mousePosition())

    transform.rotation += events.wheelDelta(0.001)

    if (events.mousePressed(MouseButton.Right)) {
      transform.rotation = 0
    }

    if (events.mousePressed(MouseButton.Left)) {
      entity.destroy()
    }
  }
}

createGame({
  managers: [new TextureManager([['f', f]])],
  onInit: async (ecs) => {
    const textures = ecs.manager(TextureManager)
    ecs
      .create()
      .add(
        new Renderable(),
        new Player(),
        new Sprite(textures.get('f')),
        new Transform({ position: new Vec2(200, 0) })
      )
      .addChild(
        ecs
          .create()
          .add(
            new Renderable(),
            new Sprite(textures.get('f')),
            new Transform({ position: new Vec2(100, 100) })
          )
      )
      .addChild(
        ecs
          .create()
          .add(
            new Renderable(),
            new Sprite(textures.get('f')),
            new Transform({ position: new Vec2(-100, -100) })
          )
      )
      .addChild(
        ecs
          .create()
          .add(
            new Renderable(),
            new Sprite(textures.get('f')),
            new Transform({ position: new Vec2(100, -100) })
          )
      )
      .addChild(
        ecs
          .create()
          .add(
            new Renderable(),
            new Sprite(textures.get('f')),
            new Transform({ position: new Vec2(-100, 100) })
          )
      )
  },
  systems: [new MovePlayer(), new Renderer()],
})
