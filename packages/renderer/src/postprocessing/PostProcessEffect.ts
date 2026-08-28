import { Vec2 } from '@mythor/math'
import createGLProgram from '../webgl/shaders/helpers/createGLProgram'
import makeVertexArray from '../webgl/shaders/helpers/makeVertexArray'
import makeBuffer from '../webgl/shaders/helpers/makeBuffer'
import fullscreenVertexShader from './glsl/fullscreen.vs'
import RenderTarget from './RenderTarget'

// two triangles covering the full NDC space [-1, 1]
const quadVertices = new Float32Array([
  -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
])

class PostProcessEffect {
  protected gl!: WebGL2RenderingContext
  private readonly fragmentShader: string
  private program!: WebGLProgram
  private vao!: WebGLVertexArrayObject
  private textureUniform!: WebGLUniformLocation
  private resolutionUniform: WebGLUniformLocation | null = null
  public enabled = true

  public constructor(fragmentShader: string) {
    this.fragmentShader = fragmentShader
  }

  public init(gl: WebGL2RenderingContext): void {
    this.gl = gl
    this.program = createGLProgram(
      gl,
      fullscreenVertexShader,
      this.fragmentShader
    )

    const positionLocation = gl.getAttribLocation(this.program, 'a_position')
    const buffer = makeBuffer(gl, quadVertices, gl.STATIC_DRAW)
    this.vao = makeVertexArray(gl, [[buffer, positionLocation]])

    this.textureUniform = this.getUniformLocation('u_texture')
    this.resolutionUniform = gl.getUniformLocation(this.program, 'u_resolution')

    this.onInit()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onInit(): void {
    // do nothing, override in subclasses to fetch uniform locations
  }

  protected getUniformLocation(name: string): WebGLUniformLocation {
    const location = this.gl.getUniformLocation(this.program, name)

    if (!location) {
      throw new Error(`Could not get uniform location: ${name}`)
    }

    return location
  }

  protected setUniforms(): void {
    // do nothing, override in subclasses
  }

  public apply(
    inputTexture: WebGLTexture,
    target: RenderTarget | null,
    resolution: Vec2
  ): void {
    const { gl } = this

    if (target) {
      target.bind()
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, resolution.x, resolution.y)
    }

    gl.disable(gl.BLEND)
    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, inputTexture)
    gl.uniform1i(this.textureUniform, 0)

    if (this.resolutionUniform) {
      gl.uniform2f(this.resolutionUniform, resolution.x, resolution.y)
    }

    this.setUniforms()

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}

export default PostProcessEffect
