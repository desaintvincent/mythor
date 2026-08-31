import { AssetManager } from '@mythor/assets'
import {
  AudioChannels,
  AudioManager,
  AudioSource,
  AudioSystem,
} from '@mythor/audio'
import { createGame } from '@mythor/game'
import { ButtonSystem, createButton } from '@mythor/ui'
import { Renderer } from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import { Transform } from '@mythor/core'

import musicLoop from '../../assets/audio/music-loop.wav'
import ping from '../../assets/audio/ping.wav'
import showDescription from '../../util/showDescription'

// Music: "Fluffing a Duck" by Kevin MacLeod (incompetech.com)
// Licensed under Creative Commons: By Attribution 4.0 License
// http://creativecommons.org/licenses/by/4.0/

showDescription(
  'Two channels playing at once: a looping music track and a one-shot sfx, each with its own volume.',
  [
    '"Ping" plays a one-shot sound on the sfx channel',
    '"Music -" / "Music +" adjust the music channel volume',
  ]
)

const center = Vec2.create(512, 256)

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new AssetManager(), new AudioManager()],
  systems: [new Renderer(), new ButtonSystem(), new AudioSystem()],
  onInit: async (ecs) => {
    await ecs.manager(AssetManager).load([
      { key: 'music', type: 'audio', src: musicLoop },
      { key: 'ping', type: 'audio', src: ping },
    ])

    const audioManager = ecs.manager(AudioManager)
    await audioManager.decode('music')
    await audioManager.decode('ping')

    const music = new AudioSource({
      key: 'music',
      channel: AudioChannels.Music,
      loop: true,
      autoplay: true,
    })

    ecs.create().add(new Transform(), music)

    const sfx = new AudioSource({ key: 'ping', channel: AudioChannels.Sfx })

    ecs.create().add(
      sfx,
      ...createButton({
        radius: 10,
        label: 'Ping',
        position: Vec2.add(center, Vec2.create(0, -80)),
        onClick: () => sfx.play(),
      })
    )

    ecs.create().add(
      ...createButton({
        label: 'Music -',
        radius: 10,
        position: Vec2.add(center, Vec2.create(-90, 0)),
        size: Vec2.create(120, 50),
        onClick: () => {
          audioManager.setChannelVolume(
            AudioChannels.Music,
            Math.max(
              0,
              audioManager.getChannelVolume(AudioChannels.Music) - 0.2
            )
          )
        },
      })
    )

    ecs.create().add(
      ...createButton({
        label: 'Music +',
        radius: 10,
        position: Vec2.add(center, Vec2.create(90, 0)),
        size: Vec2.create(120, 50),
        onClick: () => {
          audioManager.setChannelVolume(
            AudioChannels.Music,
            Math.min(
              1,
              audioManager.getChannelVolume(AudioChannels.Music) + 0.2
            )
          )
        },
      })
    )
  },
})
