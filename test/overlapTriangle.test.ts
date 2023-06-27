import { overlapProjectedTriangle, weilerAtherton, triangulate } from '@geometry/geometry';
import { test, expect } from 'vitest';
import { vec2, vec3 } from 'gl-matrix';

test('sameTriangle', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(0, 0);
    const b2 = vec2.fromValues(2, 0);
    const b3 = vec2.fromValues(2, 2);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    expect(overlap).not.toBeNull();
    expect(vec2.equals(overlap[0], a1)).true;
    expect(vec2.equals(overlap[1], a2)).true;
    expect(vec2.equals(overlap[2], a3)).true;
    // console.log(overlap);
});

test('edgeOnEdgeOutside', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(1, 0);
    const b2 = vec2.fromValues(3, 0);
    const b3 = vec2.fromValues(2, -2);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    expect(overlap.length).toBe(0);
    // console.log(overlap);
});

test('vertexOnVertexOutside', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(2, 0);
    const b2 = vec2.fromValues(2, -2);
    const b3 = vec2.fromValues(4, 0);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(0);
});

test('vertexOnEdgeInside', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(3, 1);
    const b2 = vec2.fromValues(2, -1);
    const b3 = vec2.fromValues(1, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(4);
    expect(vec2.equals(overlap[0], vec2.fromValues(2, 1))).toBe(true);
    expect(vec2.equals(overlap[1], b3)).toBe(true);
    expect(vec2.equals(overlap[2], vec2.fromValues(1.5, 0))).toBe(true);
    expect(vec2.equals(overlap[3], a2)).toBe(true);    
});

test('vertexOnEdgeInsideReversed', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(1, 1);
    const b2 = vec2.fromValues(2, -1);
    const b3 = vec2.fromValues(3, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(4);
    expect(vec2.equals(overlap[0], vec2.fromValues(2, 1))).toBe(true);
    expect(vec2.equals(overlap[1], b1)).toBe(true);
    expect(vec2.equals(overlap[2], vec2.fromValues(1.5, 0))).toBe(true);
    expect(vec2.equals(overlap[3], a2)).toBe(true);    
});

test('degenerateFirstTriangle', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 0);

    const b1 = vec2.fromValues(1, 1);
    const b2 = vec2.fromValues(2, -1);
    const b3 = vec2.fromValues(3, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(0);  
});

test('degenerateSecondTriangle', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(1, 1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(3, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(0);  
});

test('noOverlap', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(0, -1);
    const b2 = vec2.fromValues(2, -1);
    const b3 = vec2.fromValues(2, -3);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(0);  
});

test('stackedTriangles', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 2);

    const b1 = vec2.fromValues(0, -1);
    const b2 = vec2.fromValues(2, -1);
    const b3 = vec2.fromValues(1, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);

    expect(overlap.length).toBe(3);  
    expect(vec2.equals(overlap[1], b3)).toBe(true);
});

test('stackedTrianglesReversed', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 2);

    const b1 = vec2.fromValues(2, -1);
    const b2 = vec2.fromValues(0, -1);
    const b3 = vec2.fromValues(1, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);

    expect(overlap.length).toBe(3);  
    expect(vec2.equals(overlap[1], b3)).toBe(true);
});



test('quadrilateralOverlap', () => {
    const a1 = vec2.fromValues(0.5, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 1);

    const b1 = vec2.fromValues(0, 1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(1, -1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(4);  
});

test('secondTriangleInsideFirst', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(2, 2);

    const b1 = vec2.fromValues(1, 0);
    const b2 = vec2.fromValues(2, 0);
    const b3 = vec2.fromValues(2, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(3);  
    expect(vec2.equals(overlap[0], b1)).toBe(true);
    expect(vec2.equals(overlap[1], b2)).toBe(true);
    expect(vec2.equals(overlap[2], b3)).toBe(true);
});

test('secondTriangleInsideFirstAllVerticesTouching', () => {
    const a1 = vec2.fromValues(0, 1);
    const a2 = vec2.fromValues(2, 1);
    const a3 = vec2.fromValues(1, -1);

    const b1 = vec2.fromValues(0.5, 0);
    const b2 = vec2.fromValues(1.5, 0);
    const b3 = vec2.fromValues(1, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(3);  

    expect(vec2.equals(overlap[0], b1)).toBe(true);
    expect(vec2.equals(overlap[1], b2)).toBe(true);
    expect(vec2.equals(overlap[2], b3)).toBe(true);
});


test('pentagonalOverlap', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 1);

    const b1 = vec2.fromValues(0, 1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(1, -1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(5);  
});

test('hexOverlap', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 2);

    const b1 = vec2.fromValues(0, 1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(1, -1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    expect(overlap.length).toBe(6);  
});

test('hexOverlapShifted', () => {
    const a1 = vec2.fromValues(2, 0);
    const a2 = vec2.fromValues(1, 2);
    const a3 = vec2.fromValues(0, 0);

    const b1 = vec2.fromValues(0, 1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(1, -1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    // console.log(triangulate(overlap));
    expect(overlap.length).toBe(6);  
});

test('hexOverlapShifted2', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 2);

    const b1 = vec2.fromValues(2, 1);
    const b2 = vec2.fromValues(1, -1);
    const b3 = vec2.fromValues(0, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    // console.log(triangulate(overlap));
    expect(overlap.length).toBe(6);  
});

test('hexOverlapReversed', () => {
    const a1 = vec2.fromValues(1, 2);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(0, 0);

    const b1 = vec2.fromValues(0, 1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(1, -1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    // console.log(triangulate(overlap));
    expect(overlap.length).toBe(6);  
});

test('hexOverlapReversed2', () => {
    const a1 = vec2.fromValues(0, 0);
    const a2 = vec2.fromValues(2, 0);
    const a3 = vec2.fromValues(1, 2);

    const b1 = vec2.fromValues(1, -1);
    const b2 = vec2.fromValues(2, 1);
    const b3 = vec2.fromValues(0, 1);

    const overlap = weilerAtherton(a1, a2, a3, b1, b2, b3);
    console.log(overlap);
    // console.log(triangulate(overlap));
    expect(overlap.length).toBe(6);  
});

test('overlapTriangle', () => {
    const triangleA = new Float32Array([1,1,0, 3,1,0, 2,-1,0]);
    const triangleB = new Float32Array([0,0,0, 2,0,1, 2,2,1]);

    const overlap = overlapProjectedTriangle(triangleA, triangleB);
    expect(overlap).not.toBeNull();
    //TODO add more elaborate tests
    console.log(overlap);
});