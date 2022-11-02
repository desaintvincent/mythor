import Sprite from './Sprite'
import Font from '../../toRename/Font'
import RenderedText from '../../components/RenderedText'
import generateFontTexture from './helpers/generateFontTexture'
import { Entity, Transform } from '@mythor/core'
import { Vec2 } from '@mythor/math'
import Color, { colorWhite } from '../../color/Color'
import { UniformType } from './Shader'

export default class Text extends Sprite {
  private currentFont?: Font

  public constructor(gl: WebGL2RenderingContext) {
    super(gl, RenderedText)
  }

  public async init(): Promise<void> {
    if (this.currentFont) {
      return
    }

    this.currentFont = await generateFontTexture(this.gl)
  }

  public render(entity: Entity): void {
    if (!entity.has(RenderedText)) {
      return
    }

    const text = entity.get(RenderedText)
    const { position } = entity.get(Transform)

    this.text(position.add(text.offset), text.str, {
      color: text.color,
      font: text.font,
    })
  }

  public text(
    position: Vec2,
    text: string,
    options?: { color?: Color; font?: Font; size?: number }
  ): void {
    const size = options?.size ?? 1
    const font = options?.font ?? this.currentFont
    if (!font) {
      throw new Error('Could not draw text without font')
    }

    const color = options?.color ?? colorWhite
    const currentPosition = Vec2.create(position.x, position.y)
    for (let i = 0; i < text.length; ++i) {
      const letter = text[i]

      if (letter === '\n') {
        currentPosition.x = position.x
        currentPosition.y += font.letterHeight * font.scale * size
        continue
      }

      const glyphInfo = font.getGlyph(letter)

      if (!glyphInfo) {
        currentPosition.x += font.spaceWidth * font.scale * size
        continue
      }

      this.drawLetter(letter, currentPosition, { color, font, size })
      currentPosition.x += (glyphInfo.width + font.spacing) * font.scale * size
    }
  }

  public lineHeight(): number {
    if (!this.currentFont) {
      return 0
    }

    return this.currentFont.scale * this.currentFont.letterHeight
  }

  protected drawLetter(
    letter: string,
    position: Vec2,
    { color, font, size = 1 }: { color: Color; font: Font; size?: number }
  ): void {
    if (
      this.currentFont?.texture?.webGLTexture !== font.texture?.webGLTexture
    ) {
      this.flush()
      this.currentFont = font
    }

    const glyphInfo = font.getGlyph(letter)
    if (!glyphInfo || !font.texture) {
      return
    }

    const maxX = font.texture.size.x

    this.pushVertex({
      a_color: color,
      a_position: position.array(),
      a_rotation: [0],
      a_scale: [font.scale, font.scale],
      a_size: [glyphInfo.width * size, font.letterHeight * size],
      a_texture_origin: [glyphInfo.x / maxX, 0],
      a_texture_size: [glyphInfo.width / maxX, 1],
    })
  }

  protected beforeDraw(): void {
    this.setUniform(
      'u_texture',
      UniformType.TEXTURE,
      this.currentFont?.texture?.webGLTexture
    )
  }

  protected shouldDraw(): boolean {
    return this.elemNumber > 0 && this.currentFont?.texture !== null
  }
}
