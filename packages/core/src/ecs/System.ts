import Ecs from './Ecs'
import { Constructor } from '../collections/Signable'
import Entity from './Entity'
import Component from './Component'
import Manager from './Manager'
import IList from '../lists/IList'

interface SystemDependencies {
  systems: Array<Constructor<System>>
  managers: Array<Constructor<Manager>>
  list?: Constructor<IList<Entity>>
}

abstract class System {
  public ecs: Ecs
  private readonly _name: string
  private _disabled = false
  public _duration: number
  protected entities: IList<Entity>
  protected readonly components: Array<Constructor<Component>>
  protected readonly dependencies: SystemDependencies

  protected constructor(
    name: string,
    components: Array<Constructor<Component>>,
    dependencies?: Partial<SystemDependencies>
  ) {
    this._duration = 0
    this._name = name
    this.components = components
    this.dependencies = {
      list: dependencies?.list,
      managers: dependencies?.managers ?? [],
      systems: dependencies?.systems ?? [],
    }
  }

  public disabled(value?: boolean): boolean {
    if (value !== undefined) {
      this._disabled = value
    }

    return this._disabled
  }

  public get name(): string {
    return this._name
  }

  public setDuration(n: number): void {
    this._duration = n
  }

  public get duration(): number {
    return this._duration
  }

  public async init(ecs: Ecs): Promise<void> {
    this.ecs = ecs
    this.checkDependencies()

    if (this.components.length === 0) {
      throw new Error(
        `System "${this.name}" uses 0 component. It should be a manager`
      )
    }

    this.entities = this.ecs.createList(
      {
        constructors: this.components,
        onCreate: this.onEntityCreation.bind(this),
        onDelete: this.onEntityDestruction.bind(this),
        shouldBeAdded: this.shouldBeAdded.bind(this),
      },
      this.dependencies.list
    )

    await this.onSystemInit(ecs)
  }

  public getEntities(): IList<Entity> {
    return this.entities
  }

  public update(
    elapsedTimeInSeconds: number,
    totalTimeInSeconds: number
  ): void {
    this.entities.forEach((entity) => {
      this.onEntityUpdate(entity, elapsedTimeInSeconds, totalTimeInSeconds)
    })
  }

  public clear(): void {
    // do nothing
  }

  private checkDependencies(): void {
    this.dependencies.systems.forEach((systemConstructor) => {
      if (!this.ecs.systems.has(systemConstructor)) {
        throw new Error(`${this.name} is missing system dependencies`)
      }
    })
    this.dependencies.managers.forEach((managerConstructor) => {
      if (!this.ecs.managers.has(managerConstructor)) {
        throw new Error(`${this.name} is missing manager dependencies`)
      }
    })
  }

  protected onEntityUpdate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entity: Entity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    elapsedTimeInSeconds: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    totalTimeInSeconds: number
  ): void {
    // do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async onSystemInit(ecs: Ecs): Promise<void> {
    // do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onEntityDestruction(entity: Entity): void {
    // do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onEntityCreation(entity: Entity): void {
    // do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected shouldBeAdded(entity: Entity): boolean {
    return true
  }
}

export default System
