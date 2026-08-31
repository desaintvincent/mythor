import { Component, Constructor, Entity, System, Transform } from '@mythor/core'
import { Rect, Vec2 } from '@mythor/math'
import Camera from '../objects/Camera'
import QuadTreeList from '../quadTree/QuadTreeList'
import Renderable from '../components/Renderable'
import RendererCore, { RendererParams } from './RendererCore'
import ShaderRegistry from './ShaderRegistry'
import DrawAPI from './DrawAPI'
import Shader from '../webgl/shaders/Shader'
import Color from '../color/Color'
import type {
  CircleOptions,
  FillPolyOptions,
  LineOptions,
  StrokePolyOptions,
} from './ShaderOptions'

type FnToDraw = (renderer: Renderer) => void

class Renderer extends System {
  private readonly core: RendererCore
  private readonly shaderRegistry: ShaderRegistry
  private readonly drawApi: DrawAPI
  private readonly initDefaultShaders: boolean
  private readonly movedEntities: Map<string, Entity> = new Map<
    string,
    Entity
  >()

  public constructor(params?: RendererParams) {
    super('Renderer', [Renderable, Transform], {
      list: QuadTreeList,
    })

    this.initDefaultShaders = params?.initDefaultShaders ?? true
    this.core = new RendererCore(params)
    this.shaderRegistry = new ShaderRegistry()
    this.drawApi = new DrawAPI(this, this.core, this.shaderRegistry)
  }

  public get gl(): WebGL2RenderingContext {
    return this.core.gl
  }

  public get shapes(): Map<Constructor<Component>, Shader[]> {
    return this.shaderRegistry.shapes
  }

  public get useTree(): boolean {
    return this._useTree
  }

  public set useTree(value: boolean) {
    this._useTree = value
  }

  private _useTree = false

  public update(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    this.core.clear()
    this.core.beginFrame()
    this.core.camera.update(elapsedTimeInSeconds)
    this.updateMovedEntities()

    this.shaderRegistry.forEachShader((shader) => {
      shader.preRender(this.core.camera)
    })

    const cb = (entity: Entity): void => {
      this.onEntityUpdate(entity, elapsedTimeInSeconds, totalTimeInSeconds)
    }

    const entities = this.entities as QuadTreeList

    if (this.useTree) {
      entities.searchForEach(this.fov, cb)
    } else {
      entities.naiveSearchForeach(this.fov, cb)
    }

    this.drawApi.applyDrawingFunctions()

    this.shaderRegistry.forEachShader((shader) => {
      shader.postRender(
        this.core.camera,
        elapsedTimeInSeconds,
        totalTimeInSeconds
      )
    })

    this.core.renderPostProcessing()
    this.core.prepareGuiPass()

    this.shaderRegistry.forEachShader((shader) => {
      shader.preRender(this.core.guiCamera)
    })
    this.renderScreenSpaceEntities(elapsedTimeInSeconds, totalTimeInSeconds)
    this.drawApi.applyGuiDrawingFunctions()
    this.shaderRegistry.forEachShader((shader) =>
      shader.postRender(
        this.core.guiCamera,
        elapsedTimeInSeconds,
        totalTimeInSeconds
      )
    )

    this.core.endFrame()
  }

  public get fov(): Rect {
    return this.core.fov
  }

  public setTree(rect: Rect): void {
    this.useTree = true
    ;(this.entities as QuadTreeList).resize(rect)
  }

  protected async onSystemInit(): Promise<void> {
    if (!this.initDefaultShaders) {
      return
    }

    await this.shaderRegistry.initDefaultShaders(this.core.gl, this)
  }

  protected onEntityCreation(entity: Entity): void {
    const renderable = entity.get(Renderable)
    this.shapes.forEach((shapes, key) => {
      if (entity.has(key)) {
        shapes.forEach((shape) => shape.onEntityCreation(entity))
        renderable.shapes.push(key)
      }
    })

    if (renderable.shapes.length < 1) {
      throw new Error('Renderable must have at least one shape')
    }

    if (!renderable.static && this.useTree) {
      const { position } = entity.get(Transform)
      const cb = (): void => this.onEntityChange(entity)

      position.observe(cb)
    }
  }

