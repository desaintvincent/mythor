#version 300 es
precision highp float;

in vec3 vertexPos;
in vec2 inLineStart;
in vec2 inLineEnd;
in float inLineWidth;
in vec4 lineColor;

out vec4 v_color;

uniform mat4 matrix_camera;
void main(void) {
    v_color = lineColor;
    vec2 lineStart = inLineStart;
    vec2 lineEnd = inLineEnd;
    float lineWidth = inLineWidth;
    vec2 delta = lineStart - lineEnd;
    vec2 centerPos = 0.5 * (lineStart + lineEnd);
    float lineLength = length(delta);
    float phi = atan(delta.y/delta.x);
    mat3 scale = mat3(
    lineLength, 0, 0,
    0, lineWidth, 0,
    0, 0, 1);
    mat3 rotate = mat3(
    cos(phi), sin(phi), 0,
    -sin(phi), cos(phi), 0,
    0, 0, 1);
    mat3 translate = mat3(
    1, 0, 0,
    0, 1, 0,
    centerPos.x, centerPos.y, 1);


    gl_Position = matrix_camera * vec4(translate *  rotate *  scale * vertexPos, 1.0);
}
