import { Component } from '@mythor/core'

class PlatformerSensors extends Component {
  public onGround: boolean
  public onTop: boolean
  public onLeft: boolean
  public onRight: boolean

  public constructor() {
    super()
    this.onGround = false
    this.onTop = false
    this.onLeft = false
    this.onRight = false
  }
}

export default PlatformerSensors