  protected onEntityDestruction(entity: Entity): void {
    const renderable = entity.get(Renderable)

    renderable.shapes.forEach((key) => {
      const shaders = this.shapes.get(key)
      shaders?.forEach((shape) => shape.onEntityDestruction(entity))
    })
  }

  protected onEntityUpdate(
    entity: Entity,
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    if (entity.get(Renderable).screenSpace) {
      // Rendered separately, in screen space, in renderScreenSpaceEntities()
      return
    }

    this.renderEntity(
      entity,
      this.core.camera,
      elapsedTimeInSeconds,
      totalTimeInSeconds
    )
  }

  protected onEntityChange(entity: Entity): void {
    if (entity.has(Renderable)) {
      this.movedEntities.set(entity._id, entity)
    }
    entity.children.forEach((child) => this.onEntityChange(child))
  }

  public getCamera(): Camera {
    return this.core.camera
  }

  public onDraw(fn: FnToDraw): void {
    this.drawApi.onDraw(fn)
  }

  public onDrawGui(fn: FnToDraw): void {
    this.drawApi.onDrawGui(fn)
  }

  public fillRect(
    position: Vec2,
    size: Vec2,
    options?: Partial<FillPolyOptions> & { radius?: number }
  ): void {
    this.drawApi.fillRect(position, size, options)
  }

  public strokeRect(
    position: Vec2,
    size: Vec2,
    options?: Partial<StrokePolyOptions>
  ): void {
    this.drawApi.strokeRect(position, size, options)
  }

  public fillCircle(
    position: Vec2,
    size: Vec2 | number,
    options?: Omit<Partial<CircleOptions>, 'fill'>
  ): void {
    this.drawApi.fillCircle(position, size, options)
  }

  public strokeCircle(
    position: Vec2,
    size: Vec2 | number,
    options?: Omit<Partial<CircleOptions>, 'fill'> & { diagonal?: boolean }
  ): void {
    this.drawApi.strokeCircle(position, size, options)
  }

  public lineHeight(): number {
    return this.drawApi.lineHeight()
  }

  public text(
    position: Vec2,
    text: string,
    params?: { color?: Color; size?: number }
  ): void {
    this.drawApi.text(position, text, params)
  }

  public line(
    positionStart: Vec2,
    positionEnd: Vec2,
    options?: Partial<LineOptions>
  ): void {
    this.drawApi.line(positionStart, positionEnd, options)
  }

  public strokePoly(
    position: Vec2,
    points: Vec2[],
    options?: Partial<StrokePolyOptions>
  ): void {
    this.drawApi.strokePoly(position, points, options)
  }

  public fillPoly(
    position: Vec2,
    points: Vec2[],
    options?: Partial<FillPolyOptions>
  ): void {
    this.drawApi.fillPoly(position, points, options)
  }

  public async addShader(shader: Shader): Promise<void> {
    await this.shaderRegistry.addShader(shader, this)
  }

  private renderScreenSpaceEntities(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    this.entities.forEach((entity) => {
      if (entity.get(Renderable).screenSpace) {
        this.renderEntity(
          entity,
          this.core.guiCamera,
          elapsedTimeInSeconds,
          totalTimeInSeconds
        )
      }
    })
  }

  private renderEntity(
    entity: Entity,
    camera: Camera,
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    const { shapes, visible } = entity.get(Renderable)

    if (!visible) {
      return
    }

    for (const shape of shapes) {
      const shaders = this.shapes.get(shape)
      if (!shaders) {
        continue
      }
      shaders.forEach((shader) =>
        shader.render(entity, camera, elapsedTimeInSeconds, totalTimeInSeconds)
      )
    }
  }

  private updateMovedEntities(): void {
    const entities = this.entities as QuadTreeList
    this.movedEntities.forEach((entity) => {
      entities.update(entity)
    })
    this.movedEntities.clear()
  }
}

export default Renderer
