import { Manager } from '@mythor/core'
import { EventsManager, Key } from '@mythor/events'
import { PhysicSystem } from '@mythor/physic2d'
import { colorGreen, colorRed, Renderer } from '@mythor/renderer'
import { Body } from 'planck-js'
import { CircleShape } from 'planck-js/lib/shape'
import renderPoly from '../util/renderPoly'
import { Vec2 } from '@mythor/math'

class PhysicDebugManager extends Manager {
  private show = false
  private fill = false

  public constructor() {
    super('PhysicDebugManager')
  }

  public update(): void {
    if (
      !this.ecs.managers.has(EventsManager) ||
      !this.ecs.systems.has(PhysicSystem)
    ) {
      return
    }

    const events = this.ecs.manager(EventsManager)
    if (events.keyPressed(Key.F4)) {
      this.show = !this.show
    }

    if (!this.show) {
      return
    }

    if (events.keyIsDown(Key.Control) && events.keyPressed(Key.f)) {
      this.fill = !this.fill
    }

    this.render()
  }

  private render(): void {
    const physicSystem = this.ecs.system(PhysicSystem)
    const { worldScale, world } = physicSystem
    this.ecs.system(Renderer).onDraw((renderer) => {
      for (let body = world.getBodyList(); body; body = body.getNext()) {
        for (
          let fixture = body.getFixtureList();
          fixture;
          fixture = fixture.getNext()
        ) {
          const shape = fixture.getShape()
          switch (shape.m_type) {
            case 'polygon': {
              renderPoly(renderer, fixture, body, worldScale, this.fill)
              break
            }
            case 'circle': {
              this.renderCircle(
                renderer,
                body,
                shape as CircleShape,
                worldScale
              )
              break
            }
          }
        }
      }
    })
  }

  private renderCircle(
    renderer: Renderer,
    body: Body,
    shape: CircleShape,
    worldScale: number
  ): void {
    const p = body.getPosition()
    const pos = Vec2.create(p.x, p.y).times(worldScale)
    renderer[this.fill ? 'fillCircle' : 'strokeCircle'](
      pos,
      new Vec2(shape.m_radius * worldScale, shape.m_radius * worldScale),
      {
        color: body.getType() === 'static' ? colorGreen : colorRed,
        diagonal: true,
        width: 2 / renderer.getCamera().scale,
      }
    )
  }
}

export default PhysicDebugManager
