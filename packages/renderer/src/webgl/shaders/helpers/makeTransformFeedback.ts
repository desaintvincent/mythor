const makeTransformFeedback = (
  gl: WebGL2RenderingContext
): WebGLTransformFeedback => {
  const transformFeedback = gl.createTransformFeedback()
  if (!transformFeedback) {
    throw new Error('Could not create transform feedback')
  }

  return transformFeedback
}

export default makeTransformFeedback
