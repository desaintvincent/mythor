import AssetManager from '../src/managers/AssetManager'
import { loadAudio } from '../src/loaders/audioLoader'
import { loadImage } from '../src/loaders/imageLoader'
import { loadJson } from '../src/loaders/jsonLoader'

class FakeImage {
  public onload: null | (() => void) = null

  public onerror: null | ((event: unknown) => void) = null

  public constructor() {
    Object.defineProperty(this, 'src', {
      set: (value: string) => {
        if (value.includes('fail')) {
          if (this.onerror) {
            this.onerror(new Error('image failed'))
          }

          return
        }

        if (this.onload) {
          this.onload()
        }
      },
    })
  }
}

describe('loaders', () => {
  it('loads image assets', async () => {
    const originalImage = global.Image
    global.Image = FakeImage as unknown as typeof Image

    try {
      const image = await loadImage('image.png')

      expect(image).toBeInstanceOf(FakeImage)
    } finally {
      global.Image = originalImage
    }
  })

  it('loads json assets', async () => {
    const originalFetch = global.fetch
    const mockFetch = (async () => {
      return {
        json: async () => ({ ok: true }),
        ok: true,
      } as unknown as Response
    }) as typeof fetch

    global.fetch = mockFetch

    try {
      await expect(loadJson<{ ok: boolean }>('data.json')).resolves.toEqual({
        ok: true,
      })
    } finally {
      global.fetch = originalFetch
    }
  })

  it('loads audio assets', async () => {
    const originalFetch = global.fetch
    const mockFetch = (async () => {
      return {
        arrayBuffer: async () => new ArrayBuffer(4),
        ok: true,
      } as unknown as Response
    }) as typeof fetch

    global.fetch = mockFetch

    try {
      await expect(loadAudio('audio.wav')).resolves.toBeInstanceOf(ArrayBuffer)
    } finally {
      global.fetch = originalFetch
    }
  })
})

describe('AssetManager', () => {
  it('loads manifest entries and reports progress', async () => {
    const assetManager = new AssetManager()
    const progress: Array<[number, number]> = []

    assetManager.registerLoader('mock', async (src: string) => ({ src }))
    assetManager.onProgress((current, total) => {
      progress.push([current, total])
    })

    await assetManager.load([
      { key: 'first', src: 'one', type: 'mock' },
      { key: 'second', src: 'two', type: 'mock' },
    ])

    expect(assetManager.has('first')).toBe(true)
    expect(assetManager.get<{ src: string }>('second')).toEqual({ src: 'two' })
    expect(progress).toContainEqual([1, 2])
    expect(progress).toContainEqual([2, 2])
  })

  it('integrates with loading state manager', async () => {
    const assetManager = new AssetManager()
    const ecs = {
      manager: jest.fn(),
      managers: {
        has: jest.fn().mockReturnValue(true),
      },
    }

    const createState = jest.fn()
    const getState = jest.fn().mockReturnValue({
      current: 0,
      total: 0,
    })

    ;(ecs.manager as jest.Mock).mockReturnValue({
      createState,
      getState,
    })
    ;(assetManager as unknown as { ecs: unknown }).ecs = ecs
    assetManager.registerLoader('mock', async () => 'value')

    await assetManager.load([{ key: 'asset', src: 'src', type: 'mock' }])

    expect(createState).toHaveBeenCalledWith({
      detail: 'Assets',
      name: 'AssetManager',
      total: 1,
    })
    expect(getState).toHaveBeenCalledWith('AssetManager')
  })

  it('throws when asset is missing', () => {
    const assetManager = new AssetManager()

    expect(() => assetManager.get('missing')).toThrow(
      'Asset "missing" not registered'
    )
  })
})
