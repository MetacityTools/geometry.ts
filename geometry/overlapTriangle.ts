import { vec2, vec3 } from 'gl-matrix';

/**
 * Computes planar overlap of two 3D triangles in 2D space (XY plane)
 *
 * @param a array of 3 vec3s (at least 9 floats) - being clipped
 * @param b array of 3 vec3s (at least 9 floats) - clipping polygon
 */
export function overlapProjectedTriangle(a: Float32Array, b: Float32Array) {
    //TODO test degenerate cases, return null if no overlap or degenerate case
    //degenerate cases:
    //1. one triangle is completely vertical
    //2. no overlap whatsoever (based on bboxes)

    //project to 2D along Z-axis
    const a1 = vec2.fromValues(a[0], a[1]);
    const a2 = vec2.fromValues(a[3], a[4]);
    const a3 = vec2.fromValues(a[6], a[7]);

    const b1 = vec2.fromValues(b[0], b[1]);
    const b2 = vec2.fromValues(b[3], b[4]);
    const b3 = vec2.fromValues(b[6], b[7]);

    //TODO use Weiler–Atherton clipping algorithm to compute intersection of two polygons
    //the `overlap` result is a polygon
    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);

    //TODO triangulate the `overlap` polygon

    //TODO project the resulting triangles into 3D, so they lie in the plane of the B triangle
    //const projected = projectTo3D(overlap, b1, b2, b3, [b[2], b[5], b[8]]);

    //TODO return the resulting triangles
    return null;
}

function weilerAtherton(a1: vec2, a2: vec2, a3: vec2, b1: vec2, b2: vec2, b3: vec2) {
    //TODO
}
