import { root } from './util'

export default class Vec3 {
  public x: number
  public y: number
  public z: number

  public constructor(x: number, y?: number, z?: number) {
    this.x = x
    this.y = y ?? x
    this.z = z ?? x
  }

  public static create(x: number, y?: number, z?: number): Vec3 {
    return new Vec3(x, y, z)
  }

  public static zero(): Vec3 {
    return new Vec3(0, 0, 0)
  }

  public static one(): Vec3 {
    return new Vec3(1, 1, 1)
  }

  public times(n: number): Vec3 {
    return new Vec3(this.x * n, this.y * n, this.z * n)
  }

  public static times(v: Vec3, n: number): Vec3 {
    return v.times(n)
  }

  public divide(n: number): Vec3 {
    return this.times(1 / n)
  }

  public static divide(v: Vec3, n: number): Vec3 {
    return v.divide(n)
  }

  public add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  public static add(v1: Vec3, v2: Vec3): Vec3 {
    return v1.add(v2)
  }

  public sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  public static sub(v1: Vec3, v2: Vec3): Vec3 {
    return v1.sub(v2)
  }

  public dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  public static dot(v1: Vec3, v2: Vec3): number {
    return v1.dot(v2)
  }

  public cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

  public static cross(v1: Vec3, v2: Vec3): Vec3 {
    return v1.cross(v2)
  }

  public length(): number {
    return Math.sqrt(root(this.x) + root(this.y) + root(this.z))
  }

  public static magnitude(v: Vec3): number {
    return v.length()
  }

  public normalize(): Vec3 {
    const length = this.length()

    if (length === 0) {
      return Vec3.zero()
    }

    return this.divide(length)
  }

  public static normalize(v: Vec3): Vec3 {
    return v.normalize()
  }

  public static lerp(v1: Vec3, v2: Vec3, amount = 0.5): Vec3 {
    return new Vec3(
      v1.x + (v2.x - v1.x) * amount,
      v1.y + (v2.y - v1.y) * amount,
      v1.z + (v2.z - v1.z) * amount
    )
  }

  public array(): [number, number, number] {
    return [this.x, this.y, this.z]
  }

  public toString(): string {
    return `{x:${this.x.toFixed(2)},y:${this.y.toFixed(2)},z:${this.z.toFixed(
      2
    )}}`
  }
}
