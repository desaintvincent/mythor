import particleUpdateVert from '../glsl/particleUpdate.vs'
import particleUpdateFrag from '../glsl/particleUpdate.fs'
import particleAttributes, {
  ParticleAttributeName,
} from './helpers/particleAttributes'
import Shader, { UniformType } from './Shader'
import ParticleEmitter from '../../components/ParticleEmitter'
import makeRandomTexture from './helpers/makeRandomTexture'
import makeTransformFeedback from './helpers/makeTransformFeedback'
import { Entity, Transform } from '@mythor/core'
import isParticleEmitterAlive from './helpers/isParticleEmitterAlive'
import makeBuffer from './helpers/makeBuffer'
import makeDefaultTexture from './helpers/makeDefaultTexture'
import Camera from '../../objects/Camera'
import { Vec2 } from '@mythor/math'
import getParticleEmitterBuffers from './helpers/getParticleEmitterBuffers'

const initialData: Partial<
  Record<
    ParticleAttributeName,
    (particleNumber: number, size: number) => number[]
  >
> = {
  [ParticleAttributeName.AGE_AND_LIFETIME]: (particleNumber) =>
    new Array(particleNumber)
      .fill(0)
      .map(() => [1, 0])
      .flat(),
}

export default class ParticlesUpdate extends Shader {
  private readonly transformFeedback: WebGLTransformFeedback
  private readonly randomTexture: WebGLTexture

  public constructor(gl: WebGL2RenderingContext) {
    super(gl, particleUpdateVert, particleUpdateFrag, {
      attributes: particleAttributes,
      component: ParticleEmitter,
      maxElements: 0,
      transformFeedbackVaryings: Object.keys(particleAttributes).map(
        (attribute) => `out_${attribute}`
      ),
      uniforms: [
        'rgNoise',
        'u_time',
        'u_minMaxLifetime',
        'u_spawnPosition',
        'u_minMaxTheta',
        'u_minMaxSpeed',
        'u_minMaxTorque',
        'u_minMaxRotation',
        'u_gravity',
      ],
      withMatrixAttribute: false,
    })

    this.randomTexture = makeRandomTexture(gl, 512, 512)
    this.transformFeedback = makeTransformFeedback(gl)
  }

  private initialData(
    name: string,
    particleNumber: number,
    size: number
  ): Float32Array {
    const fn = initialData[name as ParticleAttributeName]
    if (!fn) {
      return new Float32Array(particleNumber * size)
    }

    const data = fn(particleNumber, size)

    if (data.length !== particleNumber * size) {
      throw new Error(`Wrong size for initialised data of attribute ${name}`)
    }

    return new Float32Array(data)
  }

  public flush(): void {
    // do nothing
  }
  public clean(): void {
    // do nothing
  }

  private updateParticleAge(
    entity: Entity,
    particleEmitter: ParticleEmitter,
    elapsedTimeInSeconds: number
  ): void {
    particleEmitter.age += elapsedTimeInSeconds

    if (!isParticleEmitterAlive(particleEmitter)) {
      particleEmitter.onEndOfLife?.(entity)
      if (particleEmitter.deleteOnEndOfLife) {
        entity.destroy()
      }
    }
  }

  private updateParticleNumber(
    particleEmitter: ParticleEmitter,
    elapsedTimeInSeconds: number
  ): void {
    if (particleEmitter.particleNumber >= particleEmitter.maxParticleNumber) {
      return
    }

    const lifetime = Math.max(
      particleEmitter.minMaxLifeTime.x,
      particleEmitter.minMaxLifeTime.y
    )
    const maxParticleNumber = particleEmitter.maxParticleNumber

    const particlesToAdd =
      (maxParticleNumber / lifetime) *
      elapsedTimeInSeconds *
      particleEmitter.frequency

    const particleNumber = particleEmitter.particleNumber + particlesToAdd

    if (particleNumber < particleEmitter.maxParticleNumber) {
      particleEmitter.particleNumber = particleNumber
    } else {
      particleEmitter.particleNumber = particleEmitter.maxParticleNumber
    }
  }

