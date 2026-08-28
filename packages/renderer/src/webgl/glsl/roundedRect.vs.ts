export default `#version 300 es
precision highp float;

in vec2 a_vertex;
in float a_rotation;
in vec2 a_position;
in vec2 a_size;
in vec4 a_color;
in float a_radius;

uniform mat4 matrix_camera;

out vec4 v_color;
out vec2 v_localPosition;
out vec2 v_halfSize;
out float v_radius;

void main() {
    float phi = a_rotation;

    mat3 scale = mat3(
        a_size.x, 0, 0,
        0, a_size.y, 0,
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
    v_localPosition = a_vertex.xy * a_size;
    v_halfSize = a_size * 0.5;
    v_radius = min(a_radius, min(a_size.x, a_size.y) * 0.5);
}
`
