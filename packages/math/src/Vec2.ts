import { root, round } from './util'

type ObserveCbFunction = () => void

export default class Vec2 {
  private _x = 0
  private _y = 0
  private readonly _observers: ObserveCbFunction[] = []

  public get x(): number {
    return this._x
  }

  public set x(value: number) {
    this.triggerObservers()
    this._x = value
  }

  public get y(): number {
    return this._y
  }

  public set y(value: number) {
    this.triggerObservers()
    this._y = value
  }

  private triggerObservers(): void {
    if (this._observers.length === 0) {
      return
    }

    this._observers.forEach((observer) => observer())
  }

  public observe(cb: ObserveCbFunction): void {
    this._observers.push(cb)
  }

  public constructor(x: number, y: number) {
    this.set(x, y)
  }

  public static create(x: number, y?: number): Vec2 {
    return new Vec2(x, y ?? x)
  }

  public static zero(): Vec2 {
    return new Vec2(0, 0)
  }

  public set(x: number, y: number): Vec2 {
    this.x = x
    this.y = y

    return this
  }

  public vSet(v: Vec2): Vec2 {
    this.x = v.x
    this.y = v.y

    return this
  }

  public times(n: number): Vec2 {
    return new Vec2(this.x * n, this.y * n)
  }

  public static times(v: Vec2, n: number): Vec2 {
    return v.times(n)
  }

  public vTimes(v: Vec2): Vec2 {
    return new Vec2(this.x * v.x, this.y * v.y)
  }

  public static vTimes(v1: Vec2, v2: Vec2): Vec2 {
    return v1.vTimes(v2)
  }

  public divide(n: number): Vec2 {
    return this.times(1 / n)
  }

  public static divide(v: Vec2, n: number): Vec2 {
    return v.divide(n)
  }

  public vDivide(v: Vec2): Vec2 {
    return new Vec2(this.x / v.x, this.y / v.y)
  }

  public static vDivide(v1: Vec2, v2: Vec2): Vec2 {
    return v1.vDivide(v2)
  }

  public add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  public static add(v1: Vec2, v2: Vec2): Vec2 {
    return v1.add(v2)
  }

  public sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y)
  }

  public static sub(v1: Vec2, v2: Vec2): Vec2 {
    return v1.sub(v2)
  }

  public toAngle(): number {
    return Math.atan2(this.y, this.x)
  }

  public static toAngle(v: Vec2): number {
    return v.toAngle()
  }

  public static fromAngle(rad: number): Vec2 {
    return new Vec2(Math.cos(rad), Math.sin(rad))
  }

  public rotate(rotationInRadians: number): Vec2 {
    return new Vec2(
      this.x * Math.cos(rotationInRadians) -
        this.y * Math.sin(rotationInRadians),
      this.x * Math.sin(rotationInRadians) +
        this.y * Math.cos(rotationInRadians)
    )
  }

  public static rotate(v: Vec2, rotationInRadians: number): Vec2 {
    return v.rotate(rotationInRadians)
  }

  public distanceSquared(v2: Vec2): number {
    return root(this.x - v2.x) + root(this.y - v2.y)
  }

  public static distanceSquared(v1: Vec2, v2: Vec2): number {
    return v1.distanceSquared(v2)
  }

  public round(precision: number): Vec2 {
    return this.set(round(this.x, precision), round(this.y, precision))
  }

  public static round(v: Vec2, precision: number): Vec2 {
    return v.set(round(v.x, precision), round(v.y, precision))
  }

  public static medium(vectors: Vec2[]): Vec2 {
    const sum = vectors.reduce((acc, curr) => acc.add(curr))

    return sum.divide(vectors.length)
  }

  public array(): [number, number] {
    return [this.x, this.y]
  }

  public toString(): string {
    return `{x:${this.x.toFixed(2)},y:${this.y.toFixed(2)}}`
  }

  /*

  equals (other: Vec2): boolean {
    return this.x === other.x && this.y === other.y
  }

  static equals (v1: Vec2, v2: Vec2): boolean {
    return v1.equals(v2)
  }

   */
}
