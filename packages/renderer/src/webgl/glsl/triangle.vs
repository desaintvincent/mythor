#version 300 es
precision highp float;

in vec2 a_position;
in vec4 a_color;

uniform mat4 matrix_camera;

out vec4 v_color;

void main() {
    // Multiply the position by the matrix.
    gl_Position = matrix_camera * vec4(ceil(a_position), 1, 1);

    // Copy the color from the attribute to the varying.
    v_color = a_color;
}
