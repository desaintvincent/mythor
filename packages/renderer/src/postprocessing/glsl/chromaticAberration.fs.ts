export default `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform float u_strength;

out vec4 outColor;

void main() {
    vec2 direction = v_uv - vec2(0.5);
    vec2 offset = direction * u_strength;

    float r = texture(u_texture, v_uv - offset).r;
    float g = texture(u_texture, v_uv).g;
    float b = texture(u_texture, v_uv + offset).b;
    float a = texture(u_texture, v_uv).a;

    outColor = vec4(r, g, b, a);
}
`
