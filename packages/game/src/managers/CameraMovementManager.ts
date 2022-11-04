import { Entity, Manager } from '@mythor/core'
import { EventsManager, Key, MouseButton } from '@mythor/events'
import { Renderer } from '@mythor/renderer'
import { Vec2 } from '@mythor/math'

class CameraMovementManager extends Manager {
  private readonly debugKey: Key = Key.Control
  private entityToFollow?: Entity

  public constructor() {
    super('CameraMovementManager')
  }

  public update(): void {
    if (
      !this.ecs.managers.has(EventsManager) ||
      !this.ecs.systems.has(Renderer)
    ) {
      return
    }

    const events = this.ecs.manager(EventsManager)
    const camera = this.ecs.system(Renderer).getCamera()

    if (events.keyReleased(this.debugKey)) {
      camera.targetEntity(this.entityToFollow)
    }

    if (events.keyPressed(this.debugKey)) {
      this.entityToFollow = camera.getTargetEntity()
      camera.targetEntity()
    }

    if (!events.keyIsDown(this.debugKey)) {
      return
    }

    if (events.isDragging(MouseButton.Left)) {
      camera.move(events.dragDelta().times(-1), true)
    }

    if (events.keyIsDown(Key.Shift) && events.mousePressed(MouseButton.Left)) {
      camera.lookat(events.mousePosition())
    }

    if (events.isWheeling()) {
      camera.zoom(events.wheelDelta(-0.001))
    }

    if (events.keyPressed(Key.r)) {
      camera.lookat(Vec2.zero())
      camera.scale = 1
    }
  }
}

export default CameraMovementManager
