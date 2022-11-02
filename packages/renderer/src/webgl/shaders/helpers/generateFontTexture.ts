import { loadTexture } from '../../../managers/TextureManager'
import Font, { Glyph } from '../../../toRename/Font'

const generateChars = (): string => {
  const startAscii = 33 // 32 is space
  const endAscii = 255

  const allCharCodes = []
  for (let i = startAscii; i <= endAscii; i++) {
    allCharCodes.push(i)
  }

  return String.fromCharCode(...allCharCodes)
}

async function generateFontTexture(
  gl: WebGL2RenderingContext,
  { fontName = 'monospace', fontSize = 100, fontScale = 0.2 } = {}
): Promise<Font> {
  const canvas = document.createElement('canvas')
  const textCtx = canvas.getContext('2d')
  const text = generateChars()
  const width = fontSize * text.length
  const height = fontSize
  if (!textCtx) {
    throw new Error('Could not get context')
  }
  textCtx.canvas.width = width
  textCtx.canvas.height = height
  textCtx.font = `${fontSize}px ${fontName}`
  textCtx.textAlign = 'left'
  textCtx.textBaseline = 'top'
  textCtx.fillStyle = 'white'

  const size = textCtx.measureText(text)
  textCtx.canvas.width = size.width

  textCtx.font = `${fontSize}px monospace`
  textCtx.textAlign = 'left'
  textCtx.textBaseline = 'top'
  textCtx.fillStyle = 'white'

  textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height)

  let x = 0
  let i = 0
  const glyphs: Record<string, Glyph> = {}
  while (i < text.length) {
    const char = text.charAt(i)
    const charSize = Math.round(textCtx.measureText(char).width)
    glyphs[char] = { width: charSize, x, y: 0 }
    textCtx.fillText(char, x, 0)
    x += charSize
    i++
  }

  const url = canvas.toDataURL('image/png')

  return await loadTexture('defaultFont', url, gl, { log: false }).then(
    (texture) =>
      new Font(texture, {
        glyphs,
        letterHeight: fontSize,
        scale: fontScale,
        spaceWidth: fontSize,
      })
  )
}

export default generateFontTexture
