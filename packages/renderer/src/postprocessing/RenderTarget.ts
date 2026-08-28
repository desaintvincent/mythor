import { Vec2 } from '@mythor/math'

class RenderTarget {
  private readonly gl: WebGL2RenderingContext
  public readonly framebuffer: WebGLFramebuffer
  public readonly texture: WebGLTexture
  private size: Vec2

  public constructor(gl: WebGL2RenderingContext, size: Vec2) {
    this.gl = gl
    this.size = size

    const texture = gl.createTexture()
    if (!texture) {
      throw new Error('could not create texture')
    }
    this.texture = texture

    const framebuffer = gl.createFramebuffer()
    if (!framebuffer) {
      throw new Error('could not create framebuffer')
    }
    this.framebuffer = framebuffer

    this.allocate()

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    )
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  private allocate(): void {
    const { gl, texture, size } = this

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      size.x,
      size.y,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  public getSize(): Vec2 {
    return this.size
  }

  public bind(): void {
    const { gl, size } = this
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, size.x, size.y)
  }
}

export default RenderTarget
