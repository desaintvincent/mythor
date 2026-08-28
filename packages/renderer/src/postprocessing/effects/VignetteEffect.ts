import PostProcessEffect from '../PostProcessEffect'
import vignetteFragmentShader from '../glsl/vignette.fs'

interface VignetteEffectOptions {
  radius?: number
  softness?: number
  color?: [number, number, number, number]
}

class VignetteEffect extends PostProcessEffect {
  private radiusUniform!: WebGLUniformLocation
  private softnessUniform!: WebGLUniformLocation
  private colorUniform!: WebGLUniformLocation
  public radius: number
  public softness: number
  public color: [number, number, number, number]

  public constructor(options?: VignetteEffectOptions) {
    super(vignetteFragmentShader)
    this.radius = options?.radius ?? 0.5
    this.softness = options?.softness ?? 0.5
    this.color = options?.color ?? [0, 0, 0, 1]
  }

  protected onInit(): void {
    this.radiusUniform = this.getUniformLocation('u_radius')
    this.softnessUniform = this.getUniformLocation('u_softness')
    this.colorUniform = this.getUniformLocation('u_color')
  }

  protected setUniforms(): void {
    this.gl.uniform1f(this.radiusUniform, this.radius)
    this.gl.uniform1f(this.softnessUniform, this.softness)
    this.gl.uniform3f(
      this.colorUniform,
      this.color[0],
      this.color[1],
      this.color[2]
    )
  }
}

export default VignetteEffect
