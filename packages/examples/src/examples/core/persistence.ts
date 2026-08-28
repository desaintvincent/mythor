import { Component, Ecs, Manager } from '@mythor/core'
import { Key, EventsManager } from '@mythor/events'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import { Renderer } from '@mythor/renderer'
import { SaveManager, Serializable } from '@mythor/persistence'
import showDescription from '../../util/showDescription'

showDescription('Save/load ECS state with @mythor/persistence.', [
  'Space: earn a coin',
  'S: save to slot "example"',
  'L: load from slot "example"',
])

interface CoinsData {
  amount: number
}

// A component opts into persistence by implementing Serializable: only
// components implementing it are included when SaveManager.save() runs.
class Coins extends Component implements Serializable<CoinsData> {
  public amount: number

  public constructor(amount = 0) {
    super()
    this.amount = amount
  }

  public serialize(): CoinsData {
    return { amount: this.amount }
  }
}

const SLOT = 'example'

class CoinsDisplay extends Manager {
  public constructor() {
    super('CoinsDisplay')
  }

  public async init(ecs: Ecs): Promise<void> {
    await super.init(ecs)

    this.ecs
      .manager(SaveManager)
      .registerComponent(Coins, (data) => new Coins((data as CoinsData).amount))
    this.ecs.create('player').add(new Coins())
  }

  private get coins(): Coins {
    return this.ecs.entity('player')?.get(Coins) as Coins
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)

    if (events.keyPressed(Key.Space)) {
      this.coins.amount++
    }
    if (events.keyPressed(Key.s)) {
      void this.ecs.manager(SaveManager).save(SLOT)
    }
    if (events.keyPressed(Key.l)) {
      void this.ecs.manager(SaveManager).load(SLOT)
    }

    this.ecs.system(Renderer).onDraw((renderer) => {
      renderer.text(new Vec2(0, 0), `Coins: ${this.coins.amount}`, {
        color: [1, 1, 1, 1],
      })

      // Draw one square per coin so the saved/loaded state is visible even
      // if text rendering is unavailable in the current environment.
      const coinCount = this.coins.amount
      for (let i = 0; i < coinCount; i++) {
        renderer.fillRect(
          new Vec2(-150 + (i % 10) * 30, 40 + Math.floor(i / 10) * 30),
          new Vec2(20, 20),
          { color: [1, 0.85, 0, 1] }
        )
      }
    })
  }
}

createGame({
  managers: [new SaveManager(), new CoinsDisplay()],
  systems: [new Renderer()],
})
