import { Component, Ecs, Entity, Manager } from '@mythor/core'
import { Key, EventsManager } from '@mythor/events'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import { Renderer } from '@mythor/renderer'
import { SaveManager, Serializable } from '@mythor/persistence'
import showDescription from '../../util/showDescription'

showDescription(
  'Persist a small world: several entity kinds, nested arrays and ' +
    'numeric stats, all restored together with @mythor/persistence.',
  [
    'Arrows: move the player',
    'Space: spawn an enemy',
    'P: pick up a random item',
    'D: damage the nearest enemy (destroyed at 0 HP)',
    'H: heal the player',
    'S: save to slot "world"',
    'L: load slot "world"',
  ]
)

interface PositionData {
  x: number
  y: number
}

class Position extends Component implements Serializable<PositionData> {
  public x: number
  public y: number

  public constructor(x = 0, y = 0) {
    super()
    this.x = x
    this.y = y
  }

  public serialize(): PositionData {
    return { x: this.x, y: this.y }
  }
}

interface HealthData {
  current: number
  max: number
}

class Health extends Component implements Serializable<HealthData> {
  public current: number
  public max: number

  public constructor(current = 100, max = 100) {
    super()
    this.current = current
    this.max = max
  }

  public serialize(): HealthData {
    return { current: this.current, max: this.max }
  }
}

interface InventoryData {
  items: string[]
}

// Demonstrates persisting a nested array, not just flat scalar fields.
class Inventory extends Component implements Serializable<InventoryData> {
  public items: string[]

  public constructor(items: string[] = []) {
    super()
    this.items = items
  }

  public serialize(): InventoryData {
    return { items: [...this.items] }
  }
}

// Empty marker component used to tell enemy entities apart from the player
// when iterating the ecs after a load (entity ids alone aren't semantic).
class Enemy extends Component implements Serializable<Record<string, never>> {
  public serialize(): Record<string, never> {
    return {}
  }
}

const SLOT = 'world'
const ITEMS = ['sword', 'shield', 'potion', 'gem', 'key']
const MOVE_SPEED = 4

function distance(a: Position, b: Position): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

class World extends Manager {
  private enemyCount = 0

  public constructor() {
    super('World')
  }

  public async init(ecs: Ecs): Promise<void> {
    await super.init(ecs)

    const saveManager = this.ecs.manager(SaveManager)
    saveManager.registerComponent(Position, (data) => {
      const position = data as PositionData

      return new Position(position.x, position.y)
    })
    saveManager.registerComponent(Health, (data) => {
      const health = data as HealthData

      return new Health(health.current, health.max)
    })
    saveManager.registerComponent(
      Inventory,
      (data) => new Inventory((data as InventoryData).items)
    )
    saveManager.registerComponent(Enemy, () => new Enemy())

    this.ecs
      .create('player')
      .add(new Position(0, 0), new Health(), new Inventory())
  }

  private player(): Entity | undefined {
    return this.ecs.entity('player')
  }

  private enemies(): Entity[] {
    return Array.from(this.ecs.entities.values()).filter((entity) =>
      entity.has(Enemy)
    )
  }

  private nearestEnemy(from: Position): Entity | undefined {
    return this.enemies().sort(
      (a, b) =>
        distance(a.get(Position), from) - distance(b.get(Position), from)
    )[0]
  }

  private spawnEnemy(): void {
    const id = `enemy-${this.enemyCount++}`
    const x = Math.round((Math.random() - 0.5) * 400)
    const y = Math.round((Math.random() - 0.5) * 300)

    this.ecs.create(id).add(new Position(x, y), new Health(30, 30), new Enemy())
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)
    const player = this.player()
    const position = player?.get(Position)
    const health = player?.get(Health)
    const inventory = player?.get(Inventory)

    if (position) {
      if (events.keyPressed(Key.ArrowLeft)) {
        position.x -= MOVE_SPEED
      }
      if (events.keyPressed(Key.ArrowRight)) {
        position.x += MOVE_SPEED
      }
      if (events.keyPressed(Key.ArrowUp)) {
        position.y -= MOVE_SPEED
      }
      if (events.keyPressed(Key.ArrowDown)) {
        position.y += MOVE_SPEED
      }
    }

    if (events.keyPressed(Key.Space)) {
      this.spawnEnemy()
    }
    if (events.keyPressed(Key.p) && inventory) {
      inventory.items.push(ITEMS[Math.floor(Math.random() * ITEMS.length)])
    }
    if (events.keyPressed(Key.h) && health) {
      health.current = Math.min(health.max, health.current + 10)
    }
    if (events.keyPressed(Key.d) && position) {
      const target = this.nearestEnemy(position)
      if (target) {
        const targetHealth = target.get(Health)
        targetHealth.current -= 10
        if (targetHealth.current <= 0) {
          target.destroy()
        }
      }
    }
    if (events.keyPressed(Key.s)) {
      void this.ecs.manager(SaveManager).save(SLOT)
    }
    if (events.keyPressed(Key.l)) {
      void this.ecs.manager(SaveManager).load(SLOT)
    }

    this.draw()
  }

  private draw(): void {
    const player = this.player()
    const position = player?.get(Position)
    const health = player?.get(Health)
    const inventory = player?.get(Inventory)
    const enemies = this.enemies()

    const lines = [
      `Player @ (${position?.x ?? 0}, ${position?.y ?? 0}) ` +
        `HP ${health?.current ?? 0}/${health?.max ?? 0}`,
      `Inventory (${inventory?.items.length ?? 0}): ` +
        `${inventory?.items.join(', ') ?? ''}`,
      `Enemies: ${enemies.length}`,
      ...enemies.map((enemy) => {
        const enemyPosition = enemy.get(Position)
        const enemyHealth = enemy.get(Health)

        return (
          `  ${enemy._id} @ (${enemyPosition.x}, ${enemyPosition.y}) ` +
          `HP ${enemyHealth.current}/${enemyHealth.max}`
        )
      }),
    ]

    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.text(new Vec2(-350, 200), lines.join('\n'), {
        color: [1, 1, 1, 1],
      })

      // Draw shapes for the player/enemies so the persisted state is
      // visible even if text rendering is unavailable in the environment.
      if (position) {
        renderer.fillCircle(
          new Vec2(position.x, position.y),
          new Vec2(16, 16),
          {
            color: [0.2, 0.6, 1, 1],
          }
        )
      }
      enemies.forEach((enemy) => {
        const enemyPosition = enemy.get(Position)

        renderer.fillCircle(
          new Vec2(enemyPosition.x, enemyPosition.y),
          new Vec2(10, 10),
          { color: [1, 0.2, 0.2, 1] }
        )
      })
    })
  }
}

createGame({
  managers: [new SaveManager(), new World()],
  systems: [new Renderer()],
})
