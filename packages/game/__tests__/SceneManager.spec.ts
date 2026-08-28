import SceneManager from '../src/managers/SceneManager'
import Scene from '../src/objects/Scene'

const makeScene = (name: string): Scene => new Scene(name)

describe('SceneManager', () => {
  it('getInstance()/constructor return the same singleton instance', () => {
    const a = new SceneManager()
    const b = SceneManager.getInstance()

    expect(a).toBe(b)
  })

  it('pushOne() starts the first scene pushed onto an empty stack', () => {
    const manager = SceneManager.getInstance()
    const scene = makeScene('first')
    const startSpy = jest.spyOn(scene, 'start')

    manager.pushOne(scene)

    expect(startSpy).toHaveBeenCalledTimes(1)
    expect(manager.getFirst()).toBe(scene)
  })

  it('push() does not (re)start subsequent scenes', () => {
    const manager = SceneManager.getInstance()
    const second = makeScene('second')
    const startSpy = jest.spyOn(second, 'start')

    manager.push(second)

    expect(startSpy).not.toHaveBeenCalled()
    expect(manager.getNext()).toBe(second)
    expect(manager.isNextReady()).toBe(false)
  })

  it('isEmpty() reflects the stack state', () => {
    const manager = SceneManager.getInstance()

    expect(manager.isEmpty()).toBe(false)
  })

  it('next() stops the current scene, shifts the stack and starts the new first scene', () => {
    const manager = SceneManager.getInstance()
    const current = manager.getFirst() as Scene
    const upcoming = manager.getNext() as Scene
    const stopSpy = jest.spyOn(current, 'stop')
    const startSpy = jest.spyOn(upcoming, 'start')

    manager.next()

    expect(stopSpy).toHaveBeenCalledTimes(1)
    expect(startSpy).toHaveBeenCalledTimes(1)
    expect(manager.getFirst()).toBe(upcoming)
  })

  describe('swap()', () => {
    it('swaps two scenes and restarts when swapping into the first slot', () => {
      const manager = new SceneManager()
      const third = makeScene('third')
      manager.push(third)

      const first = manager.getFirst() as Scene
      const next = manager.getNext() as Scene
      const stopSpy = jest.spyOn(first, 'stop')
      const startSpy = jest.spyOn(next, 'start')

      manager.swap(0, 1)

      expect(manager.getFirst()).toBe(next)
      expect(manager.getNext()).toBe(first)
      expect(stopSpy).toHaveBeenCalledTimes(1)
      expect(startSpy).toHaveBeenCalledTimes(1)
    })

    it('warns and no-ops when first >= second', () => {
      const manager = new SceneManager()
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        // do nothing
      })
      const before = manager.stack

      manager.swap(1, 0)

      expect(warnSpy).toHaveBeenCalledWith(
        'SceneManager.swap: cannot swap with itself'
      )
      expect(manager.stack).toEqual(before)
      warnSpy.mockRestore()
    })

    it('warns and no-ops when one of the scenes does not exist', () => {
      const manager = new SceneManager()
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        // do nothing
      })
      const before = manager.stack

      manager.swap(0, 99)

      expect(warnSpy).toHaveBeenCalledWith(
        'SceneManager.swap: cannot swap with non existing scenes'
      )
      expect(manager.stack).toEqual(before)
      warnSpy.mockRestore()
    })
  })
})
