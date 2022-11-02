import createShader from './createShader'

function createGLProgram(
  gl: WebGL2RenderingContext,
  vertexShader: string,
  fragmentShader: string,
  transformFeedbackVaryings?: string[]
): WebGLProgram {
  const program = gl.createProgram()

  if (!program) {
    throw new Error('Could not create program')
  }
  gl.attachShader(program, createShader(gl, vertexShader, gl.VERTEX_SHADER))
  gl.attachShader(program, createShader(gl, fragmentShader, gl.FRAGMENT_SHADER))

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(
      program,
      transformFeedbackVaryings,
      gl.SEPARATE_ATTRIBS
    )
  }

  gl.linkProgram(program)
  const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)

  if (!linkStatus) {
    const errorMessage = gl.getProgramInfoLog(program)
    throw new Error(`Could not link program.\n${errorMessage ?? 'unknown'}`)
  }

  return program
}

export default createGLProgram
