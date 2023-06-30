import { vec2, vec3 } from 'gl-matrix';
import { sign, intersectSegmentLine, projectTo3D } from './utils';

/**
 * Computes intersection of line and triangle projected onto 2D space (in XY plane)
 *
 * The procedure is as follows:
 * 1. Project the line and the triangles to 2D space (XY plane)
 * 2. Compute intersection
 * 3. Project the resulting points back to 3D space (using the plane of the triangle)
 *
 * @param line array of 2 vec3s (at least 9 floats) - line being projected onto the triangle
 * @param triangle array of 3 vec3s (at least 9 floats) - clipping triangle
 */
export function intersectProjectedTriangle(line: Float32Array, triangle: Float32Array): Float32Array {

    //project to 2D along Z-axis
    const l1 = vec2.fromValues(line[0], line[1]);
    const l2 = vec2.fromValues(line[3], line[4]);

    const t1 = vec2.fromValues(triangle[0], triangle[1]);
    const t2 = vec2.fromValues(triangle[3], triangle[4]);
    const t3 = vec2.fromValues(triangle[6], triangle[7]);

    const intersections = lineTriangleIntersection2D(l1, l2, t1, t2, t3);
    // console.log(intersections)

    if(intersections.length >= 2){
        // project the resulting triangles into 3D, so they lie in the plane of the B triangle
        const projected = projectTo3D(
            intersections, 
            vec3.fromValues(triangle[0], triangle[1], triangle[2]),
            vec3.fromValues(triangle[3], triangle[4], triangle[5]),
            vec3.fromValues(triangle[6], triangle[7], triangle[8]));

        // flatten the intersecting points array
        const output = new Float32Array(3 * projected.length);
        for (let i = 0; i < intersections.length; i++) {
            for (let j = 0; j < 3; j++) {
                output[i*3 + j] = projected[i][j];
            }
        }
        // return the flattened array
        return output;
    }
    else {
        return new Float32Array();
    }      
}

export function lineTriangleIntersection2D(l1: vec2, l2:vec2, t1: vec2, t2:vec2, t3: vec2): vec2[] {
    const intersections = [];
    const segments = [[t1, t2], [t2, t3], [t3, t1]];
    for (const seg of segments) {
        const intersection = intersectSegmentLine(l1, l2, seg[0], seg[1]);
        // console.log(intersection)
        if (intersection) {
            for (let i = 0; i < intersections.length; i++) {
                if (vec2.equals(intersections[i], intersection)) {
                    intersections.splice(i, 1);
                    break;
                }                
            }
            intersections.push(intersection);
        }
    }
    return intersections;
}