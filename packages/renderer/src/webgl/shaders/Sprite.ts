import spriteVertexShader from '../glsl/sprite.vs'
import textureFragmentShader from '../glsl/texture.fs'
import Shader, { DrawFunctionType, UniformType } from './Shader'
import Texture from '../../toRename/Texture'
import { Component, Constructor, Entity, Transform } from '@mythor/core'
import SpriteComponent from '../../components/Sprite'
import { colorWhite } from '../../color/Color'
const numVertices = 6

const drawFunction: DrawFunctionType = (gl, elemNumber) => {
  gl.drawArraysInstanced(gl.TRIANGLES, 0, numVertices, elemNumber)
}

export default class Sprite extends Shader {
  protected currentTexture: Texture

  public constructor(
    gl: WebGL2RenderingContext,
    component?: Constructor<Component>
  ) {
    const u = 0.5
    super(gl, spriteVertexShader, textureFragmentShader, {
      attributes: {
        a_color: {
          size: 4,
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
        a_scale: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        a_size: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        a_texcoord: {
          data: [
            /*
               a -- b
               |    |
               d -- c

               a: 0, 0
               b: 1, 0
               c: 1, 1
               d: 0, 1
              */
            0,
            0, // a
            1,
            0, //  b
            0,
            1, //  d

            1,
            0, //  b
            1,
            1, //   c
            0,
            1, //  d
          ],
          isInstance: true,
          size: 2,
          usage: gl.STATIC_DRAW,
        },
        a_texture_origin: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        a_texture_size: {
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
      component: component ?? SpriteComponent,
      drawFunction,
      uniforms: ['u_texture'],
    })
  }

  public render(entity: Entity): void {
    const {
      texture,
      size: textureSize,
      origin,
      scale,
    } = entity.get(SpriteComponent)
    if (texture.webGLTexture !== this.currentTexture?.webGLTexture) {
      this.flush()
      this.currentTexture = texture
    }

    const { position, size, rotation } = entity.get(Transform)
    // @todo color in renderer
    const color = colorWhite
    this.pushVertex({
      a_color: color,
      a_position: position.array(),
      a_rotation: [rotation],
      a_scale: scale.array(),
      a_size: size.array(),
      a_texture_origin: origin.array(),
      a_texture_size: textureSize.array(),
    })
  }

  protected beforeDraw(): void {
    this.setUniform(
      'u_texture',
      UniformType.TEXTURE,
      this.currentTexture.webGLTexture
    )
  }

  protected shouldDraw(): boolean {
    return this.elemNumber > 0 && this.currentTexture !== null
  }
}
