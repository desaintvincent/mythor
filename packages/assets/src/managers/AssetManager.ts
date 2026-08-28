import { Ecs, LoadingStateManager, Manager } from '@mythor/core'

import { loadAudio } from '../loaders/audioLoader'
import { loadImage } from '../loaders/imageLoader'
import { loadJson } from '../loaders/jsonLoader'
import type {
  AssetLoader,
  AssetManifestEntry,
  AssetProgressCallback,
} from '../types'

class AssetManager extends Manager {
  private readonly assets: Map<string, unknown>

  private readonly loaders: Map<string, AssetLoader>

  private readonly progressCallbacks: Set<AssetProgressCallback>

  public constructor() {
    super('AssetManager')
    this.assets = new Map<string, unknown>()
    this.loaders = new Map<string, AssetLoader>()
    this.progressCallbacks = new Set<AssetProgressCallback>()

    this.registerLoader('image', loadImage)
    this.registerLoader('json', loadJson)
    this.registerLoader('audio', loadAudio)
  }

  public async init(ecs: Ecs): Promise<void> {
    await super.init(ecs)
  }

  public registerLoader<T>(type: string, loader: AssetLoader<T>): void {
    this.loaders.set(type, loader)
  }

  public onProgress(callback: AssetProgressCallback): void {
    this.progressCallbacks.add(callback)
  }

  public has(name: string): boolean {
    return this.assets.has(name)
  }

  public get<T>(name: string): T {
    const asset = this.assets.get(name)

    if (asset === undefined) {
      throw new Error(`Asset "${name}" not registered`)
    }

    return asset as T
  }

  public async load(
    manifest: ReadonlyArray<AssetManifestEntry>
  ): Promise<void> {
    const total = manifest.length

    this.createLoadingState(total)

    if (total === 0) {
      this.notifyProgress(0, 0)

      return
    }

    let loaded = 0

    await Promise.all(
      manifest.map(async (entry) => {
        const loader = this.loaders.get(entry.type)

        if (!loader) {
          throw new Error(`No asset loader registered for type "${entry.type}"`)
        }

        const asset = await loader(entry.src)

        this.assets.set(entry.key, asset)

        loaded += 1
        this.setLoadingState(loaded, total)
        this.notifyProgress(loaded, total)
      })
    )

    this.setLoadingState(total, total)
    this.notifyProgress(total, total)
  }

  private createLoadingState(total: number): void {
    if (!this.ecs || !this.ecs.managers.has(LoadingStateManager)) {
      return
    }

    this.ecs.manager(LoadingStateManager).createState({
      detail: 'Assets',
      name: this.name,
      total,
    })
  }

  private setLoadingState(current: number, total: number): void {
    if (!this.ecs || !this.ecs.managers.has(LoadingStateManager)) {
      return
    }

    const state = this.ecs.manager(LoadingStateManager).getState(this.name)

    if (!state) {
      return
    }

    state.current = current
    state.total = total
  }

  private notifyProgress(current: number, total: number): void {
    for (const callback of this.progressCallbacks) {
      callback(current, total)
    }
  }
}

export default AssetManager
