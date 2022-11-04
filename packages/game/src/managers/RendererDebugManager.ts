import { Manager } from '@mythor/core'
import { EventsManager, Key } from '@mythor/events'
import {
  colorBlue,
  colorRed,
  colorWhite,
  QuadTree,
  QuadTreeList,
  Renderer,
} from '@mythor/renderer'
import { getTopLeft, Rect, Vec2 } from '@mythor/math'

class RendererDebugManager extends Manager {
  private show = false

  public constructor() {
    super('RendererDebugManager')
  }

  public update(): void {
    if (
      !this.ecs.managers.has(EventsManager) ||
      !this.ecs.systems.has(Renderer)
    ) {
      return
    }

    if (!this.ecs.system(Renderer).useTree) {
      return
    }

    const events = this.ecs.manager(EventsManager)

    if (events.keyPressed(Key.F5)) {
      this.show = !this.show
    }

    if (!this.show) {
      return
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

  private isTopLeft(q: QuadTree): boolean {
    if (!q.parent) {
      return true
    }

    return q.parent.leaves[0] === q
  }

  private drawQuadTree(renderer: Renderer, quadTree?: QuadTree): void {
    const q = quadTree ?? (renderer.getEntities() as QuadTreeList).quadTree

    const isTopLeft = this.isTopLeft(q)

    const color = isTopLeft ? colorBlue : colorWhite

    renderer.strokeRect(q.rect.position, q.rect.size, {
      color,
      width: 1 / renderer.getCamera().scale,
    })

    if (q.rect.size.x > renderer.fov.size.x / 6) {
      const fontSize = 0.7 / renderer.getCamera().scale
      const pos = this.offsetCamera(q.rect.position.sub(q.rect.size.divide(2)))
      const str = `${this.prettyRect(q.rect, true)}\nDepth:${q.depth}\nItems:${
        q.itemLength
      }\nLeaves:${q.leaves.length}`
      const lines = str.split('\n')
      const lineNumber = lines.length
      const lineHeight = renderer.lineHeight()
      const offset = q.depth * (lineNumber + 1) * lineHeight * fontSize

      renderer.text(isTopLeft ? pos.add(Vec2.create(0, offset)) : pos, str, {
        color,
        size: fontSize,
      })
    }

    q.leaves.forEach((child: QuadTree) => this.drawQuadTree(renderer, child))
  }

  private prettyRect(rect: Rect, newLine = false): string {
    if (newLine) {
      return `position:\n${rect.position.toString()}\nsize:\n${rect.size.toString()}`
    }

    return `position: ${rect.position.toString()}\nsize:   ${rect.size.toString()}`
  }

  private render(): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      const fov = renderer.fov
      const topLeft = this.offsetCamera(getTopLeft(fov))
      renderer.text(
        topLeft,
        this.prettyRect(fov) + `\nscale: ${renderer.getCamera().scale}`,
        { color: colorRed, size: 0.7 / renderer.getCamera().scale }
      )
      renderer.strokeRect(fov.position, fov.size, {
        color: colorRed,
        width: 1 / renderer.getCamera().scale,
      })
      this.drawQuadTree(renderer)
    })
  }
}

export default RendererDebugManager
