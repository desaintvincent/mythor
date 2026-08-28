type UpdateFunction = (
  elapsedTimeInSeconds: number,
  totalTimeInSeconds: number
) => void

// Caps the delta time passed to update() so a slow first frame or a lag
// spike (tab switch, GC pause, entity spawn hitch, ...) can never inject a
// huge dt into systems such as physics. An unclamped dt can make a
// physics world integrate a large velocity/penetration in a single step,
// which the contact solver then corrects violently, causing bodies to
// jitter, slide, or sink into each other for a long time afterwards.
const MAX_ELAPSED_TIME_IN_SECONDS = 1 / 30

export default class GameLoop {
  private _previousTime = 0
  private _started = false
  private _stopped = false
  private _shouldStop = false
  private _paused = false
  private _requestId = 0
  private _onUpdate?: UpdateFunction
  private _onStop?: () => void

  public update(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    this._onUpdate?.(elapsedTimeInSeconds, totalTimeInSeconds)
  }

  public onUpdate(fn: UpdateFunction): void {
    this._onUpdate = fn
  }

  public onStop(fn: () => void): void {
    this._onStop = fn
  }

  private loop(time = 0): void {
    if (this._stopped) {
      return
    }
    if (this._shouldStop) {
      this._stopped = true
      cancelAnimationFrame(this._requestId)
      this._onStop?.()

      return
    }
    if (!this._started) {
      throw new Error('Please call start()')
    }
    const elapsedTimeInSeconds = Math.min(
      (time - this._previousTime) / 1000,
      MAX_ELAPSED_TIME_IN_SECONDS
    )
    this._previousTime = time
    this.update(this._paused ? 0 : elapsedTimeInSeconds, time / 1000)
    this._requestId = requestAnimationFrame(this.loop.bind(this))
  }

  public start(): void {
    if (this._started) {
      throw new Error('You cannot start a GameLoop multiple times')
    }
    this._started = true
    this._paused = false
    this.loop()
  }

  public pause(): void {
    this._paused = !this._paused
  }

  public stop(): void {
    this._shouldStop = true
  }
}
