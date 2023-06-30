import { vec2, vec3 } from 'gl-matrix';

export function sign(p1: vec2, p2: vec2, p3: vec2) {
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

// return point intersection of two line segments
export function intersectSegmentSegment(p1: vec2, p2: vec2, p3: vec2, p4: vec2, segmentCoefficients: vec2[]) {
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

// return point intersection of line and line segment
export function intersectSegmentLine(p1: vec2, p2: vec2, p3: vec2, p4: vec2) {
    const denom = (p4[1]-p3[1]) * (p2[0]-p1[0]) - (p4[0]-p3[0]) * (p2[1]-p1[1]);
    if (denom == 0) { // parallel
        return null;
    } 
    const ua = ((p4[0]-p3[0]) * (p1[1]-p3[1]) - (p4[1]-p3[1]) * (p1[0]-p3[0])) / denom;
    // if (ua < 0 || ua > 1) { // out of range
    //     return null;
    // }
    const ub = ((p2[0]-p1[0]) * (p1[1]-p3[1]) - (p2[1]-p1[1]) * (p1[0]-p3[0])) / denom;
    if (ub < 0 || ub > 1) { // out of range
        return null;
    } 
    return vec2.fromValues(p1[0] + ua * (p2[0]-p1[0]), p1[1] + ua * (p2[1]-p1[1]));
}

// valid triangle if non zero area
export function isTriangleDegenerate(a: vec2, b: vec2, c: vec2, eps: number = 0) {
    return Math.abs(a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) <= eps;
}

export function projectTo3D(points2D: vec2[], p1: vec3, p2: vec3, p3: vec3): vec3[] {
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