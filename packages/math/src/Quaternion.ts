import Vec3 from './Vec3'

export type Mat4Array = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]

export default class Quaternion {
  public x: number
  public y: number
  public z: number
  public w: number

  public constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  public static identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1)
  }

  public static fromAxisAngle(axis: Vec3, angleInRadians: number): Quaternion {
    const normalizedAxis = axis.normalize()
    const halfAngle = angleInRadians / 2
    const s = Math.sin(halfAngle)

    return new Quaternion(
      normalizedAxis.x * s,
      normalizedAxis.y * s,
      normalizedAxis.z * s,
      Math.cos(halfAngle)
    )
  }

  public static fromEuler(
    pitchInRadians: number,
    yawInRadians: number,
    rollInRadians: number
  ): Quaternion {
    const cx = Math.cos(pitchInRadians / 2)
    const sx = Math.sin(pitchInRadians / 2)
    const cy = Math.cos(yawInRadians / 2)
    const sy = Math.sin(yawInRadians / 2)
    const cz = Math.cos(rollInRadians / 2)
    const sz = Math.sin(rollInRadians / 2)

    return new Quaternion(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz
    )
  }

  public multiply(q: Quaternion): Quaternion {
    return new Quaternion(
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
    )
  }

  public static multiply(q1: Quaternion, q2: Quaternion): Quaternion {
    return q1.multiply(q2)
  }

  public length(): number {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    )
  }

  public normalize(): Quaternion {
    const length = this.length()

    if (length === 0) {
      return Quaternion.identity()
    }

    return new Quaternion(
      this.x / length,
      this.y / length,
      this.z / length,
      this.w / length
    )
  }

  public toMat4(): Mat4Array {
    const { x, y, z, w } = this.normalize()

    const x2 = x + x
    const y2 = y + y
    const z2 = z + z

    const xx = x * x2
    const xy = x * y2
    const xz = x * z2
    const yy = y * y2
    const yz = y * z2
    const zz = z * z2
    const wx = w * x2
    const wy = w * y2
    const wz = w * z2

    return [
      1 - (yy + zz),
      xy + wz,
      xz - wy,
      0,
      xy - wz,
      1 - (xx + zz),
      yz + wx,
      0,
      xz + wy,
      yz - wx,
      1 - (xx + yy),
      0,
      0,
      0,
      0,
      1,
    ]
  }

  public toString(): string {
    return `{x:${this.x.toFixed(2)},y:${this.y.toFixed(2)},z:${this.z.toFixed(
      2
    )},w:${this.w.toFixed(2)}}`
  }
}
