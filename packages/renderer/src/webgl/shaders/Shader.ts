import { Component, Constructor, Entity, log, throwError } from '@mythor/core'
import Attribute, { AttributeOptions } from '../Attribute'
import Camera, { Projection } from '../../objects/Camera'
import createGLProgram from './helpers/createGLProgram'
import makeVertexArray from './helpers/makeVertexArray'
import Renderer from '../../systems/Renderer'

export type DrawFunctionType = (
  gl: WebGL2RenderingContext,
  elemNumber: number
) => void

interface ShaderOptions {
  component?: Constructor<Component>
  maxElements?: number
  attributes?: Record<string, Omit<AttributeOptions, 'maxElements'>>
  withMatrixAttribute?: boolean
  uniforms?: string[]
  transformFeedbackVaryings?: string[]
  drawFunction?: DrawFunctionType
}

type Uniform = WebGLUniformLocation

export enum UniformType {
  TEXTURE = 'uniform1i',
  FV_2 = 'uniform2fv',
  FV_4 = 'uniform4fv',
  FV_8 = 'uniform4fv',
  M4 = 'uniformMatrix4fv',
}

type V2 = [number, number]
type V4 = [number, number, number, number]
type V8 = [number, number, number, number, number, number, number, number]
type UniformValue = WebGLTexture | V4 | V2 | V8 | Projection

const defaultDrawFunction = (
  gl: WebGL2RenderingContext,
  elemNumber: number
): void => gl.drawArrays(gl.TRIANGLES, 0, elemNumber)

export const DEFAULT_MATRIX_CAMERA_LOCATION = 'matrix_camera'

export default class Shader {
  protected readonly gl: WebGL2RenderingContext
  protected camera: Camera
  protected readonly program: WebGLProgram
  protected readonly vao: WebGLVertexArrayObject
  protected readonly attributes: Map<string, Attribute> = new Map<
    string,
    Attribute
  >()
  protected readonly uniforms: Map<string, Uniform> = new Map<string, Uniform>()
  protected readonly maxElements: number
  protected elemNumber = 0
  protected readonly drawFunction: DrawFunctionType
  public component?: Constructor<Component>

  public constructor(
    gl: WebGL2RenderingContext,
    vertexShader: string,
    fragmentShader: string,
    options?: ShaderOptions
  ) {
    this.gl = gl
    this.component = options?.component
    this.maxElements = options?.maxElements ?? 10000
    this.drawFunction = options?.drawFunction ?? defaultDrawFunction
    if (!vertexShader && !fragmentShader) {
      return
    }
    this.program = createGLProgram(
      gl,
      vertexShader,
      fragmentShader,
      options?.transformFeedbackVaryings
    )
    this.vao = makeVertexArray(gl)
    this.use()

    const uniformNames = [
      ...(options?.withMatrixAttribute ?? true
        ? [DEFAULT_MATRIX_CAMERA_LOCATION]
        : []),
      ...(options?.uniforms ?? []),
    ]

    uniformNames.forEach((uniformName) => {
      this.uniforms.set(uniformName, this.getUniformLocation(uniformName))
    })

    Object.entries(options?.attributes ?? {}).forEach(
      ([name, attributeOptions]) => {
        this.attributes.set(
          name,
          new Attribute(gl, this.program, name, {
            maxElements: this.maxElements,
            ...attributeOptions,
          })
        )
      }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onEntityCreation(entity: Entity): void {
    // do nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async init(renderer: Renderer): Promise<void> {
    // do nothing
  }

  protected clear(): void {
    // do nothing
  }

  public preRender(camera: Camera): void {
    this.camera = camera
  }

  public render(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entity: Entity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    camera: Camera,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalTimeInSeconds: number
  ): void {
    // do nothing
  }

  public postRender(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    camera: Camera,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalTimeInSeconds: number
  ): void {
    this.flush()
    this.clear()
  }

  protected getUniformLocation(uniformName: string): WebGLUniformLocation {
    const location = this.gl.getUniformLocation(this.program, uniformName)

    if (!location) {
      throwError(`Could not get uniform location: ${uniformName}`)
    }

    return location ?? 0
  }

  protected pushVertex(vertex: Record<string, number[] | number>): void {
    this.attributes.forEach((attribute, name) => {
      if (attribute.isInstance) {
        return
      }

      if (!(name in vertex)) {
        throw new Error(`missing attribute: ${name}`)
      }

      attribute.pushData(vertex[name])
    })

    this.elemNumber++
    if (this.elemNumber >= this.maxElements) {
      this.flush()
    }
  }

  protected pushMultiVertex(
    vertex: Record<string, Array<number[] | number>>
  ): void {
    this.attributes.forEach((attribute, name) => {
      if (attribute.isInstance) {
        return
      }

      if (!(name in vertex)) {
        throw new Error(`missing attribute: ${name}`)
      }

      attribute.pushManyData(vertex[name])
    })
  }

  public flush(): void {
    if (!this.shouldDraw()) {
      return
    }

    this.gl.useProgram(this.program)
    this.gl.bindVertexArray(this.vao)
    this.setUniform(
      DEFAULT_MATRIX_CAMERA_LOCATION,
      UniformType.M4,
      this.camera.projection
    )
    this.attributes.forEach((attribute) => attribute.enable(this.gl))
    this.attributes.forEach((attribute) => attribute.bindData(this.gl))
    this.attributes.forEach((attribute) => attribute.pointer(this.gl))
    this.beforeDraw()
    this.drawFunction(this.gl, this.elemNumber)
    this.elemNumber = 0
  }

  protected beforeDraw(): void {
    // do nothing
  }

  protected setBufferToAttribute(name: string, value: WebGLBuffer): void {
    const attribute = this.attributes.get(name)

    if (!attribute) {
      log(`Attribute not found: ${name}`, 'red')

      return
    }
    attribute.enable(this.gl)
    attribute.pointer(this.gl, value)
  }

  protected setUniform(
    name: string,
    type: UniformType.TEXTURE,
    value?: WebGLTexture
  ): void
  protected setUniform(name: string, type: UniformType.FV_8, value?: V8): void
  protected setUniform(name: string, type: UniformType.FV_4, value?: V4): void
  protected setUniform(name: string, type: UniformType.FV_2, value?: V2): void
  protected setUniform(
    name: string,
    type: UniformType.M4,
    value?: Projection
  ): void
  protected setUniform(
    name: string,
    type: UniformType,
    value?: UniformValue
  ): void {
    if (!value) {
      return
    }
    const location = this.uniforms.get(name)

    if (!location) {
      log(`Location not found: ${name}`, 'red')

      return
    }

    switch (type) {
      case UniformType.TEXTURE: {
        this.gl.bindTexture(this.gl.TEXTURE_2D, value)
        this.gl.uniform1i(location, value as number)

        break
      }
      case UniformType.M4: {
        this.gl.uniformMatrix4fv(location, false, value as Float32List)
        break
      }
      default: {
        this.gl[type](location, value as (Float32List & number) & Float32List)
      }
    }
  }

  protected shouldDraw(): boolean {
    return !!this.elemNumber
  }

  protected use(): void {
    this.gl.useProgram(this.program)
  }
}
