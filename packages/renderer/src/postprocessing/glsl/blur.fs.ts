export default `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_strength;

out vec4 outColor;

void main() {
    vec2 texel = (1.0 / u_resolution) * u_strength;

    vec4 sum = vec4(0.0);
    sum += texture(u_texture, v_uv + texel * vec2(-1.0, -1.0));
    sum += texture(u_texture, v_uv + texel * vec2(0.0, -1.0));
    sum += texture(u_texture, v_uv + texel * vec2(1.0, -1.0));
    sum += texture(u_texture, v_uv + texel * vec2(-1.0, 0.0));
    sum += texture(u_texture, v_uv);
    sum += texture(u_texture, v_uv + texel * vec2(1.0, 0.0));
    sum += texture(u_texture, v_uv + texel * vec2(-1.0, 1.0));
    sum += texture(u_texture, v_uv + texel * vec2(0.0, 1.0));
    sum += texture(u_texture, v_uv + texel * vec2(1.0, 1.0));

    outColor = sum / 9.0;
}
`
