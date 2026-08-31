import { Rect, Vec2 } from '@mythor/math'
import Camera from '../objects/Camera'
import PostProcessPipeline from '../postprocessing/PostProcessPipeline'
import type PostProcessEffect from '../postprocessing/PostProcessEffect'

interface RendererOptions {
  antialias: boolean
  alpha: boolean
}

export type RendererParams = Partial<RendererOptions> & {
  camera?: Camera
  canvasName?: string
  initDefaultShaders?: boolean
  useTree?: boolean
  postProcessing?: PostProcessEffect[]
}

const defaultParams = {
  alpha: false,
  antialias: false,
  canvasName: 'canvas',
}

class RendererCore {
  public readonly gl: WebGL2RenderingContext
  public readonly camera: Camera
  public readonly guiCamera: Camera
  private readonly postProcessPipeline: PostProcessPipeline | null
  private isInFrame = false

  public constructor(params?: RendererParams) {
    const canvas = document.getElementById(
      params?.canvasName ?? defaultParams.canvasName
    )

    if (!canvas) {
      throw new Error('Could not find canvas')
    }

    const options: RendererOptions = {
      alpha: params?.alpha ?? defaultParams.alpha,
      antialias: params?.antialias ?? defaultParams.antialias,
    }

    const htmlCanvas = canvas as HTMLCanvasElement
    htmlCanvas.tabIndex = 1
    htmlCanvas.focus()

    const gl = htmlCanvas.getContext('webgl2', options)
    if (!gl) {
      throw new Error('Could not create GL context')
    }

    this.gl = gl as WebGL2RenderingContext
    this.camera = params?.camera ?? new Camera()
    htmlCanvas.width = this.camera.getSize().x
    htmlCanvas.height = this.camera.getSize().y
    this.guiCamera = new Camera(this.camera.getSize())
    // Make the GUI camera use top-left screen-pixel coordinates instead of
    // the world camera's center-relative convention, so a screen-space
    // entity's `Transform.position` directly matches both what's drawn on
    // screen and the raw (non-world-converted) `EventsManager.mousePosition`
    // used for UI hit-testing (see `@mythor/ui`).
    this.guiCamera.lookat(Vec2.times(this.camera.getSize(), 0.5))

    if (params?.postProcessing && params.postProcessing.length > 0) {
      this.postProcessPipeline = new PostProcessPipeline(
        this.gl,
        params.postProcessing
      )
    } else {
      this.postProcessPipeline = null
    }
  }

  public beginFrame(): void {
    this.isInFrame = true
  }

  public endFrame(): void {
    this.isInFrame = false
  }

  public clear(): void {
    if (
      this.postProcessPipeline &&
      this.postProcessPipeline.hasEnabledEffects()
    ) {
      this.postProcessPipeline.getEntryTarget(this.camera.getSize()).bind()
    } else {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      this.gl.viewport(0, 0, this.camera.getSize().x, this.camera.getSize().y)
    }

    this.gl.enable(this.gl.BLEND)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  public prepareGuiPass(): void {
    const size = this.camera.getSize()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, size.x, size.y)
  }

  public renderPostProcessing(): void {
    if (
      !this.postProcessPipeline ||
      !this.postProcessPipeline.hasEnabledEffects()
    ) {
      return
    }

    this.postProcessPipeline.render(this.camera.getSize())
  }

  public assertIsInFrame(): void {
    if (!this.isInFrame) {
      throw new Error(
        'Render call should be in a drawing frame. Maybe you should use onDraw ?'
      )
    }
  }

  public get fov(): Rect {
    const position = this.camera.getPosition()
    const size = Vec2.times(this.camera.getSize(), 1 / this.camera.scale)

    return {
      position,
      size,
    }
  }
}

export default RendererCore
