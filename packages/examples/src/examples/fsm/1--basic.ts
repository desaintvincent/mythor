import { Component, Entity, System, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import { StateMachine, StateTable } from '@mythor/fsm'
import { createGame } from '@mythor/game'
import {
  Color,
  colorGreen,
  colorRed,
  FillRect,
  Renderable,
  Renderer,
} from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import showDescription from '../../util/showDescription'

showDescription(
  '@mythor/fsm basics: a traffic light rendered on the canvas, driven by a plain StateMachine.',
  ['Left click: fire the "next" event and advance to the next color']
)

type LightState = 'red' | 'yellow' | 'green'

interface LightContext {
  fillRect: FillRect
}

const colorYellow: Color = [1, 0.85, 0, 1]

// The state table centralizes every transition and side effect: no ad-hoc
// if/switch chain is needed to know what "next" does in each state, or what
// color the light should turn when entering it.
function createTrafficLightTable(): StateTable<LightState, LightContext> {
  return {
    red: {
      transitions: { next: 'green' },
      onEnter: (context) => {
        context.fillRect.color = colorRed
      },
    },
    green: {
      transitions: { next: 'yellow' },
      onEnter: (context) => {
        context.fillRect.color = colorGreen
      },
    },
    yellow: {
      transitions: { next: 'red' },
      onEnter: (context) => {
        context.fillRect.color = colorYellow
      },
    },
  }
}

class TrafficLight extends Component {
  public readonly machine: StateMachine<LightState, LightContext>

  public constructor(fillRect: FillRect) {
    super()
    this.machine = new StateMachine(createTrafficLightTable(), 'red', {
      fillRect,
    })
  }
}

class TrafficLightController extends System {
  public constructor() {
    super('TrafficLightController', [TrafficLight], {
      managers: [EventsManager],
    })
  }

  protected onEntityUpdate(entity: Entity): void {
    const events = this.ecs.manager(EventsManager)

    if (events.mousePressed(MouseButton.Left)) {
      entity.get(TrafficLight).machine.fire('next')
    }
  }
}

createGame({
  onInit: async (ecs) => {
    const fillRect = new FillRect({ size: new Vec2(160, 160) })

    ecs
      .create()
      .add(
        new Renderable(),
        new TrafficLight(fillRect),
        fillRect,
        new Transform()
      )
  },
  systems: [new TrafficLightController(), new Renderer()],
})
