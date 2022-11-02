import Shader from './Shader'
import lineVertexShader from '../glsl/line.vs'
import colorFragmentShader from '../glsl/color.fs'
import { LineOptions, StrokePolyOptions } from '../../systems/ShaderOptions'
import { Vec2 } from '@mythor/math'

class Lines extends Shader {
  public constructor(gl: WebGL2RenderingContext) {
    super(gl, lineVertexShader, colorFragmentShader, {
      attributes: {
        inLineEnd: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        inLineStart: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        inLineWidth: {
          size: 1,
          vertexAttribDivisor: 1,
        },
        lineColor: {
          size: 4,
          vertexAttribDivisor: 1,
        },
        vertexPos: {
          data: [
            -0.5, 0.5, 1.0, -0.5, -0.5, 1.0, 0.5, 0.5, 1.0, 0.5, -0.5, 1.0,
          ],
          isInstance: true,
          size: 3,
          usage: gl.STATIC_DRAW,
        },
      },
      drawFunction: (glContext, elemNumber) =>
        glContext.drawArraysInstanced(
          glContext.TRIANGLE_STRIP,
          0,
          4,
          elemNumber
        ),
    })
  }

  public rect(position: Vec2, size: Vec2, options: StrokePolyOptions): void {
    const w2 = size.x / 2
    const h2 = size.y / 2

    this.poly(
      position,
      [
        new Vec2(+w2, +h2),
        new Vec2(-w2, +h2),
        new Vec2(-w2, -h2),
        new Vec2(+w2, -h2),
      ],
      options
    )
  }

  public poly(
    position: Vec2,
    points: Vec2[],
    options: StrokePolyOptions
  ): void {
    if (points.length < 3) {
      throw new Error('A polygon must have at least 3 points')
    }

    const lines = points.map((a, i) => {
      const b = points[i + 2 > points.length ? 0 : i + 1]

      return [a, b]
    })

    if (options.diagonal) {
      lines.push([new Vec2(0, 0), points[0]])
    }

    lines.forEach(([a, b]) => {
      const ra = options.rotation ? a.rotate(options.rotation) : a
      const rb = options.rotation ? b.rotate(options.rotation) : b

      const pa = ra.add(position)
      const pb = rb.add(position)

      this.line(pa, pb, {
        color: options.color,
        width: options.width,
      })
    })
  }

  public line(start: Vec2, end: Vec2, options: LineOptions): void {
    if (options.width < 0) {
      throw new Error('Width must be greater than zero')
    }
    this.pushVertex({
      inLineEnd: [end.x, end.y],
      inLineStart: [start.x, start.y],
      inLineWidth: [options.width],
      lineColor: options.color,
    })
  }
}

export default Lines
