import Entity from '../src/ecs/Entity'
import Component from '../src/ecs/Component'

// Define at module scope — same constructor reference reused across tests (stable signature)
class PositionComp extends Component {}
class VelocityComp extends Component {}
class HealthComp extends Component {}

describe('Entity', () => {
  it('creates with auto-generated id', () => {
    const e = new Entity()
    expect(e._id).toBeDefined()
    expect(typeof e._id).toBe('string')
    expect(e._id.length).toBeGreaterThan(0)
  })

  it('creates with custom id', () => {
    const e = new Entity('my-entity')
    expect(e._id).toBe('my-entity')
  })

  describe('components', () => {
    it('starts with no components', () => {
      const e = new Entity()
      expect(e.components).toHaveLength(0)
    })

    it('add → has returns true', () => {
      const e = new Entity()
      e.add(new PositionComp())
      expect(e.has(PositionComp)).toBe(true)
    })

    it('add → get returns the instance', () => {
      const e = new Entity()
      const pos = new PositionComp()
      e.add(pos)
      expect(e.get(PositionComp)).toBe(pos)
    })

    it('has returns false for missing component', () => {
      const e = new Entity()
      expect(e.has(VelocityComp)).toBe(false)
    })

    it('remove → has returns false', () => {
      const e = new Entity()
      e.add(new VelocityComp())
      e.remove(VelocityComp)
      expect(e.has(VelocityComp)).toBe(false)
    })

    it('remove unsigned component throws', () => {
      class UnsignedComp extends Component {}
      const e = new Entity()
      expect(() => e.remove(UnsignedComp)).toThrow()
    })

    it('components getter returns all added components', () => {
      const e = new Entity()
      const pos = new PositionComp()
      const vel = new VelocityComp()
      e.add(pos, vel)
      expect(e.components).toContain(pos)
      expect(e.components).toContain(vel)
      expect(e.components).toHaveLength(2)
    })

    it('adding same component twice keeps last instance', () => {
      const e = new Entity()
      const pos1 = new PositionComp()
      const pos2 = new PositionComp()
      e.add(pos1)
      e.add(pos2)
      expect(e.get(PositionComp)).toBe(pos2)
    })
  })

  describe('tags', () => {
    it('hasTag returns false initially', () => {
      const e = new Entity()
      expect(e.hasTag('player')).toBe(false)
    })

    it('tag → hasTag returns true', () => {
      const e = new Entity()
      e.tag('player')
      expect(e.hasTag('player')).toBe(true)
    })

    it('tag returns entity for chaining', () => {
      const e = new Entity()
      expect(e.tag('player')).toBe(e)
    })

    it('multiple tags work independently', () => {
      const e = new Entity()
      e.tag('player').tag('hero')
      expect(e.hasTag('player')).toBe(true)
      expect(e.hasTag('hero')).toBe(true)
      expect(e.hasTag('enemy')).toBe(false)
    })
  })

  describe('hierarchy', () => {
    it('parent is undefined by default', () => {
      const e = new Entity()
      expect(e.parent).toBeUndefined()
    })

    it('addChild sets parent on child', () => {
      const parent = new Entity()
      const child = new Entity()
      parent.addChild(child)
      expect(child.parent).toBe(parent)
    })

    it('addChild adds to children array', () => {
      const parent = new Entity()
      const child = new Entity()
      parent.addChild(child)
      expect(parent.children).toContain(child)
    })

    it('addChild returns parent for chaining', () => {
      const parent = new Entity()
      const child = new Entity()
      expect(parent.addChild(child)).toBe(parent)
    })

    it('getRecursive finds component on self', () => {
      const e = new Entity()
      const health = new HealthComp()
      e.add(health)
      expect(e.getRecursive(HealthComp)).toBe(health)
    })

    it('getRecursive climbs to parent', () => {
      const parent = new Entity()
      const child = new Entity()
      parent.addChild(child)
      const health = new HealthComp()
      parent.add(health)
      expect(child.getRecursive(HealthComp)).toBe(health)
    })

    it('getRecursive returns undefined if not found anywhere', () => {
      const e = new Entity()
      expect(e.getRecursive(HealthComp)).toBeUndefined()
    })

    it('forEachChild iterates direct children', () => {
      const parent = new Entity()
      const c1 = new Entity()
      const c2 = new Entity()
      parent.addChild(c1).addChild(c2)
      const visited: Entity[] = []
      parent.forEachChild((e) => visited.push(e))
      expect(visited).toContain(c1)
      expect(visited).toContain(c2)
      expect(visited).toHaveLength(2)
    })
  })
})
