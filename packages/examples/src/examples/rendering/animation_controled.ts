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
import { Component, Entity, Manager, System, Transform } from '@mythor/core'
import { StateMachine, StateTable } from '@mythor/fsm'
import { Vec2 } from '@mythor/math'
import character from '../../assets/character_malePerson_sheet.png'
import showDescription from '../../util/showDescription'

showDescription(
  'Character animations switched by keyboard input (see on-screen legend for the keys), driven by a StateMachine so each animation only ever runs from its own onEnter.',
  []
)

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

type AnimationState = keyof typeof ANIMATION

const animationStates = Object.keys(ANIMATION).filter((key) =>
  isNaN(parseInt(key, 10))
) as AnimationState[]

interface AnimationContext {
  animation: Animation
}

// Every digit key can be pressed from every animation: the table is fully
// connected on purpose. What matters is that `animation.run(...)` now only
// ever happens in one place per state (onEnter), instead of being called
// ad-hoc from the System for whichever key was just pressed.
function createAnimationTable(): StateTable<AnimationState, AnimationContext> {
  const transitions = animationStates.reduce<Record<string, AnimationState>>(
    (table, state, index) => ({ ...table, [index]: state }),
    {}
  )

  return animationStates.reduce(
    (table, state) => ({
      ...table,
      [state]: {
        transitions,
        onEnter: (context: AnimationContext) => {
          context.animation.run(ANIMATION[state], true)
        },
      },
    }),
    {} as StateTable<AnimationState, AnimationContext>
  )
}

class AnimatedCharacter extends Component {
  public readonly machine: StateMachine<AnimationState, AnimationContext>

  public constructor(animation: Animation) {
    super()
    this.machine = new StateMachine(createAnimationTable(), 'IDLE', {
      animation,
    })
  }
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
    super('ControllAnimations', [AnimatedCharacter], {
      managers: [EventsManager],
    })
  }

  protected onEntityUpdate(entity: Entity): void {
    const events = this.ecs.manager(EventsManager)
    const { machine } = entity.get(AnimatedCharacter)

    animationStates.forEach((state, index) => {
      if (events.keyPressed(Key[`Digit${index}` as keyof typeof Key])) {
        machine.fire(String(index))
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
    const animation = new Animation(0.1)
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

    ecs.create().add(
      new Renderable(),
      new Transform({
        size: spriteSize,
      }),
      new Sprite(ecs.manager(TextureManager).get('character'), {
        size: Vec2.create(1, 1).vDivide(imageSprites),
      }),
      animation,
      new AnimatedCharacter(animation)
    )
  },
  systems: [new ControlAnimations(), new Animator(), new Renderer()],
})
