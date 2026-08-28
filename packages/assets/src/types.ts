export interface AssetManifestEntry {
  key: string
  type: string
  src: string
}

export type AssetLoader<T = unknown> = (src: string) => Promise<T>

export type AssetProgressCallback = (current: number, total: number) => void
