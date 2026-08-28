import GameLoop from '../src/objects/GameLoop'

describe('GameLoop', () => {
  let rafCallbacks: Array<(time: number) => void>
  let rafSpy: jest.Mock
  let cafSpy: jest.Mock
  const originalRaf = global.requestAnimationFrame
  const originalCaf = global.cancelAnimationFrame

  beforeEach(() => {
    rafCallbacks = []
    rafSpy = jest.fn((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)

      return rafCallbacks.length
    })
    cafSpy = jest.fn()
    global.requestAnimationFrame =
      rafSpy as unknown as typeof requestAnimationFrame
    global.cancelAnimationFrame =
      cafSpy as unknown as typeof cancelAnimationFrame
  })

  afterEach(() => {
    global.requestAnimationFrame = originalRaf
    global.cancelAnimationFrame = originalCaf
  })

  const tick = (time: number): void => {
    const cb = rafCallbacks.shift()
    cb?.(time)
  }

  it('start() schedules the first frame via requestAnimationFrame', () => {
    const loop = new GameLoop()
    loop.start()

    expect(rafSpy).toHaveBeenCalledTimes(1)
  })

  it('throws when start() is called twice', () => {
    const loop = new GameLoop()
    loop.start()

    expect(() => loop.start()).toThrow(
      'You cannot start a GameLoop multiple times'
    )
  })

  it('calls onUpdate with elapsed and total time derived from successive frames', () => {
    const loop = new GameLoop()
    const updates: Array<[number, number]> = []
    loop.onUpdate((elapsed, total) => updates.push([elapsed, total]))

    loop.start()
    tick(1000)
    tick(1500)

    expect(updates).toEqual([
      [0, 0],
      [1, 1],
      [0.5, 1.5],
    ])
  })

  it('pause() zeroes out the elapsed time for the paused tick', () => {
    const loop = new GameLoop()
    const updates: Array<[number, number]> = []
    loop.onUpdate((elapsed, total) => updates.push([elapsed, total]))

    loop.start()
    loop.pause()
    tick(1000)

    expect(updates).toEqual([
      [0, 0],
      [0, 1],
    ])
  })

  it('stop() cancels the next frame and fires onStop', () => {
    const loop = new GameLoop()
    const onStop = jest.fn()
    loop.onStop(onStop)

    loop.start()
    tick(0)
    loop.stop()
    tick(1000)

    expect(cafSpy).toHaveBeenCalled()
    expect(onStop).toHaveBeenCalledTimes(1)
  })

  it('throws "Please call start()" when the internal loop runs before start()', () => {
    const loop = new GameLoop()

    expect(() => loop['loop']()).toThrow('Please call start()')
  })
})
