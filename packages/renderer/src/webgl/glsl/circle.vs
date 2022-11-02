#version 300 es
precision highp float;

in vec2 a_vertex;
in float a_rotation;
in float a_width;
in float a_fill;
in vec2 a_position;
in vec2 a_size;
in vec4 a_color;

uniform mat4 matrix_camera;

out vec4 v_color;
out vec2 v_vertex;
out float v_radius;
out float v_width;
out float v_fill;

void main() {
    mat3 scale = mat3(
        a_size.x, 0, 0,
        0, a_size.y, 0,
        0, 0, 1
    );

    float c = cos(a_rotation);
    float s = sin(a_rotation);
    mat3 rotate = mat3(
        c, s, 0,
        -s, c, 0,
        0, 0, 1
    );

    mat3 translate = mat3(
        1, 0, 0,
        0, 1, 0,
        a_position.x, a_position.y, 1
    );

    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(a_vertex.xy, 1), 1.0);

    v_radius = (a_size.x + a_size.y) * 0.5;
    v_width = a_width;
    v_fill = a_fill;
    v_vertex = a_vertex;
    v_color = a_color;
}
