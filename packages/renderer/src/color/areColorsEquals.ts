import Color from './Color'

const areColorsEquals = (color1: Color, color2: Color): boolean =>
  color1[0] === color2[0] &&
  color1[1] === color2[1] &&
  color1[2] === color2[2] &&
  color1[3] === color2[3]

export default areColorsEquals
