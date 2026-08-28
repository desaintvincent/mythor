import { Vec2 } from '@mythor/math'
import RenderTarget from './RenderTarget'
import PostProcessEffect from './PostProcessEffect'

class PostProcessPipeline {
  private readonly gl: WebGL2RenderingContext
  private readonly effects: PostProcessEffect[]
  private targets: [RenderTarget, RenderTarget] | null = null
  private size: Vec2 | null = null

  public constructor(gl: WebGL2RenderingContext, effects: PostProcessEffect[]) {
    this.gl = gl
    this.effects = effects
    effects.forEach((effect) => effect.init(gl))
  }

  private ensureTargets(size: Vec2): void {
    if (
      this.targets &&
      this.size &&
      this.size.x === size.x &&
      this.size.y === size.y
    ) {
      return
    }

    this.size = size
    this.targets = [
      new RenderTarget(this.gl, size),
      new RenderTarget(this.gl, size),
    ]
  }

  public getEntryTarget(size: Vec2): RenderTarget {
    this.ensureTargets(size)

    return (this.targets as [RenderTarget, RenderTarget])[0]
  }

  public hasEnabledEffects(): boolean {
    return this.effects.some((effect) => effect.enabled)
  }

  public render(size: Vec2): void {
    this.ensureTargets(size)
    const [targetA, targetB] = this.targets as [RenderTarget, RenderTarget]

    const enabledEffects = this.effects.filter((effect) => effect.enabled)

    let readTexture = targetA.texture
    let readTarget: RenderTarget = targetA
    let writeTarget: RenderTarget = targetB

    enabledEffects.forEach((effect, index) => {
      const isLast = index === enabledEffects.length - 1
      const destination = isLast ? null : writeTarget

      effect.apply(readTexture, destination, size)

      if (!isLast) {
        readTexture = writeTarget.texture
        const previousReadTarget = readTarget
        readTarget = writeTarget
        writeTarget = previousReadTarget
      }
    })
  }
}

export default PostProcessPipeline
