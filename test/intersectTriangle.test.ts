import { intersectProjectedTriangle } from '@geometry/geometry';
import { test, expect } from 'vitest';
import { vec2, vec3 } from 'gl-matrix';

test('intersectTriangle', () => {
    const line = new Float32Array([-5,1,0, 5,1,0]);
    const triangle = new Float32Array([0,0,0, 2,0,0, 2,2,0]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(6)
    expect(intersection[0]).equal(2)
    expect(intersection[1]).equal(1)
    expect(intersection[2]).equal(0)
    expect(intersection[3]).equal(1)
    expect(intersection[4]).equal(1)
    expect(intersection[5]).equal(0)
});

test('intersectTriangleReversed', () => {
    const line = new Float32Array([5,1,0, -5,1,0]);
    const triangle = new Float32Array([0,0,0, 2,0,0, 2,2,0]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(6)
    expect(intersection[0]).equal(2)
    expect(intersection[1]).equal(1)
    expect(intersection[2]).equal(0)
    expect(intersection[3]).equal(1)
    expect(intersection[4]).equal(1)
    expect(intersection[5]).equal(0)
});

test('bisectTriangle', () => {
    const line = new Float32Array([0,0,0, 0,1,0]);
    const triangle = new Float32Array([-2,0,0, 2,0,0, 0,2,0]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(6)
    expect(intersection[0]).equal(0)
    expect(intersection[1]).equal(0)
    expect(intersection[2]).equal(0)
    expect(intersection[3]).equal(0)
    expect(intersection[4]).equal(2)
    expect(intersection[5]).equal(0)
});

test('touchVertex', () => {
    const line = new Float32Array([0,2,0, 2,2,0]);
    const triangle = new Float32Array([-2,0,0, 2,0,0, 0,2,0]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(0)
});

test('touchEdge', () => {
    const line = new Float32Array([-3,0,0, 3,0,0]);
    const triangle = new Float32Array([-2,0,0, 2,0,0, 0,2,0]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(6)
    expect(intersection[0]).equal(2)
    expect(intersection[1]).equal(0)
    expect(intersection[2]).equal(0)
    expect(intersection[3]).equal(-2)
    expect(intersection[4]).equal(0)
    expect(intersection[5]).equal(0)
});

test('noIntersection', () => {
    const line = new Float32Array([-3,10,0, 3,10,0]);
    const triangle = new Float32Array([-2,0,0, 2,0,0, 0,2,0]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(0)
});

test('zProjection', () => {
    const line = new Float32Array([-5,1,50, 5,1,-50]);
    const triangle = new Float32Array([0,0,-10, 2,0,10, 2,2,10]);

    const intersection = intersectProjectedTriangle(line, triangle);
    console.log(intersection);
    expect(intersection.length).equal(6)
    expect(intersection[0]).equal(2)
    expect(intersection[1]).equal(1)
    expect(intersection[2]).equal(10)
    expect(intersection[3]).equal(1)
    expect(intersection[4]).equal(1)
    expect(intersection[5]).equal(0)
});