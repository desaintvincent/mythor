import { createGame } from '@mythor/game'
import { EventsManager, Key } from '@mythor/events'
import {
  Animator,
  Renderable,
  Renderer,
  Sprite,
  TextureManager,
  Animation,
} from '@mythor/renderer'
import { Entity, System, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import character from '../assets/character_malePerson_sheet.png'

const imageSprites = Vec2.create(9, 5)
const spriteSize = Vec2.create(96, 128)

const aa = [
  { name: 'idle', x: 0, y: 0 },
  { name: 'climb', x: 480, y: 0 },
  { name: 'climb', x: 576, y: 0 },
  { name: 'cheer', x: 672, y: 0 },
  { name: 'cheer', x: 768, y: 0 },
  { name: 'switch', x: 288, y: 128 },
  { name: 'switch', x: 384, y: 128 },
  { name: 'run', x: 576, y: 256 },
  { name: 'run', x: 672, y: 256 },
  { name: 'run', x: 768, y: 256 },
  { name: 'attack', x: 0, y: 384 },
  { name: 'attack', x: 96, y: 384 },
  { name: 'attack', x: 192, y: 384 },
  { name: 'walk', x: 0, y: 512 },
  { name: 'walk', x: 96, y: 512 },
  { name: 'walk', x: 192, y: 512 },
  { name: 'walk', x: 288, y: 512 },
  { name: 'walk', x: 384, y: 512 },
  { name: 'walk', x: 480, y: 512 },
  { name: 'walk', x: 576, y: 512 },
  { name: 'walk', x: 672, y: 512 },
]

aa.forEach((a) => {
  const x = a.x / 96
  const y = a.y / 128
  console.log('name', a.name, x, y, y * imageSprites.x + x)
})

enum ANIMATION {
  IDLE,
  CLIMB,
  CHEER,
  SWITCH,
  RUN,
  ATTACK,
  WALK,
}

class ControlAnimations extends System {
  public constructor() {
    super('ControllAnimations', [Animation], { managers: [EventsManager] })
  }

  protected onEntityUpdate(entity: Entity): void {
    const events = this.ecs.manager(EventsManager)
    const animation = entity.get(Animation)

    Object.values(ANIMATION).forEach((animationValue) => {
      if (events.keyPressed(Key[`Digit${animationValue}`])) {
        console.log('run animation', animationValue)
        animation.run(animationValue, true)
      }
    })
  }
}

createGame({
  managers: [
    new EventsManager(),
    new TextureManager([['character', character]]),
  ],
  onInit: async (ecs) => {
    ecs.create().add(
      new Renderable(),
      new Transform({
        size: spriteSize,
      }),
      new Sprite(ecs.manager(TextureManager).get('character'), {
        size: Vec2.create(1, 1).vDivide(imageSprites),
      }),
      new Animation(0.2)
        .add(ANIMATION.IDLE, 0, 0)
        .add(ANIMATION.CLIMB, 5, 6, { loop: false, fallBack: ANIMATION.IDLE })
        .add(ANIMATION.CHEER, 7, 8, { loop: false, fallBack: ANIMATION.IDLE })
        .add(ANIMATION.SWITCH, 12, 13, {
          loop: false,
          fallBack: ANIMATION.IDLE,
        })
        .add(ANIMATION.RUN, 24, 26)
        .add(ANIMATION.ATTACK, 27, 29, {
          loop: false,
          fallBack: ANIMATION.IDLE,
        })
        .add(ANIMATION.WALK, 36, 43)
        .run(ANIMATION.IDLE)
    )
  },
  systems: [new ControlAnimations(), new Animator(), new Renderer()],
})
