import GameLoop from './GameLoop'
import Scene from './Scene'
import SceneManager from '../managers/SceneManager'

class Game {
  private readonly sceneManager: SceneManager
  private readonly _gameloop: GameLoop

  public constructor(...scenes: Scene[]) {
    this.sceneManager = new SceneManager()
    this._gameloop = new GameLoop()

    scenes.forEach(this.addScene.bind(this))

    this._gameloop.onUpdate(this.onUpdate.bind(this))
  }

  public get gameloop(): GameLoop {
    return this._gameloop
  }

  public addScene(scene: Scene): Game {
    this.sceneManager.push(scene)

    return this
  }

  private onUpdate(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    const scene = this.sceneManager.getFirst()
    if (scene) {
      scene.update(elapsedTimeInSeconds, totalTimeInSeconds)
    }
  }

  public start(): Game {
    this._gameloop.start()

    return this
  }
}

export default Game
