export default `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform float u_intensity;

out vec4 outColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(luminance);

    outColor = vec4(mix(color.rgb, grayscale, u_intensity), color.a);
}
`
