import { Manager } from '@mythor/core'
import { FillRect, Renderer, colorBlue, colorGreen } from '@mythor/renderer'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import {
  Button,
  ButtonSystem,
  createButton,
  createLabel,
  createPanel,
} from '@mythor/ui'
import showDescription from '../../util/showDescription'

showDescription(
  'A panel containing a label and a button, positioned relative to it.',
  [
    'The button is a child entity: its Transform position is relative to the panel',
    'Move the panel by editing its position in code to see the children follow',
  ]
)

class ButtonTintManager extends Manager {
  public constructor() {
    super('ButtonTintManager')
  }

  public update(): void {
    this.ecs.entities.forEach((entity) => {
      if (!entity.has(Button) || !entity.has(FillRect)) {
        return
      }

      const button = entity.get(Button)
      const fillRect = entity.get(FillRect)

      fillRect.color = button.pressed
        ? colorBlue
        : button.hovered
        ? colorGreen
        : [0.8, 0.8, 0.8, 1]
    })
  }
}

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new ButtonTintManager()],
  onInit: async (ecs) => {
    const panel = ecs.create().add(
      ...createPanel({
        color: [0.15, 0.15, 0.2, 1],
        position: Vec2.create(512, 256),
        radius: 20,
        size: Vec2.create(320, 220),
      })
    )

    const label = ecs
      .create()
      .add(...createLabel('Settings', { position: Vec2.create(0, -70) }))

    const button = ecs.create().add(
      ...createButton({
        label: 'Close',
        labelColor: [0, 0, 0, 1],
        position: Vec2.create(0, 60),
        radius: 10,
        size: Vec2.create(140, 50),
      })
    )

    panel.addChild(label)
    panel.addChild(button)
  },
  systems: [new Renderer(), new ButtonSystem()],
})
