import { vec2, vec3 } from 'gl-matrix';

/**
 * Computes planar overlap of two 3D triangles in 2D space (in XY plane)
 *
 * The procedure is as follows:
 * 1. Project both of the triangles to 2D space (XY plane)
 * 2. Compute overlap of the two 2D triangles -> polygon
 * 3. Triangulate the polygon
 * 4. Project the resulting triangles back to 3D space (using the plane of the B triangle)
 *
 * @param a array of 3 vec3s (at least 9 floats) - being clipped
 * @param b array of 3 vec3s (at least 9 floats) - clipping polygon
 */
export function overlapProjectedTriangle(a: Float32Array, b: Float32Array): Float32Array {
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

    // use Weiler–Atherton clipping algorithm to compute intersection of two polygons
    // the `overlap` result is a polygon
    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);

    // project the resulting triangles into 3D, so they lie in the plane of the B triangle
    const projected = projectTo3D(
        overlap, 
        vec3.fromValues(b[0], b[1], b[2]),
        vec3.fromValues(b[3], b[4], b[5]),
        vec3.fromValues(b[6], b[7], b[8]));

    // triangulate the `projected` polygon into triangle list
    const triangles = triangulate(projected);    

    // flatten the triangles
    const output = new Float32Array(3 * triangles.length);
    for (let i = 0; i < triangles.length; i++) {
        for (let j = 0; j < 3; j++) {
            output[i*3 + j] = triangles[i][j];
        }
    }
    // return the flattened array
    return output;
}

function projectTo3D(points2D: vec2[], p1: vec3, p2: vec3, p3: vec3): vec3[] {
    // Calculate the normal vector of the plane
    const normal = [
        (p2[1] - p1[1]) * (p3[2] - p1[2]) - (p2[2] - p1[2]) * (p3[1] - p1[1]),
        (p2[2] - p1[2]) * (p3[0] - p1[0]) - (p2[0] - p1[0]) * (p3[2] - p1[2]),
        (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0])];
    
    // Calculate the distance from the origin to the plane
    const d = -(normal[0] * p1[0] + normal[1] * p1[1] + normal[2] * p1[2]);

    // Project each 2D point onto the 3D plane
    const projectedPoints: vec3[] = [];

    for (const point2D of points2D) {
        const [x, y] = point2D;

        // Calculate the z-coordinate of the projected point
        const z = -(normal[0] * x + normal[1] * y + d) / normal[2];
        projectedPoints.push(vec3.fromValues(x, y, z));
    }
    return projectedPoints;
}

export function triangulate(polygon: vec3[]) {
    const triangles = [];
    // entry polygon is always convex, do a simple triangle fan 
    for (let i = 2; i < polygon.length; i++) {
        triangles.push(polygon[0]);
        triangles.push(polygon[i-1]);
        triangles.push(polygon[i]);        
    }
    return triangles;
}

