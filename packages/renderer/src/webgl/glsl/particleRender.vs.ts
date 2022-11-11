// @todo fix cubicBezier

export default `#version 300 es
in vec2 vertex;
in vec4 position;
in vec2 ageAndLifetime;
in vec2 torqueAndRotation;
in vec2 texcoord;
in vec2 texture_origin;
in vec2 texture_size;

uniform mat4 matrix_camera;
uniform vec4 u_startColor;
uniform vec4 u_endColor;
uniform vec4 u_minMaxSize;

// uniform vec4[2] u_bezier;

out vec4 v_color;
out vec2 v_texcoord;
out vec2 v_texture_origin;
out vec2 v_texture_size;


/*
start bezier

float curveAA(float t, float x1, float x2) {
    float v = 1.0 - t;

    return 3.0 * v * v * t * x1 + 3.0 * v * t * t * x2 + t * t * t;
}

float derivativeCurveX(float t, float x1, float x2) {
    float v = 1.0 - t;

    return 3.0 * (2.0 * (t - 1.0) * t + v * v) * x1 + 3.0 * (- t * t * t + 2.0 * v * t) * x2;
}

float cubicBezier(float x1, float y1, float x2, float y2, float epsilon, float t) {
    if (x1 == y1 && x2 == x2) {
        return t;
    }

    float x = t, t0, t1, t2, calculatedX2;
    int i = 0;

    for (t2 = x, i = 0; i < 8; i++){
        calculatedX2 = curveAA(t2, x1, x2) - x;
        if (abs(calculatedX2) < epsilon) {
            return curveAA(t2, y1, y2);
        }
        float d2 = derivativeCurveX(t2, x1, x2);
        if (abs(d2) < 1e-6) {
            break;
        }
        t2 = t2 - calculatedX2 / d2;
    }

    t0 = 0.0;
    t1 = 1.0;
    t2 = x;

    if (t2 < t0) {
        return curveAA(t0, y1, y2);
    }
    if (t2 > t1) {
        return curveAA(t1, y1, y2);
    }


    // Fallback to the bisection method for reliability.
    while (t0 < t1){
        calculatedX2 = curveAA(t2, x1, x2);
        if (abs(calculatedX2 - x) < epsilon) {
            return curveAA(t2, y1, y2);
        }
        if (x > calculatedX2) {
            t0 = t2;
        } else {
            t1 = t2;
        }
        t2 = (t1 - t0) * 0.5 + t0;
    }

    // Failure
    return curveAA(t2, y1, y2);
}

end bezier
*/

vec4 interpolation(float t, vec4 min, vec4 max) {
    float invPercentage = 1.0 - t;

    return invPercentage * min + t * max;
}

vec2 interpolation(float t, vec2 min, vec2 max) {
    float invPercentage = 1.0 - t;

    return invPercentage * min + t * max;
}

float minMax(float value) {
    if (value > 1.0) {
        return 1.0;
    }
    if (value < 0.0) {
        return 0.0;
    }
    return value;
}

void main() {
    float t = minMax(ageAndLifetime.x / ageAndLifetime.y);
    // vec4 sizeCubic = u_bezier[1];
    // vec4 colorCubic = u_bezier[0];
    float sizePercentage = t; // minMax(cubicBezier(sizeCubic[0], sizeCubic[1], sizeCubic[2], sizeCubic[3], 0.01, t));
    float colorPercentage = t; // minMax(cubicBezier(colorCubic[0], colorCubic[1], colorCubic[2], colorCubic[3], 0.01, t));

    float phi = torqueAndRotation.y;

    vec2 size = interpolation(sizePercentage, u_minMaxSize.xy, u_minMaxSize.zw);

    mat3 scale = mat3(
        size.x, 0, 0,
        0, size.y, 0,
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
        position.x, position.y, 1
    );

    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(vertex.xy, 1), 1.0);
    v_color = interpolation(colorPercentage, u_startColor, u_endColor);
    v_texcoord = texcoord;

    v_texture_origin = texture_origin;
    v_texture_size = texture_size;
}
`
