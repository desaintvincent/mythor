import { LoadingStateManager, log, Manager } from '@mythor/core'
import Texture from '../toRename/Texture'
import Renderer from '../systems/Renderer'

interface LoadTextureOptions {
  log?: boolean
}

export async function loadTexture(
  name: string,
  path: string,
  gl: WebGL2RenderingContext,
  options?: LoadTextureOptions
): Promise<Texture> {
  return await new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const texture = new Texture(img, gl)
      if (options?.log ?? true) {
        log(`Loaded %ctexture%c "${name}"`, 'tomato')
      }
      resolve(texture)
    }

    img.onerror = (err) => reject(err)

    img.src = path
  })
}

class TextureManager extends Manager {
  private readonly imagesToLoad: Map<string, string>
  private readonly textures: Map<string, Texture>
  private readonly loadingName: string = 'Textures'

  public constructor(images: Array<[string, string]> = []) {
    super('TextureManager')
    this.imagesToLoad = new Map<string, string>()
    this.textures = new Map<string, Texture>()
    images.forEach(([name, path]) => this.add(name, path))
  }

  private async loadTexture(
    name: string,
    path: string,
    gl: WebGL2RenderingContext
  ): Promise<Texture> {
    return await loadTexture(name, path, gl).then((texture) => {
      this.imagesToLoad.delete(name)
      this.textures.set(name, texture)

      return texture
    })
  }

  private createLoadingState(textureNumber: number): void {
    if (!this.ecs.managers.has(LoadingStateManager)) {
      return
    }

    this.ecs.manager(LoadingStateManager).createState({
      detail: 'Textures',
      name: this.loadingName,
      total: textureNumber,
    })
  }

  private setLoadingState(current: number): void {
    if (!this.ecs.managers.has(LoadingStateManager)) {
      return
    }
    const state = this.ecs
      .manager(LoadingStateManager)
      .getState(this.loadingName)

    if (!state) {
      return
    }

    state.current = current
  }

  public async init(): Promise<void> {
    let i = 0
    const toLoad = Array.from(this.imagesToLoad)
    const renderer = this.ecs.system(Renderer)
    const gl = renderer.gl
    if (!gl) {
      throw new Error('webgl context should have been initialized')
    }
    this.createLoadingState(toLoad.length)

    return await Promise.all(
      toLoad.map(
        async ([name, path]) =>
          await this.loadTexture(name, path, gl).then(() => {
            this.setLoadingState(++i)
          })
      )
    ).then(() => {
      this.setLoadingState(toLoad.length)
    })
  }

  public add(name: string, path: string): void {
    this.imagesToLoad.set(name, path)
  }

  public has(name: string): boolean {
    return this.textures.has(name)
  }

  public get(name: string): Texture {
    const texture = this.textures.get(name)

    if (!texture) {
      throw new Error(`Texture "${name}" not registered`)
    }

    return texture
  }
}

export default TextureManager
