import {
  Component,
  Constructor,
  ConstructorMap,
  Entity,
  System,
  Transform,
} from '@mythor/core'
import Camera from '../toRename/Camera'
import { Rect, Vec2 } from '@mythor/math'
import QuadTreeList from '../quadTree/QuadTreeList'
import {
  CircleOptions,
  FillPolyOptions,
  LineOptions,
  StrokePolyOptions,
} from './ShaderOptions'
import Color, { colorWhite } from '../color/Color'
import Shader from '../webgl/shaders/Shader'
import FillTriangle from '../webgl/shaders/FillTriangle'
import Renderable from '../components/Renderable'
import Ecs from '@mythor/core/lib/ecs/Ecs'
import ParticlesUpdate from '../webgl/shaders/ParticlesUpdate'
import ParticlesRender from '../webgl/shaders/ParticlesRender'
import Lines from '../webgl/shaders/Lines'
import Sprite from '../webgl/shaders/Sprite'
import FillRect from '../webgl/shaders/FillRect'
import Circle from '../webgl/shaders/Circle'
import Text from '../webgl/shaders/Text'

interface RendererOptions {
  antialias: boolean
  alpha: boolean
}

type RendererParams = Partial<RendererOptions> & {
  camera?: Camera
  canvasName?: string
  useTree?: boolean
}

type FnToDraw = (renderer: Renderer) => void

const defaultParams = {
  alpha: false,
  antialias: false,
  canvasName: 'canvas',
  useTree: false,
}

class Renderer extends System {
  private readonly opts: RendererOptions
  private readonly camera: Camera
  private readonly _shaders: ConstructorMap<Shader>
  private readonly toDraw: FnToDraw[] = []
  private isInFrame = false
  public readonly shapes: Map<Constructor<Component>, Shader[]> = new Map()
  private readonly movedEntities: Map<string, Entity> = new Map<
    string,
    Entity
  >()
  public useTree: boolean
  private readonly canvas: HTMLCanvasElement
  public readonly gl: WebGL2RenderingContext

  public constructor(params?: RendererParams) {
    super('Renderer', [Renderable, Transform], {
      list: QuadTreeList,
    })
    this.opts = {
      alpha: params?.alpha ?? defaultParams.alpha,
      antialias: params?.antialias ?? defaultParams.antialias,
    }
    const canvas = document.getElementById(
      params?.canvasName ?? defaultParams.canvasName
    )
    if (!canvas) {
      throw new Error('Could not find canvas')
    }
    this.canvas = canvas as HTMLCanvasElement
    this.canvas.tabIndex = 1
    this.useTree = params?.useTree ?? defaultParams.useTree
    this.canvas.focus()
    const gl = this.canvas.getContext('webgl2', this.opts)
    if (!gl) {
      throw new Error('Could not create GL context')
    }
    this.gl = gl as WebGL2RenderingContext

    this.camera = params?.camera ?? new Camera()
    this._shaders = new ConstructorMap()
  }

  public update(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    this.clear()
    this.isInFrame = true
    this.camera.update(elapsedTimeInSeconds)
    this.updateMovedEntities()

    this._shaders.forEach((shader) => shader.preRender(this.camera))

    const cb = (entity: Entity): void => {
      this.onEntityUpdate(entity, elapsedTimeInSeconds, totalTimeInSeconds)
    }

    if (this.useTree) {
      (this.entities as QuadTreeList).searchForEach(this.fov, cb)
    } else {
      (this.entities as QuadTreeList).naiveSearchForeach(this.fov, cb)
    }

    this.applyDrawingFunctions()

    this._shaders.forEach((shader) =>
      shader.postRender(this.camera, elapsedTimeInSeconds, totalTimeInSeconds)
    )
    this.isInFrame = false
  }

  public get fov(): Rect {
    const position = this.camera.getPosition()
    const size = Vec2.times(this.camera.getSize(), 1 / this.camera.scale)

    return {
      position,
      size,
    }
  }

  public setTree(rect: Rect): void {
    this.useTree = true
    ;(this.entities as QuadTreeList).resize(rect)
  }

