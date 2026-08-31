import { Component } from '@mythor/core'

export type Color3 = [number, number, number]

export interface Renderable3DOptions {
  vertices?: Float32Array
  color?: Color3
}

const defaultVertices = new Float32Array([
  // simple triangle in local space
  0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0,
])

export default class Renderable3D extends Component {
  public readonly vertices: Float32Array
  public readonly color: Color3

  public constructor(options?: Renderable3DOptions) {
    super()
    this.vertices = options?.vertices ?? defaultVertices
    this.color = options?.color ?? [1, 1, 1]
  }

  public get vertexCount(): number {
    return this.vertices.length / 3
  }
}
