import { vec3 } from 'gl-matrix';
import { barCoords3D } from './triangle';

/**
 * Triangulates a convex polygon using ear clipping algorithm
 *
 * @param polygon array of vec3s (at least 3) representing a convex polygon
 * @returns array of triangles (each triangle is an array of 3 vec3s)
 */
export function earclipConvexPolygon(polygon: vec3[]) {
    let n = polygon.length;
    const triangles: vec3[][] = [];
    let i = 0;
    while (n > 3) {
        const a = polygon[i];
        const b = polygon[(i + 1) % n];
        const c = polygon[(i + 2) % n];
        if (isEar(a, b, c, polygon)) {
            triangles.push([a, b, c]);
            polygon.splice((i + 1) % n, 1);
            n--;
        } else {
            i++;
        }
    }
    triangles.push(polygon);
    return triangles;
}

function isEar(a: vec3, b: vec3, c: vec3, polygon: vec3[]) {
    const n = polygon.length;
    for (let i = 0; i < n; i++) {
        const p = polygon[i];
        if (p === a || p === b || p === c) continue;
        if (pointInTriangle(p, a, b, c)) return false;
    }
    return true;
}

function pointInTriangle(p: vec3, a: vec3, b: vec3, c: vec3) {
    const [u, v] = barCoords3D(a, b, c, p);
    return u >= 0 && v >= 0 && u + v < 1;
}
