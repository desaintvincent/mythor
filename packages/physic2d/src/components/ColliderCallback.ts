import { Contact } from 'planck-js'
import { Component, Entity } from '@mythor/core'
import { Vec2 } from '@mythor/math'

type CallbackFunction = (
  entity: Entity,
  otherEntity: Entity,
  contact: Contact,
  contactPosition?: Vec2
) => void

interface ColliderCallbackOptions {
  disableContact?: boolean
  sticky?: boolean
  deleteOnContact?: boolean
  callback?: CallbackFunction
}

export default class ColliderCallback extends Component {
  private readonly cb?: CallbackFunction
  public readonly disableContact: boolean
  public readonly sticky: boolean
  public readonly deleteOnContact: boolean

  public constructor(options?: ColliderCallbackOptions) {
    super()
    this.cb = options?.callback
    this.disableContact = options?.disableContact ?? false
    this.sticky = options?.sticky ?? false
    this.deleteOnContact = options?.deleteOnContact ?? false
  }

  public callback(
    otherEntity: Entity,
    contact: Contact,
    contactPosition?: Vec2
  ): void {
    this.cb?.(this._entity, otherEntity, contact, contactPosition)
  }
}
