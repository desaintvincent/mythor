export default `#version 300 es
precision highp float;

in vec2 a_vertex;
in float a_rotation;
in vec2 a_position;
in vec2 a_size;
in vec2 a_scale;
in vec4 a_color;
in vec2 a_texcoord;
in vec2 a_texture_origin;
in vec2 a_texture_size;

uniform mat4 matrix_camera;

out vec4 v_color;
out vec2 v_texcoord;
out vec2 v_texture_origin;
out vec2 v_texture_size;

void main() {
    float phi = a_rotation;

    mat3 scale = mat3(
        a_size.x * a_scale.x, 0, 0,
        0, a_size.y * a_scale.y, 0,
        0, 0, 1
    );

    mat3 rotate = mat3(
        cos(phi), sin(phi), 0,
        -sin(phi), cos(phi), 0,
        0, 0, 1
    );

    mat3 translate = mat3(
        1, 0, 0,
        0, 1, 0,
        a_position.x, a_position.y, 1
    );

    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(a_vertex.xy, 1), 1.0);

    v_color = a_color;
    v_texture_origin = a_texture_origin;
    v_texture_size = a_texture_size;
    v_texcoord = a_texcoord;
}
`
