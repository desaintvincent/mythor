import { Component } from '@mythor/core'
import Movement from './Movement'

class PlatformerMovements extends Component {
  public movements: Record<Movement, boolean> = {
    [Movement.LEFT]: false,
    [Movement.RIGHT]: false,
    [Movement.JUMP]: false,
  }
}

export default PlatformerMovements