  public onEntityCreation(entity: Entity): void {
    const particleEmitter = entity.get(ParticleEmitter)
    const textureOriginData = new Array(
      Math.floor(particleEmitter.maxParticleNumber)
    )
      .fill(0)
      .map(() => particleEmitter.textureOriginFunction().array())
      .flat()
    const textureSizeData = new Array(
      Math.floor(particleEmitter.maxParticleNumber)
    )
      .fill(0)
      .map(() => particleEmitter.textureSizeFunction().array())
      .flat()

    particleEmitter.age = 0
    particleEmitter.textureOriginBuffer = makeBuffer(
      this.gl,
      new Float32Array(textureOriginData)
    )
    particleEmitter.textureSizeBuffer = makeBuffer(
      this.gl,
      new Float32Array(textureSizeData)
    )
    this.attributes.forEach((attribute, name) => {
      const initialData = this.initialData(
        name,
        particleEmitter.maxParticleNumber,
        attribute.size
      )

      const buffer1 = makeBuffer(this.gl, initialData)
      const buffer2 = makeBuffer(this.gl, initialData)
      particleEmitter.buffers.set(name, {
        buffer1,
        buffer2,
      })
    })

    if (!particleEmitter.texture) {
      particleEmitter.texture = makeDefaultTexture(this.gl)
    }
  }

  public render(
    entity: Entity,
    camera: Camera,
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    const transform = entity.get(Transform)
    const particleEmitter = entity.get(ParticleEmitter)

    if (!isParticleEmitterAlive(particleEmitter)) {
      return
    }

    this.updateParticleAge(entity, particleEmitter, elapsedTimeInSeconds)
    this.updateParticleNumber(particleEmitter, elapsedTimeInSeconds)
    this.gl.useProgram(this.program)
    this.gl.bindVertexArray(this.vao)

    this.setUniform('rgNoise', UniformType.TEXTURE, this.randomTexture)
    this.setUniform('u_time', UniformType.FV_2, [
      elapsedTimeInSeconds,
      totalTimeInSeconds * 1000,
    ])
    this.setUniform(
      'u_minMaxLifetime',
      UniformType.FV_2,
      particleEmitter.minMaxLifeTime.array()
    )
    this.setUniform(
      'u_gravity',
      UniformType.FV_2,
      particleEmitter.gravity.array()
    )
    this.setUniform(
      'u_minMaxTheta',
      UniformType.FV_2,
      particleEmitter.minMaxTheta
        .array()
        .map((t) => t + transform.rotation) as [number, number]
    )
    this.setUniform(
      'u_minMaxSpeed',
      UniformType.FV_2,
      particleEmitter.minMaxSpeed.array()
    )
    this.setUniform(
      'u_minMaxRotation',
      UniformType.FV_2,
      particleEmitter.minMaxRotation.array()
    )
    this.setUniform(
      'u_minMaxTorque',
      UniformType.FV_2,
      particleEmitter.minMaxTorque.array()
    )
    this.setUniform(
      'u_spawnPosition',
      UniformType.FV_2,
      Vec2.add(transform.position, particleEmitter.offset).array()
    )

    this.gl.bindTransformFeedback(
      this.gl.TRANSFORM_FEEDBACK,
      this.transformFeedback
    )
    let index = 0
    this.attributes.forEach((attribute, name) => {
      const { buffer1, buffer2 } = getParticleEmitterBuffers(
        particleEmitter,
        name
      )
      this.setBufferToAttribute(name, buffer1)

      this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, index, buffer2)

      // swap
      particleEmitter.buffers.set(name, {
        buffer1: buffer2,
        buffer2: buffer1,
      })
      index++
    })
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)

    // no need to call the fragment shader
    this.gl.enable(this.gl.RASTERIZER_DISCARD)

    this.gl.bindTransformFeedback(
      this.gl.TRANSFORM_FEEDBACK,
      this.transformFeedback
    )
    this.gl.beginTransformFeedback(this.gl.POINTS)
    this.gl.drawArrays(
      this.gl.POINTS,
      0,
      Math.floor(particleEmitter.particleNumber)
    )
    this.gl.endTransformFeedback()
    this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null)

    // turn on using fragment shaders again
    this.gl.disable(this.gl.RASTERIZER_DISCARD)
  }
}
