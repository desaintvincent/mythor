import rgba from './rgba'
import Color from './Color'

const rgb = (r: number, g: number, b: number): Color => rgba(r, g, b, 1)

export default rgb
