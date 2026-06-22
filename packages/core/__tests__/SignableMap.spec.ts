import SignableMap from '../src/collections/SignableMap'
import Signable from '../src/collections/Signable'

// Concrete subclasses — module-scope so signatures are stable
class ItemA extends Signable {}
class ItemB extends Signable {}
class ItemC extends Signable {}

function makeMap(): SignableMap<Signable> {
  // Each test gets a fresh map instance; the static ConstructorRegistry persists
  // across tests in this file (same worker), but that's fine — signatures are stable.
  return new SignableMap<Signable>('signable_test', 'green')
}

describe('SignableMap', () => {
  describe('set / get / has', () => {
    it('set then get returns same instance', () => {
      const map = makeMap()
      const a = new ItemA()
      map.set(a)
      expect(map.get(ItemA)).toBe(a)
    })

    it('has returns true after set', () => {
      const map = makeMap()
      map.set(new ItemA())
      expect(map.has(ItemA)).toBe(true)
    })

    it('has returns false for unseen constructor', () => {
      const map = makeMap()
      expect(map.has(ItemB)).toBe(false)
    })

    it('set overwrites previous instance', () => {
      const map = makeMap()
      const first = new ItemA()
      const second = new ItemA()
      map.set(first)
      map.set(second)
      expect(map.get(ItemA)).toBe(second)
    })

    it('multiple types coexist independently', () => {
      const map = makeMap()
      const a = new ItemA()
      const b = new ItemB()
      map.set(a).set(b)
      expect(map.get(ItemA)).toBe(a)
      expect(map.get(ItemB)).toBe(b)
    })
  })

  describe('size', () => {
    it('starts at 0', () => {
      expect(makeMap().size).toBe(0)
    })

    it('increments on each unique set', () => {
      const map = makeMap()
      map.set(new ItemA())
      map.set(new ItemB())
      expect(map.size).toBe(2)
    })

    it('does not grow on overwrite', () => {
      const map = makeMap()
      map.set(new ItemA())
      map.set(new ItemA())
      expect(map.size).toBe(1)
    })
  })

  describe('delete', () => {
    it('removes a set item', () => {
      const map = makeMap()
      map.set(new ItemA())
      map.delete(ItemA)
      expect(map.has(ItemA)).toBe(false)
    })

    it('returns true when item existed', () => {
      const map = makeMap()
      map.set(new ItemA())
      expect(map.delete(ItemA)).toBe(true)
    })

    it('returns false when item did not exist', () => {
      const map = makeMap()
      expect(map.delete(ItemB)).toBe(false)
    })
  })

  describe('clear', () => {
    it('empties the map', () => {
      const map = makeMap()
      map.set(new ItemA()).set(new ItemB())
      map.clear()
      expect(map.size).toBe(0)
      expect(map.has(ItemA)).toBe(false)
    })
  })

  describe('forEach', () => {
    it('iterates all values', () => {
      const map = makeMap()
      const a = new ItemA()
      const b = new ItemB()
      map.set(a).set(b)
      const visited: Signable[] = []
      map.forEach((v) => visited.push(v))
      expect(visited).toContain(a)
      expect(visited).toContain(b)
    })
  })

  describe('map', () => {
    it('maps values to a new array', () => {
      const map = makeMap()
      map.set(new ItemA()).set(new ItemB()).set(new ItemC())
      const result = map.map((_, i) => i)
      expect(result).toHaveLength(3)
      result.forEach((v) => expect(typeof v).toBe('number'))
    })
  })
})
