import { Entity, System, Transform3D } from '@mythor/core'
import { Mat4, Mat4Array } from '@mythor/math'
import {
  createGLProgram,
  makeBuffer,
  makeVertexArray,
  VertexAttribute,
} from '@mythor/gl-utils'
import Camera3D from '../objects/Camera3D'
import Renderable3D from '../components/Renderable3D'
import vertexShader from '../webgl/glsl/basic.vs'
import fragmentShader from '../webgl/glsl/basic.fs'

export interface Renderer3DParams {
  camera?: Camera3D
  canvasName?: string
}

const defaultCanvasName = 'canvas'

export default class Renderer3D extends System {
  public readonly camera: Camera3D
  private readonly canvasName: string
  private gl!: WebGL2RenderingContext
  private program!: WebGLProgram
  private modelMatrixLocation!: WebGLUniformLocation
  private viewProjectionMatrixLocation!: WebGLUniformLocation
  private readonly vaoByEntity = new Map<Entity, WebGLVertexArrayObject>()

  public constructor(params?: Renderer3DParams) {
    super('Renderer3D', [Transform3D, Renderable3D])

    this.camera = params?.camera ?? new Camera3D()
    this.canvasName = params?.canvasName ?? defaultCanvasName
  }

  public get glContext(): WebGL2RenderingContext {
    return this.gl
  }

  protected async onSystemInit(): Promise<void> {
    const canvas = document.getElementById(this.canvasName)

    if (!canvas) {
      throw new Error('Could not find canvas')
    }

    const htmlCanvas = canvas as HTMLCanvasElement
    const gl = htmlCanvas.getContext('webgl2')

    if (!gl) {
      throw new Error('Could not create GL context')
    }

    this.gl = gl
    this.camera.aspect = htmlCanvas.width / htmlCanvas.height

    this.gl.enable(this.gl.DEPTH_TEST)

    this.program = createGLProgram(this.gl, vertexShader, fragmentShader)

    const modelMatrixLocation = this.gl.getUniformLocation(
      this.program,
      'modelMatrix'
    )
    const viewProjectionMatrixLocation = this.gl.getUniformLocation(
      this.program,
      'viewProjectionMatrix'
    )

    if (!modelMatrixLocation || !viewProjectionMatrixLocation) {
      throw new Error('Could not find uniform locations')
    }

    this.modelMatrixLocation = modelMatrixLocation
    this.viewProjectionMatrixLocation = viewProjectionMatrixLocation
  }

  protected onEntityCreation(entity: Entity): void {
    const renderable = entity.get(Renderable3D)
    const positionBuffer = makeBuffer(
      this.gl,
      renderable.vertices,
      this.gl.STATIC_DRAW
    )
    const colorBuffer = makeBuffer(
      this.gl,
      renderable.colors,
      this.gl.STATIC_DRAW
    )
    const positionLocation = this.gl.getAttribLocation(this.program, 'position')
    const colorLocation = this.gl.getAttribLocation(this.program, 'vertexColor')
    const positionAttribute: VertexAttribute = {
      buffer: positionBuffer,
      location: positionLocation,
      numComponents: 3,
    }
    const colorAttribute: VertexAttribute = {
      buffer: colorBuffer,
      location: colorLocation,
      numComponents: 3,
    }

    this.vaoByEntity.set(
      entity,
      makeVertexArray(this.gl, [positionAttribute, colorAttribute])
    )
  }

  protected onEntityDestruction(entity: Entity): void {
    this.vaoByEntity.delete(entity)
  }

  public update(): void {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clearColor(0, 0, 0, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.gl.useProgram(this.program)
    this.gl.uniformMatrix4fv(
      this.viewProjectionMatrixLocation,
      false,
      this.camera.viewProjectionMatrix
    )

    this.entities.forEach((entity) => {
      this.renderEntity(entity)
    })
  }

  private renderEntity(entity: Entity): void {
    const transform = entity.get(Transform3D)
    const renderable = entity.get(Renderable3D)
    const vao = this.vaoByEntity.get(entity)

    if (!vao) {
      return
    }

    const modelMatrix = this.buildModelMatrix(transform)

    this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, modelMatrix)

    this.gl.bindVertexArray(vao)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, renderable.vertexCount)
  }

  private buildModelMatrix(transform: Transform3D): Mat4Array {
    const translation = Mat4.translate(transform.position)
    const rotation = transform.rotation.toMat4()
    const scale = Mat4.scale(transform.scale)

    return Mat4.multiply(translation, Mat4.multiply(rotation, scale))
  }
}
