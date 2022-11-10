import Scene from '../objects/Scene'
import { log } from '@mythor/core'

class SceneManager {
  private static instance?: SceneManager
  private readonly _stack: Scene[] = []
  // start is shown

  public constructor() {
    if (SceneManager.instance) {
      return SceneManager.instance
    }
    SceneManager.instance = this
  }

  public get stack(): Scene[] {
    const copy = [...this._stack]
    Object.freeze(copy)

    return copy
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      return new SceneManager()
    }

    return SceneManager.instance
  }

  public push(...scenes: Scene[]): SceneManager {
    scenes.forEach((scene) => {
      this.pushOne(scene)
    })

    return this
  }

  public swap(first = 0, second = 1): SceneManager {
    if (first >= second) {
      log('Cannot swap with itself')

      return this
    }

    if (!this._stack[second] || !this._stack[first]) {
      log('Cannot swap with non existing scenes')

      return this
    }

    const tmp = this._stack[second]
    this._stack[second] = this._stack[first]
    this._stack[first] = tmp

    if (first === 0) {
      this._stack[second].stop()
      this._stack[first].start()
    }

    return this
  }

  public pushOne(scene: Scene): SceneManager {
    if (this.isEmpty()) {
      scene.start()
    }
    this._stack.push(scene)

    return this
  }

  public isEmpty(): boolean {
    return this._stack.length <= 0
  }

  public getFirst(): Scene | null {
    if (!this._stack.length) {
      return null
    }

    return this._stack[0]
  }

  public getNext(): Scene | undefined {
    if (this._stack.length > 1) {
      return this._stack[1]
    }
  }

  public isNextReady(): boolean {
    const scene = this.getNext()
    if (!scene) {
      return false
    }

    return scene.isReady()
  }

  public next(): SceneManager {
    this.getFirst()?.stop()
    this._stack.shift()
    this.getFirst()?.start()

    return this
  }
}

export default SceneManager
