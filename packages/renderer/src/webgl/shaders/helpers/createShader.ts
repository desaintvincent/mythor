function createShader(
  gl: WebGL2RenderingContext,
  shaderSource: string,
  type: number
): WebGLShader {
  const shader = gl.createShader(type)

  if (!shader) {
    throw new Error('could not create shader')
  }
  let i = 0
  /* skip whitespace to avoid glsl compiler complaining about
      #version not being on the first line */
  while (/\s/.test(shaderSource[i])) i++
  shaderSource = shaderSource.slice(i)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compileStatus) {
    const errorMessage = gl.getShaderInfoLog(shader)

    gl.deleteShader(shader)
    throw new Error(`Could not compile shader:\n${errorMessage ?? 'unknown'}`)
  }

  return shader
}

export default createShader
