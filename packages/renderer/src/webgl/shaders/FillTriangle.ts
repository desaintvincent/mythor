import simpleVertexShader from '../glsl/triangle.vs'
import colorFragmentShader from '../glsl/color.fs'
import Shader from './Shader'
import { Vec2 } from '@mythor/math'
import Color from '../../color/Color'
import { FillPolyOptions } from '../../systems/ShaderOptions'

export default class FillTriangle extends Shader {
  public constructor(gl: WebGL2RenderingContext) {
    super(gl, simpleVertexShader, colorFragmentShader, {
      attributes: {
        a_color: {
          size: 4,
        },
        a_position: {
          size: 2,
        },
      },
    })
  }

  public render(): void {
    // @todo DrawableFillPoly
    // do nothing
  }

  private drawTriangle(a: Vec2, b: Vec2, c: Vec2, color: Color): void {
    this.pushVertex({
      a_color: color,
      a_position: [a.x, a.y],
    })
    this.pushVertex({
      a_color: color,
      a_position: [b.x, b.y],
    })
    this.pushVertex({
      a_color: color,
      a_position: [c.x, c.y],
    })
  }

  public fillPoly(
    position: Vec2,
    points: Vec2[],
    params: FillPolyOptions
  ): void {
    if (points.length < 3) {
      throw new Error('A polygon must have at least 3 points')
    }
    points.forEach((a, i) => {
      const b = points[i + 2 > points.length ? 0 : i + 1]

      const ra = params.rotation ? a.rotate(params.rotation) : a
      const rb = params.rotation ? b.rotate(params.rotation) : b

      const pa = ra.add(position)
      const pb = rb.add(position)

      this.drawTriangle(pa, pb, position, params.color)
    })
  }
}
