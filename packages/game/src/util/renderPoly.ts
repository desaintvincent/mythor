import { Renderer, colorGreen, colorRed } from '@mythor/renderer'
import { Body, Fixture } from 'planck-js'
import { PolygonShape } from 'planck-js/lib/shape'
import { Vec2 } from '@mythor/math'
import { IGNORED_BY_WORLD } from '@mythor/physic2d'

function renderPoly(
  renderer: Renderer,
  fixture: Fixture,
  body: Body,
  worldScale: number,
  fill = false
): void {
  const shape = fixture.getShape() as PolygonShape
  const vertices = shape.m_vertices
  if (!vertices.length) {
    return
  }
  const p = body.getPosition()
  const pos = Vec2.create(p.x, p.y).times(worldScale)
  const angle = body.getAngle()

  const poly = shape.m_vertices.map((v) =>
    Vec2.create(v.x, v.y).rotate(angle).times(worldScale)
  )

  const interactWithWorld = fixture.getFilterMaskBits() !== IGNORED_BY_WORLD

  renderer[fill ? 'fillPoly' : 'strokePoly'](pos, poly, {
    color:
      body.getType() === 'static'
        ? interactWithWorld
          ? colorGreen
          : [1, 1, 1, 0.25]
        : colorRed,
    diagonal: true,
    width: 2 / renderer.getCamera().scale,
  })
}

export default renderPoly
