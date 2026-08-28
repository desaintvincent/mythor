import QuadTree from '../src/quadTree/QuadTree'
import { Vec2 } from '@mythor/math'
import { Ecs, Transform } from '@mythor/core'

describe('QuadTree', () => {
  it('stores entities outside child bounds at the current node', () => {
    const tree = new QuadTree({
      position: Vec2.zero(),
      size: new Vec2(100, 100),
    })
    const ecs = new Ecs()
    const entity = ecs.create('e1')
    entity.add(
      new Transform({ position: new Vec2(0, 0), size: new Vec2(80, 80) })
    )

    tree.insert(entity)

    expect(tree.itemLength).toBe(1)
    expect(tree.length).toBe(1)
  })

  it('navigates to children for contained entities and searches by area', () => {
    const tree = new QuadTree({
      position: Vec2.zero(),
      size: new Vec2(200, 200),
    })
    const ecs = new Ecs()
    const inside = ecs.create('inside')
    inside.add(
      new Transform({ position: new Vec2(-50, -50), size: new Vec2(10, 10) })
    )
    const outside = ecs.create('outside')
    outside.add(
      new Transform({ position: new Vec2(60, 60), size: new Vec2(10, 10) })
    )

    tree.insert(inside)
    tree.insert(outside)

    const found = tree.search({
      position: new Vec2(-50, -50),
      size: new Vec2(20, 20),
    })
    expect(found.map((entity) => entity._id)).toContain('inside')
    expect(found.map((entity) => entity._id)).not.toContain('outside')
  })

  it('removes items from the node map', () => {
    const tree = new QuadTree({
      position: Vec2.zero(),
      size: new Vec2(100, 100),
    })
    const ecs = new Ecs()
    const entity = ecs.create('e2')
    entity.add(
      new Transform({ position: new Vec2(0, 0), size: new Vec2(80, 80) })
    )

    tree.insert(entity)
    expect(tree.remove(entity)).toBe(true)
    expect(tree.itemLength).toBe(0)
  })
})
