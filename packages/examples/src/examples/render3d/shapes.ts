import { Transform3D } from '@mythor/core'
import { Vec3 } from '@mythor/math'
import {
  Camera3D,
  CameraMovementManager3D,
  createCube,
  createGroundPlane,
  createOctahedron,
  createSquarePyramid,
  createTetrahedron,
  createTriangularPrism,
  Renderable3D,
  Renderer3D,
} from '@mythor/renderer3d'
import { EventsManager } from '@mythor/events'
import { Game, Scene } from '@mythor/game'
import showDescription from '../../util/showDescription'
import StatisticsManager from '@mythor/game/lib/managers/StatisticsManager'

showDescription('Several 3D primitives rendered on top of a ground plane.', [
  'W/A/S/D: move the camera',
  'Q/E: move the camera down/up',
  'Right click + drag: look around',
])

const camera = new Camera3D({ position: new Vec3(0, 1.5, 6) })
const renderer = new Renderer3D({ camera })

const ground = createGroundPlane(20, [0.3, 0.3, 0.35])

const cube = createCube([
  [0.9, 0.2, 0.2],
  [0.7, 0.1, 0.1],
  [0.2, 0.7, 0.2],
  [0.1, 0.5, 0.1],
  [0.2, 0.4, 0.9],
  [0.1, 0.3, 0.7],
])

const tetrahedron = createTetrahedron([
  [0.9, 0.7, 0.1],
  [0.9, 0.5, 0.1],
  [0.7, 0.5, 0.1],
  [0.5, 0.4, 0.1],
])

const pyramid = createSquarePyramid([
  [0.8, 0.3, 0.8],
  [0.7, 0.2, 0.7],
  [0.6, 0.2, 0.6],
  [0.5, 0.1, 0.5],
  [0.4, 0.1, 0.4],
  [0.3, 0.1, 0.3],
])

const octahedron = createOctahedron([
  [0.1, 0.8, 0.8],
  [0.1, 0.7, 0.7],
  [0.1, 0.6, 0.6],
  [0.1, 0.5, 0.5],
  [0.1, 0.4, 0.4],
  [0.1, 0.3, 0.3],
  [0.1, 0.2, 0.2],
  [0.1, 0.1, 0.1],
])

const prism = createTriangularPrism([
  [0.9, 0.9, 0.2],
  [0.6, 0.6, 0.1],
  [0.4, 0.4, 0.1],
  [0.2, 0.2, 0.1],
])

const scene = new Scene('render3d-shapes', {
  managers: [
    new EventsManager(),
    new CameraMovementManager3D(),
    new StatisticsManager(),
  ],
  systems: [renderer],
  onLoaded: async (ecs) => {
    ecs
      .create()
      .add(
        new Transform3D({ position: Vec3.zero() }),
        new Renderable3D({ vertices: ground.vertices, colors: ground.colors })
      )
    ecs
      .create()
      .add(
        new Transform3D({ position: new Vec3(-4, 0.5, 0) }),
        new Renderable3D({ vertices: cube.vertices, colors: cube.colors })
      )
    ecs.create().add(
      new Transform3D({ position: new Vec3(-2, 0.4, 0) }),
      new Renderable3D({
        vertices: tetrahedron.vertices,
        colors: tetrahedron.colors,
      })
    )
    ecs.create().add(
      new Transform3D({ position: new Vec3(0, 0.4, 0) }),
      new Renderable3D({
        vertices: pyramid.vertices,
        colors: pyramid.colors,
      })
    )
    ecs.create().add(
      new Transform3D({ position: new Vec3(2, 0.7, 0) }),
      new Renderable3D({
        vertices: octahedron.vertices,
        colors: octahedron.colors,
      })
    )
    ecs
      .create()
      .add(
        new Transform3D({ position: new Vec3(4, 0.5, 0) }),
        new Renderable3D({ vertices: prism.vertices, colors: prism.colors })
      )
  },
})

new Game(scene).start()
