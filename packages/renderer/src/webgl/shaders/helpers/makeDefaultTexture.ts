import Texture from '../../../objects/Texture'

const makeDefaultTexture = (
  gl: WebGL2RenderingContext,
  resolution = 20
): Texture => {
  let r1 = 0
  let r2 = 8
  const c = (r2 + 1) * resolution
  r1 *= resolution
  r2 *= resolution

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('could not create context')
  }
  canvas.width = canvas.height = c * 2

  const gradient = context.createRadialGradient(c, c, r1, c, c, r2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  return new Texture(canvas, gl)
}

export default makeDefaultTexture