function sign(p1: vec2, p2: vec2, p3: vec2) {
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

function pointInTriangle(p: vec2, v1: vec2, v2: vec2, v3: vec2) {
    // consider using barycentric coordinates instead of half-plane method
    const d1 = sign(p, v1, v2);
    const d2 = sign(p, v2, v3);
    const d3 = sign(p, v3, v1);
    // console.log(d1===0, d2===0, d3===0);
    const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(has_neg && has_pos);
}

// valid triangle if non zero area
function isTriangleDegenerate(a: vec2, b: vec2, c: vec2, eps: number = 0) {
    return Math.abs(a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) <= eps;
}

// return point intersection of two line segments
function intersect(p1: vec2, p2: vec2, p3: vec2, p4: vec2, segmentCoefficients: vec2[]) {
    const denom = (p4[1]-p3[1]) * (p2[0]-p1[0]) - (p4[0]-p3[0]) * (p2[1]-p1[1]);
    if (denom == 0) { // parallel        
        return null;
    } 
    const ua = ((p4[0]-p3[0]) * (p1[1]-p3[1]) - (p4[1]-p3[1]) * (p1[0]-p3[0])) / denom;
    if (ua < 0 || ua > 1) { // out of range    
        return null;
    }
    const ub = ((p2[0]-p1[0]) * (p1[1]-p3[1]) - (p2[1]-p1[1]) * (p1[0]-p3[0])) / denom;
    if (ub < 0 || ub > 1) { // out of range
        return null;
    } 
    segmentCoefficients.push(vec2.fromValues(ua, ub));
    return vec2.fromValues(p1[0] + ua * (p2[0]-p1[0]), p1[1] + ua * (p2[1]-p1[1]));
}
    
export function weilerAtherton(a1: vec2, a2: vec2, a3: vec2, b1: vec2, b2: vec2, b3: vec2, eps:number=0.01) {
    // test for triangle degeneracy
    if (isTriangleDegenerate(a1, a2, a3)) {
        // first triangle is degenerate
        return [];
    }
    if (isTriangleDegenerate(b1, b2, b3)) {
        // second triangle is degenerate
        return [];
    }
    // flip triangle order if necessary
    if (sign(a1, a2, a3) < 0) {
        [a1, a3] = [a3, a1];
    }
    if (sign(b1, b2, b3) < 0) {
        [b1, b3] = [b3, b1];
    }

    const segmentsA = [[a1, a2], [a2, a3], [a3, a1]];
    const segmentsB = [[b1, b2], [b2, b3], [b3, b1]];

    const accA = [a1, a2, a3];
    const accB = [b1, b2, b3];
    const intersections = [];
    const segmentCoefficients: vec2[] = [];
    let entryPoint:vec2|undefined = undefined;
    for (const segA of segmentsA) {
        for (const segB of segmentsB) {
            const intersection = intersect(segA[0], segA[1], segB[0], segB[1], segmentCoefficients);
            if (intersection) {
                if (vec2.equals(intersection, segA[0]) || 
                    vec2.equals(intersection, segA[1]) || 
                    vec2.equals(intersection, segB[0]) || 
                    vec2.equals(intersection, segB[1])) {
                    // vertex-on-edge or vertex-on-vertex or edge-on-edge
                    // get rid of the coefficient entry
                    segmentCoefficients.pop();
                    continue;
                }
                else {
                    intersections.push(intersection);
                    // insert intersection point into the polygon point lists
                    let idA = accA.indexOf(segA[1])===0 ? accA.length : accA.indexOf(segA[1]);
                    let idB = accB.indexOf(segB[1])===0 ? accB.length : accB.indexOf(segB[1]);
                    // check if this line segment has already another intersection and if yes
                    // insert this one on the proper place (2-element insert sort)
                    // triangle-triangle can have at most two intersection for a segment
                    // for a general case a whole insert sort loop would be needed
                    if (accA.indexOf(segA[0])!=idA-1 && 
                        segmentCoefficients[intersections.indexOf(accA[idA-1])][0] > segmentCoefficients[intersections.length-1][0]){
                        idA--;
                    }
                    accA.splice(idA, 0, intersection);
                    // the same logic for the second triangle
                    if (accB.indexOf(segB[0])!=idB-1 && 
                        segmentCoefficients[intersections.indexOf(accB[idB-1])][1] > segmentCoefficients[intersections.length-1][1]){
                        idB--;
                    }
                    accB.splice(idB, 0, intersection);

                    if (!entryPoint) {
                        const x = vec2.fromValues(intersection[0] + eps * (segB[1][0] - segB[0][0]), intersection[1] + eps * (segB[1][1] - segB[0][1]));                        
                        const isEntering = sign(x, segA[0], segA[1]) > 0;
                        if (isEntering) {
                            entryPoint = intersection;
                        }
                    }
                }
            }
        }
    }
    if (!entryPoint) {
        // check for complete containment
        if (pointInTriangle(a1, b1, b2, b3) &&
            pointInTriangle(a2, b1, b2, b3) &&
            pointInTriangle(a3, b1, b2, b3)){
            // A in B
            return accA;
        }
        if (pointInTriangle(b1, a1, a2, a3) &&
            pointInTriangle(b2, a1, a2, a3) &&
            pointInTriangle(b3, a1, a2, a3)){
            // B in A
            return accB;
        }
    }
    else {
        // do the weiler-atherton magic shit here
        // init the accumulator
        const acc = [entryPoint];
        let traversingA = false;
        while (true) {
            let traversedList = traversingA ? accA : accB;
            // next point index
            let nextIdx = traversedList.indexOf(acc[acc.length-1]) + 1;
            if (nextIdx === traversedList.length) {
                // loop the list
                nextIdx = 0;
            }
            let nextElm = traversingA ? accA[nextIdx] : accB[nextIdx];
            if (intersections.indexOf(nextElm) >= 0) {
                // test for termination (loop is complete)
                if (nextElm === entryPoint) {
                    break;
                }
                // this is intersected point - we are switching lists
                traversingA = !traversingA;
            }
            acc.push(nextElm);
        }
        return acc;
    }
    return [];
}       