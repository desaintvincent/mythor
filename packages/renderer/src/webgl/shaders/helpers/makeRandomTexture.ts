const randomRGData = (sizeX: number, sizeY: number): Uint8Array => {
  const d = []
  for (let i = 0; i < sizeX * sizeY; ++i) {
    d.push(Math.random() * 255.0)
    d.push(Math.random() * 255.0)
  }

  return new Uint8Array(d)
}

const makeRandomTexture = (
  gl: WebGL2RenderingContext,
  width: number,
  height: number
): WebGLTexture => {
  const randomTexture = gl.createTexture()

  if (!randomTexture) {
    throw new Error('Could not create texture')
  }

  gl.bindTexture(gl.TEXTURE_2D, randomTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RG8,
    width,
    height,
    0,
    gl.RG,
    gl.UNSIGNED_BYTE,
    randomRGData(width, height)
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  return randomTexture
}

export default makeRandomTexture
