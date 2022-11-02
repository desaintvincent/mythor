#version 300 es

precision highp float;
in vec4 v_color;
in vec2 v_vertex;
in float v_radius;
in float v_width;
in float v_fill;

out vec4 outColor;

float sqrtDist(in vec2 p) {
    return p.x * p.x + p.y * p.y;
}

void main() {
    float c = sqrtDist(v_vertex);
    if (v_fill < 1.0 && c < 0.25 - v_width / v_radius) {
        discard;
    }

    if (c > 0.25) {
        discard;
    }

    outColor = v_color;
}
