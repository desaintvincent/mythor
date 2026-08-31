export default `#version 300 es
in vec3 position;
in vec3 vertexColor;

uniform mat4 modelMatrix;
uniform mat4 viewProjectionMatrix;

out vec3 fragColorVarying;

void main() {
  fragColorVarying = vertexColor;
  gl_Position = viewProjectionMatrix * modelMatrix * vec4(position, 1.0);
}
`
