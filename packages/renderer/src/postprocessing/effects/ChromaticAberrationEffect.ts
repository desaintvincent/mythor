import PostProcessEffect from '../PostProcessEffect'
import chromaticAberrationFragmentShader from '../glsl/chromaticAberration.fs'

interface ChromaticAberrationEffectOptions {
  strength?: number
}

class ChromaticAberrationEffect extends PostProcessEffect {
  private strengthUniform!: WebGLUniformLocation
  public strength: number

  public constructor(options?: ChromaticAberrationEffectOptions) {
    super(chromaticAberrationFragmentShader)
    this.strength = options?.strength ?? 0.02
  }

  protected onInit(): void {
    this.strengthUniform = this.getUniformLocation('u_strength')
  }

  protected setUniforms(): void {
    this.gl.uniform1f(this.strengthUniform, this.strength)
  }
}

export default ChromaticAberrationEffect
