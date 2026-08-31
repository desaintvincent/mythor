import type { IEcs } from './IEcs'
import Signable from '../collections/Signable'

class Manager extends Signable {
  private readonly _name: string
  protected ecs!: IEcs

  public constructor(name: string) {
    super()
    this._name = name
  }

  public get name(): string {
    return this._name
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async init(ecs: IEcs): Promise<void> {
    this.ecs = ecs
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public postUpdate(ecs: IEcs): void {
    // do nothing
  }
  public update(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ecs: IEcs,
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
