export default `#version 300 es
in vec3 position;

uniform mat4 modelMatrix;
uniform mat4 viewProjectionMatrix;

void main() {
  gl_Position = viewProjectionMatrix * modelMatrix * vec4(position, 1.0);
}
`
