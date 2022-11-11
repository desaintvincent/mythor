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
import { Entity, Manager, System, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import character from '../assets/character_malePerson_sheet.png'

const imageSprites = Vec2.create(9, 5)
const spriteSize = Vec2.create(96, 128)

enum ANIMATION {
  IDLE,
  CLIMB,
  CHEER,
  SWITCH,
  RUN,
  ATTACK,
  WALK,
}

class DrawHelp extends Manager {
  private entries: Array<[string, string | ANIMATION]>
  public constructor() {
    super('DrawGeometry')
    this.entries = Object.entries(ANIMATION).filter(([key]) =>
      isNaN(parseInt(key, 10))
    )
  }

  public update(): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      const text = this.entries
        .map(([animationName, key]) => `${animationName}: press ${key}`)
        .join('\n')
      renderer.text(new Vec2(-350, -160), text, {
        color: [0, 1, 0, 1],
      })
    })
  }
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
        animation.run(animationValue, true)
      }
    })
  }
}

createGame({
  managers: [
    new EventsManager(),
    new TextureManager([['character', character]]),
    new DrawHelp(),
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
      new Animation(0.1)
        .add(ANIMATION.IDLE, 0, 0)
        .add(ANIMATION.CLIMB, 5, 6, { speed: 0.2 })
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
