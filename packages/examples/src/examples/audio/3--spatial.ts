import { AssetManager } from '@mythor/assets'
import {
  AudioListener,
  AudioManager,
  AudioSource,
  AudioSystem,
} from '@mythor/audio'
import { Manager, Transform } from '@mythor/core'
import { EventsManager } from '@mythor/events'
import { createGame } from '@mythor/game'
import { Vec2 } from '@mythor/math'
import { FillRect, Renderable, Renderer, colorRed } from '@mythor/renderer'

import ping from '../../assets/audio/ping.wav'
import showDescription from '../../util/showDescription'

showDescription(
  'A spatial `AudioSource` (red square) heard by an `AudioListener` that follows the mouse.',
  [
    'Move the mouse closer to the square to hear it get louder and pan left/right',
  ]
)

class ListenerFollowsMouseManager extends Manager {
  public constructor() {
    super('ListenerFollowsMouseManager')
  }

  public update(): void {
    const mousePosition = this.ecs.manager(EventsManager).mousePosition()

    this.ecs.entities.forEach((entity) => {
      if (entity.has(AudioListener) && entity.has(Transform)) {
        entity.get(Transform).position.vSet(mousePosition)
      }
    })
  }
}

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [
    new AssetManager(),
    new AudioManager(),
    new ListenerFollowsMouseManager(),
  ],
  systems: [new Renderer(), new AudioSystem()],
  onInit: async (ecs) => {
    await ecs
      .manager(AssetManager)
      .load([{ key: 'ping', type: 'audio', src: ping }])
    await ecs.manager(AudioManager).decode('ping')

    ecs
      .create()
      .add(new Transform({ position: Vec2.zero() }), new AudioListener())

    ecs.create().add(
      new Transform({
        position: Vec2.create(0, 0),
        size: Vec2.create(40, 40),
      }),
      new Renderable(),
      new FillRect({ color: colorRed, size: Vec2.create(40, 40) }),
      new AudioSource({
        key: 'ping',
        spatial: true,
        loop: true,
        autoplay: true,
        maxDistance: 400,
      })
    )
  },
})
