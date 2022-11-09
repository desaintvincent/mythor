import {
  Color,
  colorWhite,
  FillRect,
  Renderable,
  Renderer,
} from '@mythor/renderer'
import { LoadingStateManager, Manager, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import SceneManager from '../managers/SceneManager'
import Scene from '../objects/Scene'
import { EventsManager } from '@mythor/events'

interface LoadingOptions {
  color?: Color
  loadingBarWidth?: number
  loadingBarHeight?: number
  loadingBarPosHeight?: number
}

class Loading extends Manager {
  private readonly color: Color
  private readonly loadingBarWidth: number
  private readonly loadingBarHeight: number
  private readonly loadingBarPosHeight: number

  public constructor(options?: LoadingOptions) {
    super('Loading')
    this.color = options?.color ?? colorWhite
    this.loadingBarWidth = options?.loadingBarWidth ?? 0.8
    this.loadingBarHeight = options?.loadingBarHeight ?? 10
    this.loadingBarPosHeight = options?.loadingBarPosHeight ?? 0.7
  }

  public update(): void {
    const isNextReady = SceneManager.getInstance().isNextReady()
    if (isNextReady) {
      this.updateWhenReady()
    } else {
      this.updateWhenNotReady()
    }
  }

  private updateWhenNotReady(): void {
    const loadingManager = this.getNextLoadingManager()

    if (!loadingManager) {
      return
    }

    const percentage = loadingManager.getLoadingPercentage()
    const detail = loadingManager.getLoadingDetail()

    this.renderLoadingBar(percentage, detail)
  }

  private updateWhenReady(): void {
    this.ecs.system(Renderer).disabled(true)
    SceneManager.getInstance().next()
  }

  private getNextLoadingManager(): LoadingStateManager | null {
    const scene = SceneManager.getInstance().getNext()
    if (!scene) {
      return null
    }

    if (!scene.ecs.managers.has(LoadingStateManager)) {
      return null
    }

    return scene.ecs.manager(LoadingStateManager)
  }

  private renderLoadingBar(percentage: number, detail: string): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      const cameraSize = renderer.getCamera().getSize()

      const width = cameraSize.x * this.loadingBarWidth
      const posHeight = cameraSize.y * 0.5 * this.loadingBarPosHeight

      renderer.strokeRect(
        new Vec2(0, posHeight),
        new Vec2(width, this.loadingBarHeight),
        {
          color: this.color,
        }
      )

      const filledWidth = width * percentage * 0.01
      renderer.fillRect(
        new Vec2(0 - (width - filledWidth) / 2, posHeight),
        new Vec2(filledWidth, this.loadingBarHeight),
        {
          color: this.color,
        }
      )

      renderer.text(
        new Vec2(-width / 2, posHeight - this.loadingBarHeight - 20),
        detail ? `Loading: ${detail}` : 'Loading...',
        {
          color: this.color,
        }
      )
    })
  }
}

function createLoadingScene(): Scene {
  return new Scene('CreateLoadingScene', {
    managers: [new EventsManager(), new Loading()],
    onInit: async (ecs) => {
      const cameraSize = ecs.system(Renderer).getCamera().getSize()
      ecs.create().add(
        new Renderable(),
        new FillRect(),
        new Transform({
          position: new Vec2(0, -cameraSize.y * 0.5 * 0.2),
        })
      )
    },
    systems: [new Renderer()],
  })
}

export default createLoadingScene
