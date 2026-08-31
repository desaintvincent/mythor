import { AssetManager } from '@mythor/assets'
import { AudioManager, AudioSystem, AudioSource } from '@mythor/audio'
import { createGame } from '@mythor/game'
import { ButtonSystem, createButton } from '@mythor/ui'
import { Vec2 } from '@mythor/math'
import { Renderer } from '@mythor/renderer'
import click from '../../assets/audio/click.wav'
import showDescription from '../../util/showDescription'

showDescription(
  'Load a sound and play it once per click, using `AudioSource`.',
  ['Click the button to play the sound']
)

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new AssetManager(), new AudioManager()],
  systems: [new Renderer(), new ButtonSystem(), new AudioSystem()],
  onInit: async (ecs) => {
    await ecs
      .manager(AssetManager)
      .load([{ key: 'click', type: 'audio', src: click }])
    await ecs.manager(AudioManager).decode('click')

    const audioSource = new AudioSource({ key: 'click' })

    ecs.create().add(
      audioSource,
      ...createButton({
        label: 'Play sound',
        radius: 10,
        size: Vec2.create(200, 50),
        position: Vec2.create(512, 256),
        onClick: () => audioSource.play(),
      })
    )
  },
})
