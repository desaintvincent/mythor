export type TextureSource = TexImageSource

export interface LoadTextureOptions {
  flipY?: boolean
  minFilter?: GLenum
  magFilter?: GLenum
}

function loadTexture(
  gl: WebGL2RenderingContext,
  source: TextureSource,
  options?: LoadTextureOptions
): WebGLTexture {
  const texture = gl.createTexture()

  if (!texture) {
    throw new Error('Could not create texture')
  }

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options?.flipY ?? false)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    options?.minFilter ?? gl.LINEAR
  )
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    options?.magFilter ?? gl.LINEAR
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  return texture
}

export default loadTexture
