import Shader, { DEFAULT_MATRIX_CAMERA_LOCATION, UniformType } from './Shader'
import particleUpdateVert from '../glsl/particleRender.vs'
import particleUpdateFrag from '../glsl/particleRender.fs'
import ParticleEmitter from '../../components/ParticleEmitter'
import Renderer from '../../systems/Renderer'
import ParticlesUpdate from './ParticlesUpdate'
import particleAttributes from './helpers/particleAttributes'
import { Entity } from '@mythor/core'
import isParticleEmitterAlive from './helpers/isParticleEmitterAlive'
import getParticleEmitterBuffers from './helpers/getParticleEmitterBuffers'

class ParticlesRender extends Shader {
  public constructor(gl: WebGL2RenderingContext) {
    const u = 0.5
    const attributes = Object.entries(particleAttributes).reduce(
      (acc, [key, attribute]) => {
        return {
          ...acc,
          ...(attribute.render
            ? { [key]: { ...attribute, vertexAttribDivisor: 1 } }
            : {}),
        }
      },
      {}
    )
    super(gl, particleUpdateVert, particleUpdateFrag, {
      attributes: {
        ...attributes,
        texcoord: {
          data: [
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
        texture_origin: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        texture_size: {
          size: 2,
          vertexAttribDivisor: 1,
        },
        vertex: {
          data: [
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
      component: ParticleEmitter,
      uniforms: [
        'u_startColor',
        'u_endColor',
        'u_texture',
        'u_minMaxSize',
        'u_bezier',
      ],
    })
  }

  public async init(renderer: Renderer): Promise<void> {
    const shaders = renderer.shapes.get(ParticleEmitter) ?? []

    const hasParticleUpdate = shaders.some(
      (shader) => shader instanceof ParticlesUpdate
    )

    if (!hasParticleUpdate) {
      throw new Error(
        'ParticlesRender can be used only if ParticlesUpdate is enabled'
      )
    }
  }

  public flush(): void {
    // do nothing
  }

  public render(entity: Entity): void {
    const particleEmitter = entity.get(ParticleEmitter)

    if (!isParticleEmitterAlive(particleEmitter) || !particleEmitter.texture) {
      return
    }

    this.gl.useProgram(this.program)
    this.gl.bindVertexArray(this.vao)

    this.setUniform(
      DEFAULT_MATRIX_CAMERA_LOCATION,
      UniformType.M4,
      this.camera.projection
    )

    this.attributes.forEach((attribute, name) => {
      if (name in particleAttributes) {
        const { buffer1 } = getParticleEmitterBuffers(particleEmitter, name)
        this.setBufferToAttribute(name, buffer1)
      }
    })

    this.attributes.get('vertex')?.flush(this.gl)
    this.attributes.get('texcoord')?.flush(this.gl)

    const totalNumber = Math.floor(particleEmitter.particleNumber)

    this.setBufferToAttribute(
      'texture_origin',
      particleEmitter.textureOriginBuffer
    )
    this.setBufferToAttribute('texture_size', particleEmitter.textureSizeBuffer)

    this.setUniform(
      'u_texture',
      UniformType.TEXTURE,
      particleEmitter.texture.webGLTexture
    )
    this.setUniform(
      'u_startColor',
      UniformType.FV_4,
      particleEmitter.startColor
    )
    this.setUniform('u_endColor', UniformType.FV_4, particleEmitter.endColor)
    this.setUniform(
      'u_minMaxSize',
      UniformType.FV_4,
      particleEmitter.minMaxSize
    )
    this.setUniform('u_bezier', UniformType.FV_8, [
      ...particleEmitter.colorTimingBezier,
      ...particleEmitter.sizeTimingBezier,
    ])
    this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, totalNumber)
  }
}

export default ParticlesRender
