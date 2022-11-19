import Movement from './Movement'
import { Key } from '@mythor/events'
import { Component } from '@mythor/core'

class EventControls extends Component {
  public keys: Record<Movement, Key>

  public constructor(keys?: Partial<Record<Movement, Key>>) {
    super()
    this.keys = {
      [Movement.LEFT]: keys?.[Movement.LEFT] ?? Key.ArrowLeft,
      [Movement.RIGHT]: keys?.[Movement.RIGHT] ?? Key.ArrowRight,
      [Movement.JUMP]: keys?.[Movement.JUMP] ?? Key.Space,
    }
  }
}

export default EventControls
