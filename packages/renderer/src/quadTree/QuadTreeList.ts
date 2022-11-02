import { ArrayListOptions, Entity, IList, List, Transform } from '@mythor/core'
import { overlaps, Rect, Vec2 } from '@mythor/math'
import QuadTree from './QuadTree'
import Renderable from '../components/Renderable'

type QuadTreeListOptions = ArrayListOptions<Entity> & {
  size?: Vec2
  position?: Vec2
}

class QuadTreeList extends List<Entity> implements IList<Entity> {
  private _data: Map<string, Entity>
  private rendered = 0
  public quadTree: QuadTree

  public constructor(signature: number, options: QuadTreeListOptions) {
    super(signature, options)
    this._data = new Map<string, Entity>()
    this.resize({
      position: options?.position ?? Vec2.zero(),
      size: options?.size ?? Vec2.create(5000, 5000),
    })
  }

  public resize(rect: Rect): void {
    this.quadTree = new QuadTree(rect)

    this._data.forEach((entity) => {
      this.quadTree.insert(entity)
    })
  }

  public __add(entity: Entity): void {
    this._data.set(entity._id, entity)
    entity.get(Renderable).quadTree = this.quadTree.insert(entity)
  }

  public __remove(entity: Entity): void {
    this._data.delete(entity._id)

    const renderable = entity.get(Renderable)
    if (!renderable.quadTree) {
      return
    }
    const removed = renderable.quadTree.remove(entity)

    if (removed) {
      entity.get(Renderable).quadTree = null
    }
  }

  public clear(): void {
    this._data = new Map()
  }

  public update(entity: Entity): void {
    this.__remove(entity)
    this.__add(entity)
  }

  public forEach(callback: (e: Entity) => void): void {
    this._data.forEach(callback)
  }

  public naiveSearchForeach(rect: Rect, callback: (e: Entity) => void): void {
    const cb = (entity: Entity): void => {
      if (overlaps(rect, entity.get(Transform))) {
        callback(entity)
      }
    }
    this._data.forEach(cb)
  }

  public searchForEach(rect: Rect, callback: (e: Entity) => void): void {
    const entitiesByLayer: Entity[][] = []

    const entities = this.quadTree.search(rect, (entity) => {
      const layer = entity.get(Renderable).layer
      if (!entitiesByLayer[layer]) {
        entitiesByLayer[layer] = []
      }
      entitiesByLayer[layer].push(entity)
    })
    this.rendered = entities.length

    entitiesByLayer.forEach((layer) => layer.forEach(callback))
  }

  public get length(): number {
    return this._data.size
  }
}

export default QuadTreeList
