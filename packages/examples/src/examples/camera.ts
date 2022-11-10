import f from '../assets/f.png'
import { Component, Entity, Manager, System, Transform } from '@mythor/core'
import { EventsManager, Key, MouseButton } from '@mythor/events'
import {
  lerpCamera,
  FillRect,
  Renderable,
  Renderer,
  Sprite,
  TextureManager,
} from '@mythor/renderer'
import { createGame } from '@mythor/game'

class Player extends Component {}

class MovePlayer extends System {
  public constructor() {
    super('movePlayer', [Player, Transform], { managers: [EventsManager] })
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const events = this.ecs.manager(EventsManager)
    const { position } = entity.get(Transform)

    const distance = elapsedTimeInSeconds * 1000

    if (events.keyIsDown(Key.d)) {
      position.x += distance
    }
    if (events.keyIsDown(Key.q)) {
      position.x -= distance
    }
    if (events.keyIsDown(Key.z)) {
      position.y -= distance
    }
    if (events.keyIsDown(Key.s)) {
      position.y += distance
    }
  }
}

class SpawnF extends Manager {
  public constructor() {
    super('SpawnF')
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)
    const textures = this.ecs.manager(TextureManager)
    if (events.mousePressed(MouseButton.Left)) {
      this.ecs
        .create()
        .add(
          new Renderable(),
          new Sprite(textures.get('f')),
          new Transform({ position: events.mousePosition() })
        )
    }
  }
}

createGame({
  managers: [new EventsManager(), new TextureManager([['f', f]]), new SpawnF()],
  onInit: async (ecs) => {
    const textures = ecs.manager(TextureManager)
    ecs
      .create()
      .add(new Renderable(), new Sprite(textures.get('f')), new Transform())
    const player = ecs
      .create()
      .add(
        new Renderable(),
        new FillRect(),
        new Player(),
        new Transform({ rotation: 18 })
      )

    ecs
      .system(Renderer)
      .getCamera()
      .targetEntity(player)
      .setTargetFunction(lerpCamera())
  },
  systems: [new MovePlayer(), new Renderer()],
})
