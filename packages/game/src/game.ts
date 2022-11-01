import { log } from '@mythor/core'
import { Vec2 } from '@mythor/math'

function game(): string {
  log('patate')
  const vec2 = Vec2.create(18)

  return vec2.toString()
}

export default game
