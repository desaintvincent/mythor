import { Vec2 } from "@mythor/math"

export default class Texture {
  private readonly source: HTMLImageElement | HTMLCanvasElement
  private readonly alphaTest: number
  private readonly smooth: boolean
  public readonly size: Vec2
  private readonly glTexture: WebGLTexture = 0

  public constructor (source: HTMLImageElement | HTMLCanvasElement, gl: WebGL2RenderingContext, alphaTest = 0, smooth = true) {
    this.source = source
    this.alphaTest = alphaTest
    this.smooth = smooth
    this.size = Vec2.zero()

    const glTexture = gl.createTexture()
    if (!glTexture) {
      throw new Error('Could not create gl texture')
    }

    this.glTexture = glTexture

    gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    if (source instanceof HTMLImageElement) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.source.width, this.source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.source)
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.source)
    }

    this.size.x = this.source.width
    this.size.y = this.source.height
  }

  public get webGLTexture (): WebGLTexture {
    return this.glTexture
  }
}
