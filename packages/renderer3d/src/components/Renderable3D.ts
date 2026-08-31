import { Component } from '@mythor/core'

export type Color3 = [number, number, number]

export interface Renderable3DOptions {
  vertices?: Float32Array
  colors?: Float32Array
  color?: Color3
}

const defaultVertices = new Float32Array([
  // simple triangle in local space
  0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0,
])

const defaultColor: Color3 = [1, 1, 1]

function buildUniformColors(vertexCount: number, color: Color3): Float32Array {
  const colors = new Float32Array(vertexCount * 3)

  for (let index = 0; index < vertexCount; index += 1) {
    colors[index * 3] = color[0]
    colors[index * 3 + 1] = color[1]
    colors[index * 3 + 2] = color[2]
  }

  return colors
}

export default class Renderable3D extends Component {
  public readonly vertices: Float32Array
  public readonly colors: Float32Array

  public constructor(options?: Renderable3DOptions) {
    super()
    this.vertices = options?.vertices ?? defaultVertices
    this.colors =
      options?.colors ??
      buildUniformColors(this.vertexCount, options?.color ?? defaultColor)
  }

  public get vertexCount(): number {
    return this.vertices.length / 3
  }
}
