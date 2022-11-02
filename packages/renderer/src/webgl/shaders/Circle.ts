import circleVertexShader from '../glsl/circle.vs'
import circleFragmentShader from '../glsl/circle.fs'
import Shader, { DrawFunctionType } from './Shader'
import RenderedCircle from '../../components/RenderedCircle'
import { Entity, Transform } from '@mythor/core'
import { CircleOptions } from '../../systems/ShaderOptions'
import { Vec2 } from '@mythor/math'

const numVertices = 6

const drawFunction: DrawFunctionType = (gl, elemNumber) => {
  gl.drawArraysInstanced(gl.TRIANGLES, 0, numVertices, elemNumber)
}

export default class Circle extends Shader {
  public constructor(gl: WebGL2RenderingContext) {
    const u = 0.5
    super(gl, circleVertexShader, circleFragmentShader, {
      attributes: {
        a_color: {
          size: 4,
          vertexAttribDivisor: 1,
        },
        a_fill: {
          size: 1,
          vertexAttribDivisor: 1,
        },
        a_position: {
          size: 2,
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

             a: -0.5, -0.5
             b: 0.5, -0.5
             c: 0.5, 0.5
             d: -0.5, 0.5
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
        a_width: {
          size: 1,
          vertexAttribDivisor: 1,
        },
      },
      component: RenderedCircle,
      drawFunction,
    })
  }

  public render(entity: Entity): void {
    const { offset, color, radius, width, fill } = entity.get(RenderedCircle)
    const { position, rotation, size } = entity.get(Transform)
    this.circle(
      Vec2.add(position, offset),
      radius ? Vec2.create(radius, radius) : size,
      {
        color,
        fill,
        rotation,
        width: width ?? 1,
      }
    )
  }

  public circle(position: Vec2, size: Vec2, params: CircleOptions): void {
    this.pushVertex({
      a_color: params.color,
      a_fill: [params.fill ? 1 : 0],
      a_position: position.array(),
      a_rotation: [params.rotation],
      a_size: size.array(),
      a_width: [params.width],
    })
  }
}
