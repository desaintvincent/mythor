import { Vec2 } from '@mythor/math'
import type Renderer from './Renderer'
import RendererCore from './RendererCore'
import ShaderRegistry from './ShaderRegistry'
import Color, { colorWhite } from '../color/Color'
import type {
  CircleOptions,
  FillPolyOptions,
  LineOptions,
  StrokePolyOptions,
} from './ShaderOptions'
import FillRect from '../webgl/shaders/FillRect'
import Lines from '../webgl/shaders/Lines'
import Circle from '../webgl/shaders/Circle'
import FillTriangle from '../webgl/shaders/FillTriangle'
import Text from '../webgl/shaders/Text'

type FnToDraw = (renderer: Renderer) => void

class DrawAPI {
  private readonly toDraw: FnToDraw[] = []
  private readonly toDrawGui: FnToDraw[] = []

  public constructor(
    private readonly renderer: Renderer,
    private readonly core: RendererCore,
    private readonly shaderRegistry: ShaderRegistry
  ) {}

  public onDraw(fn: FnToDraw): void {
    this.toDraw.push(fn)
  }

  public onDrawGui(fn: FnToDraw): void {
    this.toDrawGui.push(fn)
  }

  public applyDrawingFunctions(): void {
    while (this.toDraw.length > 0) {
      const functionToDraw = this.toDraw.shift()
      if (!functionToDraw) {
        return
      }
      functionToDraw(this.renderer)
    }
  }

  public applyGuiDrawingFunctions(): void {
    while (this.toDrawGui.length > 0) {
      const functionToDraw = this.toDrawGui.shift()
      if (!functionToDraw) {
        return
      }
      functionToDraw(this.renderer)
    }
  }

  public fillRect(
    position: Vec2,
    size: Vec2,
    options?: Partial<FillPolyOptions> & { radius?: number }
  ): void {
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(FillRect)
    shader?.rect(position, size, {
      color: options?.color ?? colorWhite,
      radius: options?.radius ?? 0,
      rotation: options?.rotation ?? 0,
    })
  }

  public strokeRect(
    position: Vec2,
    size: Vec2,
    options?: Partial<StrokePolyOptions>
  ): void {
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(Lines)
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
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(Circle)
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
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(Circle)
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
    return this.shaderRegistry.get(Text)?.lineHeight() ?? 0
  }

  public text(
    position: Vec2,
    text: string,
    params?: { color?: Color; size?: number }
  ): void {
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(Text)
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
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(Lines)
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
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(Lines)
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
    this.core.assertIsInFrame()
    const shader = this.shaderRegistry.get(FillTriangle)
    if (!shader) {
      return
    }

    shader.fillPoly(position, points, {
      color: options?.color ?? colorWhite,
      rotation: options?.rotation ?? 0,
    })
  }
}

export default DrawAPI
