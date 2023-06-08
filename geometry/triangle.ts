import { vec2, vec3 } from 'gl-matrix';

//TODO optimize this and use "context" to store temporary variables
const tmpA2 = vec2.create();
const tmpB2 = vec2.create();
const tmpC2 = vec2.create();

export function barCoords2D(a1: vec2, a2: vec2, a3: vec2, p: vec2) {
    const v0 = vec2.subtract(tmpA2, a3, a1);
    const v1 = vec2.subtract(tmpB2, a2, a1);
    const v2 = vec2.subtract(tmpC2, p, a1);
    const dot00 = vec2.dot(v0, v0);
    const dot01 = vec2.dot(v0, v1);
    const dot02 = vec2.dot(v0, v2);
    const dot11 = vec2.dot(v1, v1);
    const dot12 = vec2.dot(v1, v2);
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return [u, v];
}

const tmpA3 = vec3.create();
const tmpB3 = vec3.create();
const tmpC3 = vec3.create();

export function barCoords3D(a1: vec3, a2: vec3, a3: vec3, p: vec3) {
    const v0 = vec3.subtract(tmpA3, a3, a1);
    const v1 = vec3.subtract(tmpB3, a2, a1);
    const v2 = vec3.subtract(tmpC3, p, a1);
    const dot00 = vec3.dot(v0, v0);
    const dot01 = vec3.dot(v0, v1);
    const dot02 = vec3.dot(v0, v2);
    const dot11 = vec3.dot(v1, v1);
    const dot12 = vec3.dot(v1, v2);
    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return [u, v];
}
