function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocPairs?: Array<[WebGLBuffer, WebGLUniformLocation | number]>
): WebGLVertexArrayObject {
  const vao = gl.createVertexArray()
  if (!vao) {
    throw new Error('could not create vao')
  }
  gl.bindVertexArray(vao)

  if (bufLocPairs) {
    for (const [buffer, location] of bufLocPairs) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(location as number)
      gl.vertexAttribPointer(
        location as number, // attribute location
        2, // number of elements
        gl.FLOAT, // type of data
        false, // normalize
        0, // stride (0 = auto)
        0 // offset
      )
    }
  }

  return vao
}

export default makeVertexArray
