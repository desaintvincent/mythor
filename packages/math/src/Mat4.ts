import Vec3 from './Vec3'
import type { Mat4Array } from './Quaternion'

export type { Mat4Array }

export default class Mat4 {
  public static identity(): Mat4Array {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }

  public static multiply(a: Mat4Array, b: Mat4Array): Mat4Array {
    const result = new Array(16).fill(0) as number[]

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        let sum = 0
        for (let i = 0; i < 4; i++) {
          sum += a[i * 4 + row] * b[col * 4 + i]
        }
        result[col * 4 + row] = sum
      }
    }

    return result as Mat4Array
  }

  public static translate(v: Vec3): Mat4Array {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1]
  }

  public static scale(v: Vec3): Mat4Array {
    return [v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1]
  }

  public static rotateX(angleInRadians: number): Mat4Array {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]
  }

  public static rotateY(angleInRadians: number): Mat4Array {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]
  }

  public static rotateZ(angleInRadians: number): Mat4Array {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }

  public static perspective(
    fovInRadians: number,
    aspect: number,
    near: number,
    far: number
  ): Mat4Array {
    const f = 1 / Math.tan(fovInRadians / 2)
    const rangeInv = 1 / (near - far)

    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ]
  }

  public static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4Array {
    const zAxis = Vec3.sub(eye, target).normalize()
    const xAxis = Vec3.cross(up, zAxis).normalize()
    const yAxis = Vec3.cross(zAxis, xAxis).normalize()

    return [
      xAxis.x,
      yAxis.x,
      zAxis.x,
      0,
      xAxis.y,
      yAxis.y,
      zAxis.y,
      0,
      xAxis.z,
      yAxis.z,
      zAxis.z,
      0,
      -Vec3.dot(xAxis, eye),
      -Vec3.dot(yAxis, eye),
      -Vec3.dot(zAxis, eye),
      1,
    ]
  }
}
