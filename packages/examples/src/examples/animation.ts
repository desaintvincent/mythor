import { createGame } from '@mythor/game'
import { EventsManager } from '@mythor/events'
import {
  Animator,
  Renderable,
  Renderer,
  Sprite,
  TextureManager,
  Animation,
} from '@mythor/renderer'
import { Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import animation from '../assets/animation.png'

createGame({
  managers: [
    new EventsManager(),
    new TextureManager([['animation', animation]]),
  ],
  onInit: async (ecs) => {
    ecs.create().add(
      new Renderable(),
      new Transform({
        size: new Vec2(125, 125),
      }),
      new Sprite(ecs.manager(TextureManager).get('animation'), {
        size: new Vec2(1 / 4, 1 / 4),
      }),
      new Animation(0.2).add('default', 0, 15)
    )
  },
  systems: [new Renderer(), new Animator()],
})
