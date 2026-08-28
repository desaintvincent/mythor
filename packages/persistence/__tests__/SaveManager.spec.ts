import { Component, Ecs } from '@mythor/core'
import SaveManager from '../src/managers/SaveManager'
import Serializable from '../src/Serializable'
import StorageBackend from '../src/storage/StorageBackend'

interface CoinsData {
  amount: number
}

class Coins extends Component implements Serializable<CoinsData> {
  public amount: number

  public constructor(amount = 0) {
    super()
    this.amount = amount
  }

  public serialize(): CoinsData {
    return { amount: this.amount }
  }
}

// Deliberately not Serializable, to verify it is skipped on save.
class Transient extends Component {
  public value = 42
}

class InMemoryStorageBackend implements StorageBackend {
  private readonly store = new Map<string, string>()

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  public removeItem(key: string): void {
    this.store.delete(key)
  }

  public keys(): string[] {
    return Array.from(this.store.keys())
  }
}

async function createInitializedSaveManager(
  ecs: Ecs,
  backend: StorageBackend
): Promise<SaveManager> {
  const saveManager = new SaveManager({ backend })
  ecs.registerManagers(saveManager)
  await ecs.init()

  return saveManager
}

describe('SaveManager', () => {
  it('round-trips a serializable component through save/load', async () => {
    const ecs = new Ecs()
    const backend = new InMemoryStorageBackend()
    const saveManager = await createInitializedSaveManager(ecs, backend)
    saveManager.registerComponent(
      Coins,
      (data) => new Coins((data as CoinsData).amount)
    )

    const entity = ecs.create('entity-1')
    entity.add(new Coins(7))

    await saveManager.save('slot1')

    const loadEcs = new Ecs()
    const loadSaveManager = await createInitializedSaveManager(loadEcs, backend)
    loadSaveManager.registerComponent(
      Coins,
      (data) => new Coins((data as CoinsData).amount)
    )

    await loadSaveManager.load('slot1')

    const loadedEntity = loadEcs.entity('entity-1')
    expect(loadedEntity).toBeDefined()
    expect(loadedEntity?.get(Coins).amount).toBe(7)
  })

  it('skips components that do not implement Serializable', async () => {
    const ecs = new Ecs()
    const backend = new InMemoryStorageBackend()
    const saveManager = await createInitializedSaveManager(ecs, backend)
    saveManager.registerComponent(
      Coins,
      (data) => new Coins((data as CoinsData).amount)
    )

    const entity = ecs.create('entity-1')
    entity.add(new Coins(3), new Transient())

    await saveManager.save('slot1')

    const raw = backend.getItem('slot1')
    expect(raw).not.toBeNull()
    expect(raw).not.toContain('Transient')
  })

  it('throws when loading a component with no registered factory', async () => {
    const ecs = new Ecs()
    const backend = new InMemoryStorageBackend()
    const saveManager = await createInitializedSaveManager(ecs, backend)
    saveManager.registerComponent(
      Coins,
      (data) => new Coins((data as CoinsData).amount)
    )

    const entity = ecs.create('entity-1')
    entity.add(new Coins(1))
    await saveManager.save('slot1')

    const loadEcs = new Ecs()
    const loadSaveManager = await createInitializedSaveManager(loadEcs, backend)
    // Coins factory intentionally not registered on this SaveManager.

    await expect(loadSaveManager.load('slot1')).rejects.toThrow(
      'no factory registered'
    )
  })

  it('throws when loading a slot that does not exist', async () => {
    const ecs = new Ecs()
    const backend = new InMemoryStorageBackend()
    const saveManager = await createInitializedSaveManager(ecs, backend)

    await expect(saveManager.load('missing-slot')).rejects.toThrow(
      'No save found for slot'
    )
  })

  it('lists and deletes slots', async () => {
    const ecs = new Ecs()
    const backend = new InMemoryStorageBackend()
    const saveManager = await createInitializedSaveManager(ecs, backend)
    ecs.create('entity-1')

    await saveManager.save('slot1')
    await saveManager.save('slot2')

    expect(await saveManager.listSlots()).toEqual(
      expect.arrayContaining(['slot1', 'slot2'])
    )

    await saveManager.deleteSlot('slot1')

    expect(await saveManager.listSlots()).toEqual(['slot2'])
  })

  it('clears stale entities not present in the loaded save', async () => {
    const ecs = new Ecs()
    const backend = new InMemoryStorageBackend()
    const saveManager = await createInitializedSaveManager(ecs, backend)
    saveManager.registerComponent(
      Coins,
      (data) => new Coins((data as CoinsData).amount)
    )

    ecs.create('saved-entity').add(new Coins(5))
    await saveManager.save('slot1')

    // Entity created after the save, and not part of it, should be
    // removed once we load slot1 back.
    ecs.create('unsaved-entity').add(new Coins(99))

    await saveManager.load('slot1')

    expect(ecs.entity('saved-entity')?.get(Coins).amount).toBe(5)
    expect(ecs.entity('unsaved-entity')).toBeUndefined()
    expect(ecs.getEntityNumber()).toBe(1)
  })
})
