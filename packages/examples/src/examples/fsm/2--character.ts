import { Component, Entity, System, Transform } from '@mythor/core'
import { EventsManager, Key, MouseButton } from '@mythor/events'
import { StateMachine, StateTable } from '@mythor/fsm'
import { createGame } from '@mythor/game'
import { Renderable, Renderer, Sprite, TextureManager } from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import f from '../../assets/f.png'
import showDescription from '../../util/showDescription'

showDescription(
  '@mythor/fsm wired into an ECS Component/System: idle/walk/jump/attack character controller. Watch the color, the height and the size change with the state.',
  ['Arrow keys: walk', 'Space: jump', 'Left click: attack']
)

type PlayerState = 'idle' | 'walk' | 'jump' | 'attack'

interface PlayerContext {
  sprite: Sprite
  transform: Transform
  groundY: number
}

const jumpHeight = 80
const jumpDurationInSeconds = 0.5
const attackDurationInSeconds = 0.3
const walkSpeed = 150

// Each state fully owns its own visual side effects (tint, height, scale) in
// onEnter/onExit. The System below never asks "what does this state look
// like?" — it only asks "what event happened?" and lets the table answer.
function createPlayerTable(): StateTable<PlayerState, PlayerContext> {
  return {
    idle: {
      transitions: { move: 'walk', jump: 'jump', attack: 'attack' },
      onEnter: (context) => {
        context.sprite.tint = 0xffffff
      },
    },
    walk: {
      transitions: { stop: 'idle', jump: 'jump', attack: 'attack' },
      onEnter: (context) => {
        context.sprite.tint = 0x4aa3ff
      },
    },
    jump: {
      transitions: { land: 'idle' },
      onEnter: (context) => {
        context.sprite.tint = 0xffcf40
        context.transform.position.y = context.groundY - jumpHeight
      },
      onExit: (context) => {
        context.transform.position.y = context.groundY
      },
    },
    attack: {
      transitions: { finish: 'idle' },
      onEnter: (context) => {
        context.sprite.tint = 0xff4a4a
        context.sprite.scale = new Vec2(1.5, 1.5)
      },
      onExit: (context) => {
        context.sprite.scale = new Vec2(1, 1)
      },
    },
  }
}

// States that resolve on their own after a delay rather than on a player
// event. Kept as data so the System doesn't need one `if` per such state.
const autoAdvanceAfter: Partial<
  Record<PlayerState, { seconds: number; event: string }>
> = {
  jump: { seconds: jumpDurationInSeconds, event: 'land' },
  attack: { seconds: attackDurationInSeconds, event: 'finish' },
}

class Player extends Component {
  public readonly machine: StateMachine<PlayerState, PlayerContext>

  public elapsedInState = 0

  public constructor(sprite: Sprite, transform: Transform) {
    super()
    this.machine = new StateMachine(createPlayerTable(), 'idle', {
      sprite,
      transform,
      groundY: transform.position.y,
    })
  }
}

class PlayerController extends System {
  public constructor() {
    super('PlayerController', [Player, Transform], {
      managers: [EventsManager],
    })
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const events = this.ecs.manager(EventsManager)
    const player = entity.get(Player)
    const transform = entity.get(Transform)
    const { machine } = player

    player.elapsedInState += elapsedTimeInSeconds

    if (events.mousePressed(MouseButton.Left) && machine.fire('attack')) {
      player.elapsedInState = 0
    }

    if (events.keyPressed(Key.Space) && machine.fire('jump')) {
      player.elapsedInState = 0
    }

    const walkDirection = readWalkDirection(events)

    if (walkDirection !== 0) {
      transform.position.x += walkDirection * elapsedTimeInSeconds * walkSpeed
    }

    if (machine.fire(walkDirection !== 0 ? 'move' : 'stop')) {
      player.elapsedInState = 0
    }

    const autoAdvance = autoAdvanceAfter[machine.current]

    if (
      autoAdvance &&
      player.elapsedInState >= autoAdvance.seconds &&
      machine.fire(autoAdvance.event)
    ) {
      player.elapsedInState = 0
    }
  }
}

function readWalkDirection(events: EventsManager): number {
  if (events.keyIsDown(Key.ArrowLeft)) {
    return -1
  }

  if (events.keyIsDown(Key.ArrowRight)) {
    return 1
  }

  return 0
}

createGame({
  managers: [new TextureManager([['f', f]])],
  onInit: async (ecs) => {
    const textures = ecs.manager(TextureManager)
    const sprite = new Sprite(textures.get('f'))
    const transform = new Transform({ position: Vec2.zero() })

    ecs
      .create()
      .add(new Renderable(), new Player(sprite, transform), sprite, transform)
  },
  systems: [new PlayerController(), new Renderer()],
})
