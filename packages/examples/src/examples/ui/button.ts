import { Manager } from '@mythor/core'
import {
  FillRect,
  Renderer,
  colorBlue,
  colorGreen,
  colorWhite,
} from '@mythor/renderer'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import { Button, ButtonSystem, createButton } from '@mythor/ui'
import showDescription from '../../util/showDescription'

showDescription('A clickable button reacting to hover, press and click.', [
  'Move the mouse over the button to see the hover color',
  'Press the mouse button to see the pressed color',
  'Open the console to see click events logged',
])

// `Button` only tracks interaction state (hovered/pressed/clicked) — tinting
// the background is left to the consumer, the same way `RenderedText`
// doesn't know how a `Renderer` draws it. This tiny manager is the "view"
// half of the button, kept out of `@mythor/ui` to avoid baking a styling
// opinion into the primitive.
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

      if (button.pressed) {
        fillRect.color = colorBlue
      } else if (button.hovered) {
        fillRect.color = colorGreen
      } else {
        fillRect.color = colorWhite
      }
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
    ecs.create().add(
      ...createButton({
        label: 'Click me',
        labelColor: [0, 0, 0, 1],
        onClick: () => {
          // eslint-disable-next-line no-console
          console.log('Button clicked!')
        },
        position: Vec2.create(512, 256),
        radius: 16,
        size: Vec2.create(200, 80),
      })
    )
  },
  systems: [new Renderer(), new ButtonSystem()],
})
