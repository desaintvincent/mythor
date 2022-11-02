import Texture from './Texture'

export interface Glyph {
  x: number
  y: number
  width: number
}

interface FontOptions {
  glyphs?: Record<string, Glyph>
  letterHeight?: number
  spaceWidth?: number
  scale?: number
  spacing?: number
}

export default class Font {
  public letterHeight: number
  public spaceWidth: number
  public spacing: number
  public scale: number
  public glyphInfos: Map<string, Glyph>
  public texture: Texture

  public constructor (texture: Texture, options?: FontOptions) {
    this.letterHeight = options?.letterHeight ?? 8
    this.spaceWidth = options?.spaceWidth ?? 8
    this.spacing = options?.spacing ?? -1
    this.scale = options?.scale ?? 1
    this.texture = texture
    this.glyphInfos = new Map<string, Glyph>()
    if (options?.glyphs) {
      Object.entries(options.glyphs).forEach(([key, glyph]) => {
        this.glyphInfos.set(key, glyph)
      })
    }
  }

  public getGlyph (char: string): Glyph | undefined {
    return this.glyphInfos.get(char)
  }
}
