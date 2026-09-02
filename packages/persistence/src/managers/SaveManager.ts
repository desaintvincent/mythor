import {
  Component,
  Constructor,
  Manager,
  getConstructor,
  Serializable,
  isSerializable,
} from '@mythor/core'
import StorageBackend from '../storage/StorageBackend'
import LocalStorageBackend from '../storage/LocalStorageBackend'

interface SerializedComponent {
  type: string
  data: unknown
}

interface SerializedEntity {
  id: string
  components: SerializedComponent[]
}

type ComponentFactory<T extends Component = Component> = (data: unknown) => T

interface SaveManagerOptions {
  backend?: StorageBackend
}

/**
 * Saves/loads ECS state to a `StorageBackend` (`localStorage` by default).
 * Only components implementing `Serializable` are persisted; components
 * that should be restored on load must first be registered via
 * `registerComponent`.
 */
class SaveManager extends Manager {
  private readonly backend: StorageBackend
  private readonly factories = new Map<string, ComponentFactory>()

  public constructor(options?: SaveManagerOptions) {
    super('SaveManager')
    this.backend = options?.backend ?? new LocalStorageBackend()
  }

  public registerComponent<T extends Component & Serializable>(
    constructor: Constructor<T>,
    deserialize: ComponentFactory<T>
  ): void {
    this.factories.set(constructor.name, deserialize as ComponentFactory)
  }

  public async save(slot: string): Promise<void> {
    const entities: SerializedEntity[] = []

    this.ecs.entities.forEach((entity) => {
      const components: SerializedComponent[] = []

      entity.components.forEach((component) => {
        if (!isSerializable(component)) {
          return
        }

        components.push({
          type: getConstructor(component).name,
          data: component.serialize(),
        })
      })

      entities.push({ id: entity._id, components })
    })

    await this.backend.setItem(slot, JSON.stringify(entities))
  }

  public async load(slot: string): Promise<void> {
    const raw = await this.backend.getItem(slot)

    if (raw == null) {
      throw new Error(`No save found for slot "${slot}"`)
    }

    const entities = JSON.parse(raw) as SerializedEntity[]

    this.clearWorld()

    entities.forEach((serializedEntity) => {
      const entity = this.ecs.create(serializedEntity.id)

      serializedEntity.components.forEach((serializedComponent) => {
        const factory = this.factories.get(serializedComponent.type)

        if (!factory) {
          throw new Error(
            `Cannot deserialize component "${serializedComponent.type}": ` +
              'no factory registered, call registerComponent() first'
          )
        }

        entity.add(factory(serializedComponent.data))
      })
    })
  }

  public async listSlots(): Promise<string[]> {
    return await this.backend.keys()
  }

  public async deleteSlot(slot: string): Promise<void> {
    await this.backend.removeItem(slot)
  }

  // Removes every existing entity from the ecs before restoring a save, so
  // loading twice (or loading a save with fewer entities than the current
  // world) doesn't leave stale entities around.
  private clearWorld(): void {
    this.ecs.entities.forEach((entity) => {
      this.ecs.entityCollections.removeEntity(entity)
    })
    this.ecs.entities.clear()
  }
}

export default SaveManager
export type { SaveManagerOptions }
