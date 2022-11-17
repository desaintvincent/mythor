import Ecs from './Ecs'
import Signable from '../collections/Signable'

class Manager extends Signable {
  private readonly _name: string
  protected readonly ecs: Ecs

  public constructor(name: string) {
    super()
    this._name = name
  }

  public get name(): string {
    return this._name
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async init(ecs: Ecs): Promise<void> {
    // do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public postUpdate(ecs: Ecs): void {
    // do nothing
  }
  public update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ecs: Ecs,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalTimeInSeconds: number
  ): void {
    // do nothing
  }
  public clear(): void {
    // do nothing
  }
}

export default Manager
