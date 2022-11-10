import { createGame } from '@mythor/game'
import { Manager } from '@mythor/core'
import { Renderer } from '@mythor/renderer'
import { Vec2 } from '@mythor/math'

class DrawGeometry extends Manager {
  public constructor() {
    super('DrawGeometry')
  }

  public update(): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.text(new Vec2(-350, -160), 'regular', {
        color: [0, 1, 0, 1],
      })
      renderer.text(new Vec2(-350, -60), 'rotation', {
        color: [0, 1, 0, 1],
      })
      renderer.text(new Vec2(-350, 40), 'filled', {
        color: [0, 1, 0, 1],
      })
      renderer.text(new Vec2(-350, 130), 'roration\nfilled', {
        color: [0, 1, 0, 1],
      })
    })

    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.strokeRect(new Vec2(-150, -150), new Vec2(150, 50), {
        color: [1, 0, 0, 1],
        diagonal: true,
      })
      renderer.strokeRect(new Vec2(-150, -50), new Vec2(150, 50), {
        color: [1, 1, 0, 1],
        diagonal: true,
        rotation: Math.PI / 4,
      })
      renderer.fillRect(new Vec2(-150, 50), new Vec2(150, 50), {
        color: [1, 1, 0, 1],
      })
      renderer.fillRect(new Vec2(-150, 150), new Vec2(150, 50), {
        color: [1, 0, 0, 1],
        rotation: Math.PI / 4,
      })
    })

    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.strokeCircle(new Vec2(0, -150), new Vec2(80, 40), {
        color: [0, 1, 0, 1],
        diagonal: true,
        rotation: Math.PI / 4,
      })
      renderer.strokeCircle(new Vec2(0, -50), new Vec2(60, 60), {
        color: [0, 1, 0, 1],
        diagonal: true,
        rotation: Math.PI / 4,
      })
      renderer.fillCircle(new Vec2(0, 50), new Vec2(80, 40), {
        color: [0, 1, 0, 1],
        rotation: Math.PI / 4,
      })
      renderer.fillCircle(new Vec2(0, 150), new Vec2(60, 60), {
        color: [0, 1, 0, 1],
        rotation: Math.PI / 4,
      })
    })

    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.line(new Vec2(50, -150), new Vec2(100, -150), {
        color: [0, 0, 1, 1],
      })
      renderer.line(new Vec2(50, -50), new Vec2(100, -50), {
        color: [0, 0, 1, 1],
      })
      renderer.line(new Vec2(50, 50), new Vec2(100, 50), {
        color: [0, 0, 1, 1],
      })
      renderer.line(new Vec2(50, 150), new Vec2(100, 150), {
        color: [0, 0, 1, 1],
      })
    })

    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.strokeCircle(new Vec2(150, -150), new Vec2(40, 40), {
        color: [1, 1, 0, 1],
        diagonal: true,
      })
      renderer.strokeCircle(new Vec2(150, -50), new Vec2(40, 40), {
        color: [1, 1, 0, 1],
        diagonal: true,
        rotation: Math.PI / 4,
      })
      renderer.fillCircle(new Vec2(150, 50), new Vec2(40, 40), {
        color: [1, 1, 0, 1],
      })
      renderer.fillCircle(new Vec2(150, 150), new Vec2(40, 40), {
        color: [1, 1, 0, 1],
        rotation: Math.PI / 4,
      })
    })

    this.ecs.system(Renderer).onDraw((renderer) => {
      const a = 20
      const points = [
        new Vec2(a, a),
        new Vec2(-a, a),
        new Vec2(-a, -a),
        new Vec2(0, -a * 1.5),
        new Vec2(a, -a),
      ]
      renderer.strokePoly(new Vec2(250, -150), points, {
        color: [0, 1, 1, 1],
        diagonal: true,
      })
      renderer.strokePoly(new Vec2(250, -50), points, {
        color: [0, 1, 1, 1],
        diagonal: true,
        rotation: Math.PI / 4,
      })
      renderer.fillPoly(new Vec2(250, 50), points, {
        color: [0, 1, 1, 1],
      })
      renderer.fillPoly(new Vec2(250, 150), points, {
        color: [0, 1, 1, 1],
        rotation: Math.PI / 4,
      })
    })
  }
}

createGame({
  managers: [new DrawGeometry()],
  systems: [new Renderer()],
})
