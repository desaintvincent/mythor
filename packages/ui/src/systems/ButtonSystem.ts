import { Entity, System, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import { contains, Vec2 } from '@mythor/math'
import { Renderable } from '@mythor/renderer'
import Button from '../components/Button'

/**
 * Hit-tests every entity carrying a `Transform` + `Button` against the
 * mouse, using the center-based `contains()` helper from `@mythor/math`
 * with a zero-size point rect. Mirrors the press/release edge-detection
 * pattern already used inside `EventsManager` itself.
 *
 * Buttons created with `screenSpace: true` (the default via `createButton`)
 * are hit-tested against the raw, un-converted mouse position, matching how
 * the renderer draws them fixed to the screen regardless of the world
 * camera (see `Renderable.screenSpace`).
 */
class ButtonSystem extends System {
  public constructor() {
    super('ButtonSystem', [Transform, Button], {
      managers: [EventsManager],
    })
  }

  protected onEntityUpdate(entity: Entity): void {
    const button = entity.get(Button)
    const transform = entity.get(Transform)
    const events = this.ecs.manager(EventsManager)
    const screenSpace = entity.has(Renderable)
      ? entity.get(Renderable).screenSpace
      : false

    if (button.disabled) {
      if (button.hovered) {
        button.onHoverChange?.(false)
      }
      button.hovered = false
      button.pressed = false
      button.clicked = false

      return
    }

    const hovered = contains(
      { position: transform.position, size: transform.size },
      { position: events.mousePosition(!screenSpace), size: Vec2.zero() }
    )

    if (hovered !== button.hovered) {
      button.onHoverChange?.(hovered)
    }
    button.hovered = hovered

    button.pressed = hovered && events.mouseIsDown(MouseButton.Left)
    button.clicked = hovered && events.mousePressed(MouseButton.Left)

    if (button.clicked) {
      button.onClick?.()
    }
  }
}

export default ButtonSystem
