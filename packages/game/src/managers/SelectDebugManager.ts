import { Entity, Manager, Transform } from '@mythor/core'
import { EventsManager, Key, MouseButton } from '@mythor/events'
import { colorRed, colorWhite, Renderable, Renderer } from '@mythor/renderer'
import { PhysicSystem } from '@mythor/physic2d'
import { getTopLeft, Vec2 } from '@mythor/math'
import getEntityStats from '../util/getEntityStats'

export type SelectDebugManagerParams = {
  onSelect?: (entity: Entity) => void
  debugSize?: number
}

class SelectDebugManager extends Manager {
  private show = false
  private selectedEntity: Entity | null
  private readonly onSelect?: (entity: Entity) => void
  private readonly debugSize: number

  public constructor(params?: SelectDebugManagerParams) {
    super('SelectDebugManager')
    this.onSelect = params?.onSelect
    this.debugSize = params?.debugSize ?? 0.7
  }

  public update(): void {
    if (
      !this.ecs.managers.has(EventsManager) ||
      !this.ecs.systems.has(Renderer) ||
      !this.ecs.systems.has(PhysicSystem)
    ) {
      return
    }

    const events = this.ecs.manager(EventsManager)

    if (events.keyPressed(Key.F6)) {
      this.show = !this.show
    }

    if (!this.show) {
      return
    }

    if (events.mousePressed(MouseButton.Left)) {
      let found = false
      this.ecs.system(PhysicSystem).query(events.mousePosition(), (entity) => {
        if (entity.has(Renderable) && entity.has(Transform)) {
          this.selectedEntity = entity
          this.onSelect?.(entity)
          found = true

          return false
        }

        return true
      })
      if (!found) {
        this.selectedEntity = null
      }
    }

    if (events.mousePressed(MouseButton.Right)) {
      this.selectedEntity = null
    }

    this.render()
  }

  private offsetCamera(vec: Vec2): Vec2 {
    const renderer = this.ecs.system(Renderer)

    return vec.add(
      Vec2.create(
        5 / renderer.getCamera().scale,
        10 / renderer.getCamera().scale
      )
    )
  }

  private render(): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      if (this.selectedEntity) {
        const { position, size, rotation } = this.selectedEntity.get(Transform)
        renderer.strokeRect(position, size, {
          color: colorRed,
          rotation,
          width: (this.debugSize * 3) / renderer.getCamera().scale,
        })
      }

      const fov = renderer.fov
      const topLeft = this.offsetCamera(getTopLeft(fov))
      const entityStats = this.selectedEntity
        ? getEntityStats(this.selectedEntity)
        : 'No selected entity'
      const linesNumber = entityStats.split('\n').length + 1
      const maskSize = Vec2.create(
        550 * this.debugSize,
        linesNumber * renderer.lineHeight() * this.debugSize
      ).divide(renderer.getCamera().scale)
      renderer.fillRect(getTopLeft(fov).add(maskSize.divide(2)), maskSize, {
        color: [0, 0, 0, 0.75],
      })
      renderer.text(topLeft, entityStats, {
        color: colorWhite,
        size: this.debugSize / renderer.getCamera().scale,
      })
    })
  }
}

export default SelectDebugManager
