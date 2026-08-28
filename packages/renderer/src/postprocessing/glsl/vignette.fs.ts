export default `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform float u_radius;
uniform float u_softness;
uniform vec3 u_color;

out vec4 outColor;

void main() {
    vec4 color = texture(u_texture, v_uv);
    float dist = distance(v_uv, vec2(0.5));
    float vignette = 1.0 - smoothstep(u_radius, u_radius + u_softness, dist);

    outColor = vec4(mix(u_color, color.rgb, vignette), color.a);
}
`
