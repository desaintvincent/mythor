import { NetworkManager } from '@mythor/net'
import { createGame } from '@mythor/game'
import { Color, colorRed, colorGreen, Renderer } from '@mythor/renderer'
import showDescription from '../../util/showDescription'

/**
 * Demonstrates `NetworkManager` on its own: connecting to a WebSocket
 * server and reacting to connection state changes. No game entities are
 * involved yet — see `2--prediction.ts` and `3--interpolation.ts` for
 * examples that actually replicate entities.
 */
showDescription(
  'NetworkManager connection lifecycle. This example requires a local ' +
    'server: run `yarn workspace @mythor/examples run server:net-connection` ' +
    'in a separate terminal (after `yarn build`), then reload this page.',
  ['Watch the text below the canvas to see the connection state change']
)

const stateLabel = document.createElement('p')
stateLabel.style.fontWeight = 'bold'
document.getElementById('canvas')?.after(stateLabel)

function renderState(state: string) {
  stateLabel.innerText = `Connection state: ${state}`
  stateLabel.style.color =
    state === 'open' ? colorToCss(colorGreen) : colorToCss(colorRed)
}

function colorToCss(color: Color): string {
  const [r, g, b] = color

  return `rgb(${r * 255}, ${g * 255}, ${b * 255})`
}

createGame({
  addStatisticsManager: false,
  addPhysicDebugManager: false,
  addSelectDebugManager: false,
  addRendererDebugManager: false,
  managers: [new NetworkManager()],
  systems: [new Renderer()],
  onInit: async (ecs) => {
    const networkManager = ecs.manager(NetworkManager)

    renderState(networkManager.state)
    networkManager.onStateChange(renderState)
    networkManager.connect('ws://localhost:8081')
  },
})
