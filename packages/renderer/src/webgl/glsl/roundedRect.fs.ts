export default `#version 300 es

precision highp float;

in vec4 v_color;
in vec2 v_localPosition;
in vec2 v_halfSize;
in float v_radius;

out vec4 outColor;

float roundedBoxSDF(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

void main() {
    float dist = roundedBoxSDF(v_localPosition, v_halfSize, v_radius);
    float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);

    if (alpha <= 0.0) {
        discard;
    }

    outColor = vec4(v_color.rgb, v_color.a * alpha);
}
`
