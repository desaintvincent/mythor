import { Component, Entity, Manager, System, Transform } from '@mythor/core'
import { EventsManager, MouseButton } from '@mythor/events'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import {
  Renderable,
  Renderer,
  TextureManager,
  TimingFunction,
} from '@mythor/renderer'
import ParticleEmitter from '@mythor/renderer/lib/components/ParticleEmitter'
import cat from '../assets/cat'
import star from '../assets/star_07.png'

class Player extends Component {}

class SpawnParticles extends Manager {
  public constructor() {
    super('SpawnParticles')
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)
    const textures = this.ecs.manager(TextureManager)
    if (events.mousePressed(MouseButton.Left)) {
      this.ecs.create().add(
        new Renderable(),
        new ParticleEmitter(30, {
          color: {
            end: [1, 1, 1, 0.5],
            start: [1, 1, 1, 1],
            timing: TimingFunction.SMOOTH_OUT,
          },
          deleteOnEndOfLife: true,
          frequency: Infinity,
          rotation: {
            max: Math.PI,
            min: -Math.PI,
          },
          size: Vec2.create(30, 30),
          speed: {
            max: 150,
            min: 100,
          },
          texture: textures.get('star'),
          torque: {
            max: 10,
            min: -10,
          },
        }),
        new Transform({
          position: events.mousePosition(),
          size: Vec2.create(30, 30),
        })
      )
    }
  }
}

class MovePlayer extends System {
  public constructor() {
    super('movePlayer', [Player, Transform], { managers: [EventsManager] })
  }

  protected onEntityUpdate(entity: Entity, elapsedTimeInSeconds: number): void {
    const events = this.ecs.manager(EventsManager)
    const { position: emitterPos } = entity.get(Transform)

    const pointer = events.mousePosition()

    const sharpness = 0.975
    const minDelta = 0.05

    const dt = 1 - Math.pow(1 - sharpness, elapsedTimeInSeconds)
    const dx = pointer.x - emitterPos.x
    const dy = pointer.y - emitterPos.y

    if (Math.abs(dx) > minDelta) {
      emitterPos.x += dx * dt
    } else {
      emitterPos.x = pointer.x
    }

    if (Math.abs(dy) > minDelta) {
      emitterPos.y += dy * dt
    } else {
      emitterPos.y = pointer.y
    }
  }
}

createGame({
  managers: [
    new SpawnParticles(),
    new TextureManager([
      ['star', star],
      ['cat', cat],
    ]),
  ],
  onInit: async (ecs) => {
    const textures = ecs.manager(TextureManager)
    ecs.create().add(
      new Renderable({ visible: true }),
      new Transform({
        position: Vec2.create(18, 53),
      }),
      new ParticleEmitter(10000, {
        color: {
          end: [1, 1, 1, 0.0],
          start: [1, 1, 1, 1],
          timing: [0, 1, 0, 1],
        },
        gravity: Vec2.create(0, -50),
        lifeTime: {
          max: 2.15,
          min: 2,
        },
        respawn: true,
        size: {
          max: Vec2.create(50, 50),
          min: Vec2.create(10, 10),
        },
        speed: {
          max: 300,
          min: 250,
        },
        texture: textures.get('cat'),
        textureOrigin: () => Vec2.create(0, Math.floor(Math.random() * 4) / 4),
        textureSize: Vec2.create(1, 1 / 4),
        theta: {
          max: -Math.PI / 2 + 0.5,
          min: -Math.PI / 2 - 0.5,
        },
        torque: {
          max: 10,
          min: -10,
        },
      })
    )

    ecs.create().add(
      new Renderable({ visible: true }),
      new Player(),
      new Transform({
        position: Vec2.create(18, 53),
      }),
      new ParticleEmitter(5000, {
        color: {
          end: [0.13, 0.6, 1, 0.15],
          start: [0.9, 1, 1, 1],
        },
        lifeTime: {
          max: 0.65,
          min: 0.55,
        },
        respawn: true,
        size: {
          max: Vec2.create(0, 0),
          min: Vec2.create(20, 20),
        },
        speed: 0,
      })
    )
  },
  systems: [new Renderer(), new MovePlayer()],
})
