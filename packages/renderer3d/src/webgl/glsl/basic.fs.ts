export default `#version 300 es
precision highp float;

in vec3 fragColorVarying;

out vec4 fragColor;

void main() {
  fragColor = vec4(fragColorVarying, 1.0);
}
`