  protected onEntityUpdate(
    entity: Entity,
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
        shader.render(
          entity,
          this.camera,
          elapsedTimeInSeconds,
          totalTimeInSeconds
        )
      )
    }
  }

  protected async onSystemInit(): Promise<void> {
    await this.addShader(new Sprite(this.gl))
    await this.addShader(new FillTriangle(this.gl))
    await this.addShader(new Lines(this.gl))
    await this.addShader(new FillRect(this.gl))
    await this.addShader(new Circle(this.gl))
    await this.addShader(new Text(this.gl))
    await this.addShader(new ParticlesUpdate(this.gl))
    await this.addShader(new ParticlesRender(this.gl))
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

  private onEntityChange(entity: Entity): void {
    this.movedEntities.set(entity._id, entity)
  }

  private updateMovedEntities(): void {
    this.movedEntities.forEach((entity) => {
      (this.entities as QuadTreeList).update(entity)
    })
    this.movedEntities.clear()
  }

  public async addShader(shader: Shader): Promise<void> {
    await shader.init(this)
    if (shader.component) {
      const shaders = this.shapes.get(shader.component)
      if (shaders) {
        shaders.push(shader)
      } else {
        this.shapes.set(shader.component, [shader])
      }
    }
    this._shaders.set(shader)
  }

  public getCamera(): Camera {
    return this.camera
  }

  public onDraw(fn: FnToDraw): void {
    this.toDraw.push(fn)
  }

  public clear(): void {
    this.gl.enable(this.gl.BLEND)
    this.gl.viewport(0, 0, this.camera.getSize().x, this.camera.getSize().y)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  private assertIsInFrame(): void {
    if (!this.isInFrame) {
      throw new Error(
        'Render call should be in a drawing frame. Maybe you should use onDraw ?'
      )
    }
  }

  public fillRect(
    position: Vec2,
    size: Vec2,
    options?: Partial<FillPolyOptions>
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(FillRect)
    shader?.rect(position, size, {
      color: options?.color ?? colorWhite,
      rotation: options?.rotation ?? 0,
    })
  }

  public strokeRect(
    position: Vec2,
    size: Vec2,
    options?: Partial<StrokePolyOptions>
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(Lines)
    shader?.rect(position, size, {
      color: options?.color ?? colorWhite,
      diagonal: options?.diagonal ?? false,
      rotation: options?.rotation ?? 0,
      width: options?.width ?? 1,
    })
  }

  public fillCircle(
    position: Vec2,
    size: Vec2 | number,
    options?: Omit<Partial<CircleOptions>, 'fill'>
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(Circle)
    shader?.circle(
      position,
      typeof size === 'number' ? Vec2.create(size, size) : size,
      {
        color: options?.color ?? colorWhite,
        fill: true,
        rotation: options?.rotation ?? 0,
        width: options?.width ?? 1,
      }
    )
  }

  public strokeCircle(
    position: Vec2,
    size: Vec2 | number,
    options?: Omit<Partial<CircleOptions>, 'fill'> & { diagonal?: boolean }
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(Circle)
    const vSize = typeof size === 'number' ? Vec2.create(size, size) : size
    shader?.circle(position, vSize, {
      color: options?.color ?? colorWhite,
      fill: false,
      rotation: options?.rotation ?? 0,
      width: options?.width ?? 1,
    })

    if (options?.diagonal) {
      this.line(
        position,
        position.add(
          Vec2.create(
            Math.cos(options.rotation ?? 0) * vSize.x * 0.5,
            Math.sin(options.rotation ?? 0) * vSize.x * 0.5
          )
        ),
        {
          color: options?.color ?? colorWhite,
          width: options?.width ?? 1,
        }
      )
    }
  }

  public lineHeight(): number {
    return this._shaders.get(Text)?.lineHeight() ?? 0
  }

  public text(
    position: Vec2,
    text: string,
    params?: { color?: Color; size?: number }
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(Text)
    shader?.text(position, text, {
      color: params?.color ?? colorWhite,
      size: params?.size ?? 1,
    })
  }

  public line(
    positionStart: Vec2,
    positionEnd: Vec2,
    options?: Partial<LineOptions>
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(Lines)
    shader?.line(positionStart, positionEnd, {
      color: options?.color ?? colorWhite,
      width: options?.width ?? 1,
    })
  }

  public strokePoly(
    position: Vec2,
    points: Vec2[],
    options?: Partial<StrokePolyOptions>
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(Lines)
    shader?.poly(position, points, {
      color: options?.color ?? colorWhite,
      diagonal: options?.diagonal ?? false,
      rotation: options?.rotation ?? 0,
      width: options?.width ?? 1,
    })
  }

  public fillPoly(
    position: Vec2,
    points: Vec2[],
    options?: Partial<FillPolyOptions>
  ): void {
    this.assertIsInFrame()
    const shader = this._shaders.get(FillTriangle)
    if (!shader) {
      return
    }

    shader.fillPoly(position, points, {
      color: options?.color ?? colorWhite,
      rotation: options?.rotation ?? 0,
    })
  }

  private applyDrawingFunctions(): void {
    while (this.toDraw.length > 0) {
      const functionToDraw = this.toDraw.shift()
      if (!functionToDraw) {
        return
      }
      functionToDraw(this)
    }
  }
}

export default Renderer
