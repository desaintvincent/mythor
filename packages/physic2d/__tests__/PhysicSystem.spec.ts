import { Ecs, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import PhysicSystem, { IGNORED_BY_WORLD } from '../src/systems/PhysicSystem'
import Physic, { PhysicType } from '../src/components/Physic'
import ColliderCallback from '../src/components/ColliderCallback'

describe('PhysicSystem', () => {
  describe('body creation', () => {
    it('moves a dynamic body according to its initial linear velocity', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem({ gravity: new Vec2(0, 0) })
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform({ position: new Vec2(0, 0) }),
        new Physic({
          type: PhysicType.DYNAMIC,
          initialLinearVelocity: new Vec2(10, 0),
        })
      )

      for (let i = 0; i < 5; i++) {
        ecs.update(1 / 60, i / 60)
      }

      expect(entity.get(Transform).position.x).toBeGreaterThan(0)
    })

    it('leaves a static body in place', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform({ position: new Vec2(5, 5) }),
        new Physic({ type: PhysicType.STATIC })
      )

      ecs.update(1 / 60, 1 / 60)

      expect(entity.get(Transform).position.x).toBeCloseTo(5)
      expect(entity.get(Transform).position.y).toBeCloseTo(5)
    })

    it('creates one fixture per polygon when polygons are provided', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform(),
        new Physic({
          type: PhysicType.STATIC,
          polygons: [
            [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 1, y: 1 },
            ],
            [
              { x: 0, y: 0 },
              { x: -1, y: 0 },
              { x: -1, y: -1 },
            ],
          ],
        })
      )

      const fixtureCount = countFixtures(entity.get(Physic).body)
      expect(fixtureCount).toBe(2)
    })

    it('creates one fixture per ellipse when ellipses are provided', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform(),
        new Physic({ type: PhysicType.STATIC, ellipses: [10, 20] })
      )

      expect(countFixtures(entity.get(Physic).body)).toBe(2)
    })

    it('falls back to a single box fixture when no shape is provided', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(new Transform(), new Physic({ type: PhysicType.STATIC }))

      expect(countFixtures(entity.get(Physic).body)).toBe(1)
    })

    it('applies IGNORED_BY_WORLD filter mask when interactWithWorld is false', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform(),
        new Physic({ type: PhysicType.STATIC, interactWithWorld: false })
      )

      const fixture = entity.get(Physic).body.getFixtureList()
      expect(fixture?.getFilterMaskBits()).toBe(IGNORED_BY_WORLD)
    })

    it('applies default category bits when interactWithWorld is true', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(new Transform(), new Physic({ type: PhysicType.STATIC }))

      const fixture = entity.get(Physic).body.getFixtureList()
      expect(fixture?.getFilterCategoryBits()).toBe(parseInt('010', 2))
    })
  })

  describe('onEntityDestruction', () => {
    it('removes the planck body from the world when the entity is destroyed', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(new Transform(), new Physic({ type: PhysicType.STATIC }))

      expect(countBodies(system.world)).toBe(1)

      entity.destroy()
      ecs.update(0, 0)

      expect(countBodies(system.world)).toBe(0)
    })
  })

  describe('query', () => {
    it('finds an entity whose body overlaps the given point', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform({ position: new Vec2(0, 0), size: new Vec2(100, 100) }),
        new Physic({ type: PhysicType.STATIC })
      )

      const found: string[] = []
      system.query(
        new Vec2(0, 0),
        (foundEntity) => {
          found.push(foundEntity._id)

          return false
        },
        false
      )

      expect(found).toContain(entity._id)
    })

    it('does not find an entity far away from the queried point', async () => {
      const ecs = new Ecs()
      const system = new PhysicSystem()
      ecs.registerSystems(system)
      await ecs.init()

      const entity = ecs.create()
      entity.add(
        new Transform({ position: new Vec2(0, 0), size: new Vec2(100, 100) }),
        new Physic({ type: PhysicType.STATIC })
      )

      const found: string[] = []
      system.query(
        new Vec2(1000, 1000),
        (foundEntity) => {
          found.push(foundEntity._id)

          return false
        },
        false
      )

      expect(found).not.toContain(entity._id)
    })
  })
})

describe('ColliderCallback', () => {
  it('defaults options to false', () => {
    const collider = new ColliderCallback()
    expect(collider.disableContact).toBe(false)
    expect(collider.sticky).toBe(false)
    expect(collider.deleteOnContact).toBe(false)
  })

  it('applies provided options', () => {
    const collider = new ColliderCallback({
      disableContact: true,
      sticky: true,
      deleteOnContact: true,
    })
    expect(collider.disableContact).toBe(true)
    expect(collider.sticky).toBe(true)
    expect(collider.deleteOnContact).toBe(true)
  })

  it('invokes the provided callback only once attached to an entity', () => {
    const ecs = new Ecs()
    const cb = jest.fn()
    const entity = ecs.create()
    const otherEntity = ecs.create()
    const collider = new ColliderCallback({ callback: cb })

    // not attached yet: callback must not be invoked
    collider.callback(otherEntity, {} as never)
    expect(cb).not.toHaveBeenCalled()

    entity.add(collider)
    collider.callback(otherEntity, {} as never)
    expect(cb).toHaveBeenCalledWith(entity, otherEntity, {}, undefined)
  })
})

function countFixtures(body: import('planck').Body): number {
  let count = 0
  for (let f = body.getFixtureList(); f; f = f.getNext()) {
    count += 1
  }

  return count
}

function countBodies(world: import('planck').World): number {
  let count = 0
  for (let b = world.getBodyList(); b; b = b.getNext()) {
    count += 1
  }

  return count
}
