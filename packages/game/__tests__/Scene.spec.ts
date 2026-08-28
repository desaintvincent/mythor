import Scene from '../src/objects/Scene'

const flush = (): Promise<void> =>
  new Promise((resolve) => setImmediate(resolve))

describe('Scene', () => {
  it('is not ready until onInit resolves, then becomes ready and calls onLoaded', async () => {
    const calls: string[] = []
    const scene = new Scene('test', {
      onInit: async () => {
        calls.push('onInit')
      },
      onLoaded: async () => {
        calls.push('onLoaded')
      },
    })

    expect(scene.isReady()).toBe(false)

    await flush()
    await flush()
    await flush()

    expect(scene.isReady()).toBe(true)
    expect(calls).toEqual(['onInit', 'onLoaded'])
  })

  it('update() is a no-op before the scene is ready', () => {
    const scene = new Scene('not-ready')
    scene.start()

    expect(() => scene.update(1, 1)).not.toThrow()
  })

  it('update() is a no-op when the scene is ready but not running', async () => {
    const scene = new Scene('ready-not-running')
    await flush()
    await flush()
    await flush()

    expect(scene.isReady()).toBe(true)
    expect(() => scene.update(1, 1)).not.toThrow()
  })

  it('start()/stop() gate whether update() actually runs the ecs', async () => {
    const scene = new Scene('gated')
    await flush()
    await flush()
    await flush()

    const updateSpy = jest.spyOn(scene.ecs, 'update')

    scene.update(1, 1)
    expect(updateSpy).not.toHaveBeenCalled()

    scene.start()
    scene.update(1, 1)
    expect(updateSpy).toHaveBeenCalledWith(1, 1)

    scene.stop()
    updateSpy.mockClear()
    scene.update(1, 1)
    expect(updateSpy).not.toHaveBeenCalled()
  })
})
