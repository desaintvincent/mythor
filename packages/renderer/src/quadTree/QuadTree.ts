import { contains, overlaps, Rect, Vec2 } from '@mythor/math'
import { Entity, Transform } from '@mythor/core'

enum QuadPlace {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

const MAX_DEPTH = 8

class QuadTree {
  public rect: Rect
  private readonly items: Map<string, Entity> = new Map<string, Entity>()
  public readonly depth: number
  public readonly parent?: QuadTree
  public readonly leaves: QuadTree[] = []
  private readonly leaveRects: Rect[] = []

  public constructor(rect: Rect, parent?: QuadTree) {
    this.depth = parent ? parent.depth + 1 : 0
    this.parent = parent
    this.resize(rect)
  }

  public get length(): number {
    return this.leaves.reduce((acc, curr) => acc + curr.length, this.items.size)
  }

  public get itemLength(): number {
    return this.items.size
  }

  public insert(entity: Entity): QuadTree {
    for (let i = 0; i < 4; i++) {
      if (
        this.depth + 1 < MAX_DEPTH &&
        contains(this.leaveRects[i], entity.get(Transform))
      ) {
        if (!this.leaves[i]) {
          this.leaves[i] = new QuadTree(this.leaveRects[i], this)
        }

        return this.leaves[i].insert(entity)
      }
    }

    this.items.set(entity._id, entity)

    return this
  }

  public search(rArea: Rect, cb?: (entity: Entity) => void): Entity[] {
    const result: Entity[] = []

    this.items.forEach((entity) => {
      if (overlaps(rArea, entity.get(Transform))) {
        cb?.(entity)
        result.push(entity)
      }
    })

    for (let i = 0; i < 4; i++) {
      if (!this.leaves[i]) {
        continue
      }

      if (contains(rArea, this.leaveRects[i])) {
        const items = this.leaves[i].getAllItems()
        result.push(...items)
        if (cb) {
          items.forEach((entity) => {
            cb?.(entity)
          })
        }
      } else if (overlaps(this.leaveRects[i], rArea)) {
        result.push(...this.leaves[i].search(rArea, cb))
      }
    }

    return result
  }

  public remove(entity: Entity): boolean {
    return this.items.delete(entity._id)
  }

  public getAllItems(): Entity[] {
    return this.leaves.reduce((acc, curr) => {
      return [...acc, ...curr.getAllItems()]
    }, Array.from(this.items.values()))
  }

  private resize(rect: Rect): void {
    this.clear()

    const { position, size } = rect
    this.rect = rect

    const childSize = size.divide(2)
    const quarter = size.divide(4)

    this.leaveRects[QuadPlace.TOP_LEFT] = {
      position: Vec2.sub(position, quarter),
      size: childSize,
    }

    this.leaveRects[QuadPlace.TOP_RIGHT] = {
      position: Vec2.add(position, Vec2.create(quarter.x, -quarter.y)),
      size: childSize,
    }

    this.leaveRects[QuadPlace.BOTTOM_LEFT] = {
      position: Vec2.sub(position, Vec2.create(quarter.x, -quarter.y)),
      size: childSize,
    }

    this.leaveRects[QuadPlace.BOTTOM_RIGHT] = {
      position: Vec2.add(position, quarter),
      size: childSize,
    }
  }

  private clear(): void {
    this.items.clear()

    while (this.leaves.length > 0) {
      this.leaves.shift()?.clear()
    }
  }
}

export default QuadTree
