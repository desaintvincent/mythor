import Color from './Color'
import rgb from './rgb'

const hex = (color: string): Color => {
  const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  if (!parsed) {
    throw new Error(`Could not parse "${color}" to hexa`)
  }
  const r = parseInt(parsed[1], 16)
  const g = parseInt(parsed[2], 16)
  const b = parseInt(parsed[3], 16)

  return rgb(r, g, b)
}

export default hex
