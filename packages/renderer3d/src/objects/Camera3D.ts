import { Mat4, Vec3, Mat4Array } from '@mythor/math'

export interface Camera3DOptions {
  position?: Vec3
  target?: Vec3
  up?: Vec3
  fovInRadians?: number
  aspect?: number
  near?: number
  far?: number
}

const defaultOptions: Required<Camera3DOptions> = {
  position: new Vec3(0, 0, 5),
  target: Vec3.zero(),
  up: new Vec3(0, 1, 0),
  fovInRadians: Math.PI / 4,
  aspect: 1024 / 512,
  near: 0.1,
  far: 1000,
}

export default class Camera3D {
  public position: Vec3
  public target: Vec3
  public up: Vec3
  public fovInRadians: number
  public aspect: number
  public near: number
  public far: number

  public constructor(options?: Camera3DOptions) {
    this.position = options?.position ?? defaultOptions.position
    this.target = options?.target ?? defaultOptions.target
    this.up = options?.up ?? defaultOptions.up
    this.fovInRadians = options?.fovInRadians ?? defaultOptions.fovInRadians
    this.aspect = options?.aspect ?? defaultOptions.aspect
    this.near = options?.near ?? defaultOptions.near
    this.far = options?.far ?? defaultOptions.far
  }

  public get viewMatrix(): Mat4Array {
    return Mat4.lookAt(this.position, this.target, this.up)
  }

  public get projectionMatrix(): Mat4Array {
    return Mat4.perspective(this.fovInRadians, this.aspect, this.near, this.far)
  }

  public get viewProjectionMatrix(): Mat4Array {
    return Mat4.multiply(this.projectionMatrix, this.viewMatrix)
  }
}
