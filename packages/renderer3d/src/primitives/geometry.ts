// Primitive 3D geometry generators (non-indexed, flat triangle lists). Each
// triangle is emitted as 3 vertices, matching Renderable3D's flat
// vertex-buffer format (gl.drawArrays TRIANGLES).
import { Color3 } from '../components/Renderable3D'

export interface Geometry {
  vertices: Float32Array
  colors: Float32Array
}

function buildGeometry(
  positions: number[][],
  colorPerTriangle: Color3[]
): Geometry {
  const vertices: number[] = []
  const colors: number[] = []

  positions.forEach((triangle, triangleIndex) => {
    const color = colorPerTriangle[triangleIndex]

    for (let vertexIndex = 0; vertexIndex < 3; vertexIndex += 1) {
      vertices.push(
        triangle[vertexIndex * 3],
        triangle[vertexIndex * 3 + 1],
        triangle[vertexIndex * 3 + 2]
      )
      colors.push(color[0], color[1], color[2])
    }
  })

  return {
    vertices: new Float32Array(vertices),
    colors: new Float32Array(colors),
  }
}

export function createCube(faceColors: Color3[]): Geometry {
  const triangles = [
    // front
    [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5],
    [-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5],
    // back
    [0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5],
    // left
    [-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5],
    [-0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5],
    // right
    [0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5],
    [0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5],
    // top
    [-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5],
    [-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5],
    // bottom
    [-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5],
  ]
  const colorPerTriangle = triangles.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (triangle, index) => faceColors[Math.floor(index / 2)]
  )

  return buildGeometry(triangles, colorPerTriangle)
}

export function createTetrahedron(faceColors: Color3[]): Geometry {
  const top: number[] = [0, 0.6, 0]
  const a: number[] = [-0.5, -0.4, 0.5]
  const b: number[] = [0.5, -0.4, 0.5]
  const c: number[] = [0, -0.4, -0.7]

  const triangles = [
    [...top, ...a, ...b],
    [...top, ...b, ...c],
    [...top, ...c, ...a],
    [...a, ...c, ...b],
  ]

  return buildGeometry(triangles, faceColors)
}

export function createSquarePyramid(faceColors: Color3[]): Geometry {
  const top: number[] = [0, 0.6, 0]
  const a: number[] = [-0.5, -0.4, 0.5]
  const b: number[] = [0.5, -0.4, 0.5]
  const c: number[] = [0.5, -0.4, -0.5]
  const d: number[] = [-0.5, -0.4, -0.5]

  const triangles = [
    [...top, ...a, ...b],
    [...top, ...b, ...c],
    [...top, ...c, ...d],
    [...top, ...d, ...a],
    [...a, ...c, ...b],
    [...a, ...d, ...c],
  ]

  return buildGeometry(triangles, faceColors)
}

export function createOctahedron(faceColors: Color3[]): Geometry {
  const top: number[] = [0, 0.7, 0]
  const bottom: number[] = [0, -0.7, 0]
  const a: number[] = [0.5, 0, 0.5]
  const b: number[] = [0.5, 0, -0.5]
  const c: number[] = [-0.5, 0, -0.5]
  const d: number[] = [-0.5, 0, 0.5]

  const triangles = [
    [...top, ...a, ...b],
    [...top, ...b, ...c],
    [...top, ...c, ...d],
    [...top, ...d, ...a],
    [...bottom, ...b, ...a],
    [...bottom, ...c, ...b],
    [...bottom, ...d, ...c],
    [...bottom, ...a, ...d],
  ]

  return buildGeometry(triangles, faceColors)
}

export function createTriangularPrism(faceColors: Color3[]): Geometry {
  const frontA: number[] = [0, 0.5, 0.5]
  const frontB: number[] = [-0.5, -0.5, 0.5]
  const frontC: number[] = [0.5, -0.5, 0.5]
  const backA: number[] = [0, 0.5, -0.5]
  const backB: number[] = [-0.5, -0.5, -0.5]
  const backC: number[] = [0.5, -0.5, -0.5]

  const triangles = [
    // front & back caps
    [...frontA, ...frontB, ...frontC],
    [...backA, ...backC, ...backB],
    // left face
    [...frontA, ...frontB, ...backB],
    [...frontA, ...backB, ...backA],
    // right face
    [...frontA, ...backA, ...backC],
    [...frontA, ...backC, ...frontC],
    // bottom face
    [...frontB, ...backB, ...backC],
    [...frontB, ...backC, ...frontC],
  ]
  const colorPerTriangle = [
    faceColors[0],
    faceColors[0],
    faceColors[1],
    faceColors[1],
    faceColors[2],
    faceColors[2],
    faceColors[3],
    faceColors[3],
  ]

  return buildGeometry(triangles, colorPerTriangle)
}

export function createGroundPlane(size: number, color: Color3): Geometry {
  const half = size / 2
  const triangles = [
    [-half, 0, half, half, 0, half, half, 0, -half],
    [-half, 0, half, half, 0, -half, -half, 0, -half],
  ]

  return buildGeometry(triangles, [color, color])
}
