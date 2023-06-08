import { vec2, vec3 } from 'gl-matrix';
import { barCoords2D } from './triangle';
import { earclipConvexPolygon } from './earclip';

/**
 * Computes planar overlap of two 3D triangles in 2D space (XY plane)
 *
 * @param a array of 3 vec3s (at least 9 floats) - being clipped
 * @param b array of 3 vec3s (at least 9 floats) - clipping polygon
 */
export function overlapTriangle(a: Float32Array, b: Float32Array) {
    if (!testOverlap(a, b)) return null;

    const a1 = vec2.fromValues(a[0], a[1]);
    const a2 = vec2.fromValues(a[3], a[4]);
    const a3 = vec2.fromValues(a[6], a[7]);

    const b1 = vec2.fromValues(b[0], b[1]);
    const b2 = vec2.fromValues(b[3], b[4]);
    const b3 = vec2.fromValues(b[6], b[7]);

    //use Weiler–Atherton clipping algorithm to compute intersection of two polygons
    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    if (overlap.length < 3) return null;
    const projected = projectTo3D(overlap, b1, b2, b3, [b[2], b[5], b[8]]);
    const triangles = earclipConvexPolygon(projected);
    return triangles;
}

function testOverlap(a: Float32Array, b: Float32Array) {
    const minAX = Math.min(a[0], a[3], a[6]);
    const minAY = Math.min(a[1], a[4], a[7]);
    const maxAX = Math.max(a[0], a[3], a[6]);
    const maxAY = Math.max(a[1], a[4], a[7]);

    const minBX = Math.min(b[0], b[3], b[6]);
    const minBY = Math.min(b[1], b[4], b[7]);
    const maxBX = Math.max(b[0], b[3], b[6]);
    const maxBY = Math.max(b[1], b[4], b[7]);

    if (minAX > maxBX || minAY > maxBY || maxAX < minBX || maxAY < minBY) return false;
    return true;
}

function weilerAtherton(a1: vec2, a2: vec2, a3: vec2, b1: vec2, b2: vec2, b3: vec2) {
    //TODO debug, this is buggy
    const a = [a1, a2, a3];
    const b = [b1, b2, b3];
    const aInside = [false, false, false];
    const bInside = [false, false, false];
    for (let i = 0; i < 3; i++) {
        aInside[i] = isInside(a[i], b1, b2, b3);
        bInside[i] = isInside(b[i], a1, a2, a3);
    }

    const overlap: vec2[] = [];
    for (let i = 0; i < 3; i++) {
        if (aInside[i]) overlap.push(a[i]);
        if (aInside[i] && !aInside[(i + 1) % 3]) {
            const [u, v] = barCoords2D(a[i], a[(i + 1) % 3], b1, b2);
            overlap.push(vec2.lerp(vec2.create(), a[i], a[(i + 1) % 3], u));
        }
        if (bInside[i] && !bInside[(i + 1) % 3]) {
            const [u, v] = barCoords2D(b[i], b[(i + 1) % 3], a1, a2);
            overlap.push(vec2.lerp(vec2.create(), b[i], b[(i + 1) % 3], u));
        }
    }
    return overlap;
}

function isInside(p: vec2, a: vec2, b: vec2, c: vec2) {
    const [u, v] = barCoords2D(a, b, c, p);
    return u >= 0 && v >= 0 && u + v <= 1;
}

function projectTo3D(overlap: vec2[], b1: vec2, b2: vec2, b3: vec2, z: number[]) {
    const projected: vec3[] = [];
    for (const p of overlap) {
        const [u, v] = barCoords2D(b1, b2, b3, p);
        const zp = z[0] * u + z[1] * v + z[2] * (1 - u - v);
        projected.push(vec3.fromValues(p[0], p[1], zp));
    }
    return projected;
}
