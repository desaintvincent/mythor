#version 300 es
precision highp float;
in vec4 v_color;
in vec2 v_texcoord;
in vec2 v_texture_origin;
in vec2 v_texture_size;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
    vec4 color = texture(u_texture, v_texcoord * v_texture_size + v_texture_origin) * v_color;
    outColor = color;
}
