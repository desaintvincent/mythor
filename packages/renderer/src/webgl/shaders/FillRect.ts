import rectVertexShader from '../glsl/roundedRect.vs'
import colorFragmentShader from '../glsl/roundedRect.fs'
import Shader, { DrawFunctionType } from './Shader'
import { FillPolyOptions } from '../../systems/ShaderOptions'
import FillRectComponent from '../../components/FillRect'
import { Entity, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'

type FillRectOptions = FillPolyOptions & { radius?: number }

const numVertices = 6

const drawFunction: DrawFunctionType = (gl, elemNumber) => {
  gl.drawArraysInstanced(gl.TRIANGLES, 0, numVertices, elemNumber)
}

export default class FillRect extends Shader {
  public constructor(gl: WebGL2RenderingContext) {
    const u = 0.5
    super(gl, rectVertexShader, colorFragmentShader, {
      attributes: {
        a_color: {
          size: 4,
          vertexAttribDivisor: 1,
        },
        a_position: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        a_radius: {
          size: 1,
          vertexAttribDivisor: 1,
        },
        a_rotation: {
          size: 1,
          vertexAttribDivisor: 1,
        },
        a_size: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        a_vertex: {
          data: [
            /*
             a -- b
             |    |
             d -- c

             a: -1, -1
             b: 1, -1
             c: 1, 1
             d: -1, 1
            */
            -u,
            -u, // a
            u,
            -u, //  b
            -u,
            u, //  d

            u,
            -u, //  b
            u,
            u, //   c
            -u,
            u, //  d
          ],
          isInstance: true,
          size: 2,
          usage: gl.STATIC_DRAW,
        },
      },
      component: FillRectComponent,
      drawFunction,
    })
  }

  public render(entity: Entity): void {
    const {
      offset,
      color,
      size: fillRectSize,
      radius,
    } = entity.get(FillRectComponent)
    const { position, rotation, size } = entity.get(Transform)

    this.rect(Vec2.add(position, offset), fillRectSize ?? size, {
      color: color,
      radius: radius,
      rotation: rotation,
    })
  }

  public rect(position: Vec2, size: Vec2, params: FillRectOptions): void {
    this.pushVertex({
      a_color: params.color,
      a_position: position.array(),
      a_radius: [params.radius ?? 0],
      a_rotation: [params.rotation],
      a_size: size.array(),
    })
  }
}
