import MapList from '../src/lists/MapList'
import Component from '../src/ecs/Component'

// Minimal entity stub — MapList only needs _id
interface Item {
  _id: string
  value?: number
}

function makeItem(id: string, value = 0): Item {
  return { _id: id, value }
}

// A real Component subclass so the list constructor type is satisfied
class DummyComp extends Component {}

function makeList(options: {
  onCreate?: (e: Item) => void
  onDelete?: (e: Item) => void
  shouldBeAdded?: (e: Item) => boolean
} = {}): MapList<Item> {
  return new MapList<Item>(1, {
    constructors: [DummyComp],
    onCreate: options.onCreate,
    onDelete: options.onDelete,
    shouldBeAdded: options.shouldBeAdded,
  })
}

describe('MapList', () => {
  describe('add / length / forEach', () => {
    it('starts empty', () => {
      expect(makeList().length).toBe(0)
    })

    it('add increases length', () => {
      const list = makeList()
      list.add(makeItem('a'))
      list.add(makeItem('b'))
      expect(list.length).toBe(2)
    })

    it('forEach visits all items', () => {
      const list = makeList()
      const a = makeItem('a')
      const b = makeItem('b')
      list.add(a)
      list.add(b)
      const visited: Item[] = []
      list.forEach((e) => visited.push(e))
      expect(visited).toContain(a)
      expect(visited).toContain(b)
    })
  })

  describe('remove', () => {
    it('remove decreases length', () => {
      const list = makeList()
      const a = makeItem('a')
      list.add(a)
      list.remove(a)
      expect(list.length).toBe(0)
    })

    it('remove makes item invisible in forEach', () => {
      const list = makeList()
      const a = makeItem('a')
      const b = makeItem('b')
      list.add(a)
      list.add(b)
      list.remove(a)
      const visited: Item[] = []
      list.forEach((e) => visited.push(e))
      expect(visited).not.toContain(a)
      expect(visited).toContain(b)
    })
  })

  describe('callbacks', () => {
    it('onCreate called when item added', () => {
      const created: Item[] = []
      const list = makeList({ onCreate: (e) => created.push(e) })
      const a = makeItem('a')
      list.add(a)
      expect(created).toContain(a)
    })

    it('onDelete called when item removed', () => {
      const deleted: Item[] = []
      const list = makeList({ onDelete: (e) => deleted.push(e) })
      const a = makeItem('a')
      list.add(a)
      list.remove(a)
      expect(deleted).toContain(a)
    })

    it('onCreate NOT called when shouldBeAdded returns false', () => {
      const created: Item[] = []
      const list = makeList({
        shouldBeAdded: () => false,
        onCreate: (e) => created.push(e),
      })
      list.add(makeItem('x'))
      expect(created).toHaveLength(0)
    })
  })

  describe('shouldBeAdded', () => {
    it('filters items based on predicate', () => {
      const list = makeList({ shouldBeAdded: (e) => e.value! > 0 })
      list.add(makeItem('zero', 0))
      list.add(makeItem('pos', 5))
      expect(list.length).toBe(1)
      const visited: Item[] = []
      list.forEach((e) => visited.push(e))
      expect(visited[0]._id).toBe('pos')
    })
  })

  describe('clear', () => {
    it('empties the list', () => {
      const list = makeList()
      list.add(makeItem('a'))
      list.add(makeItem('b'))
      list.clear()
      expect(list.length).toBe(0)
    })
  })

  describe('signature', () => {
    it('exposes the signature passed at construction', () => {
      const list = makeList()
      expect(list.signature).toBe(1)
    })
  })
})
