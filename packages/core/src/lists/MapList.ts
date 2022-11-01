import IList from './IList'
import List, { ArrayListOptions } from './List'

class MapList<T extends { _id: string }> extends List<T> implements IList<T> {
  private _data: Map<string, T>

  public constructor(signature: number, options: ArrayListOptions<T>) {
    super(signature, options)
    this._data = new Map()
  }

  public __add(data: T): void {
    this._data.set(data._id, data)
  }

  public __remove(data: T): void {
    this._data.delete(data._id)
  }

  public clear(): void {
    this._data = new Map()
  }

  public forEach(callback: (e: T) => void): void {
    this._data.forEach(callback)
  }

  public get length(): number {
    return this._data.size
  }
}

export default MapList
