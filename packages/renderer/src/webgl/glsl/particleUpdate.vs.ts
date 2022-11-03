export default `#version 300 es
precision highp float;

in vec2 position;
in vec2 velocity;
in vec2 ageAndLifetime;
in vec2 torqueAndRotation;

out vec2 out_position;
out vec2 out_velocity;
out vec2 out_ageAndLifetime;
out vec2 out_torqueAndRotation;

uniform sampler2D rgNoise;
uniform vec2 u_time;
uniform vec2 u_minMaxLifetime;
uniform vec2 u_gravity;
uniform vec2 u_spawnPosition;
uniform vec2 u_minMaxTheta;
uniform vec2 u_minMaxSpeed;
uniform vec2 u_minMaxTorque;
uniform vec2 u_minMaxRotation;
uniform float u_respawn;

void update(float newAge, float elapsedTimeInSeconds) {
    out_ageAndLifetime = vec2(newAge, ageAndLifetime.y);
    out_velocity = velocity + u_gravity * elapsedTimeInSeconds;
    out_position = position + out_velocity * elapsedTimeInSeconds;
    out_torqueAndRotation = vec2(torqueAndRotation.x, torqueAndRotation.y + torqueAndRotation.x * elapsedTimeInSeconds);
}

int randIndex = 0;

vec2 getRand() {
    int seed = (gl_VertexID + randIndex++) % 512;

    int oneDSeed = (gl_VertexID + int(u_time.y) + randIndex++) % (512 * 512);
    int y = oneDSeed / 512;
    int x = oneDSeed % 512;
    ivec2 noise_coord = ivec2(x, y);

    return texelFetch(rgNoise, noise_coord, 0).rg;
}

void reset() {
    vec2 randVelocity = getRand();
    vec2 randLifetime = getRand();
    vec2 randTorque = getRand();
    vec2 randRotation = getRand();

    float theta = u_minMaxTheta.x + randVelocity.r * (u_minMaxTheta.y - u_minMaxTheta.x);
    float x = cos(theta);
    float y = sin(theta);

    out_position = u_spawnPosition;
    out_velocity = vec2(x, y) * (u_minMaxSpeed.x + randVelocity.g * (u_minMaxSpeed.y - u_minMaxSpeed.x));

    float lifeTime = u_minMaxLifetime.x + randLifetime.r * (u_minMaxLifetime.y - u_minMaxLifetime.x);
    out_ageAndLifetime = vec2(0.0, lifeTime);


    float torque = u_minMaxTorque.x + randTorque.r * (u_minMaxTorque.y - u_minMaxTorque.x);
    float rotation = u_minMaxRotation.x + randRotation.r * (u_minMaxRotation.y - u_minMaxRotation.x);
    out_torqueAndRotation = vec2(torque, rotation);
}

void main() {

    float elapsedTimeInSeconds = u_time.x;
    float newAge = ageAndLifetime.x + elapsedTimeInSeconds;

    if(newAge < ageAndLifetime.y) {
        update(newAge, elapsedTimeInSeconds);
    } else {
        reset();
    }
}
`
