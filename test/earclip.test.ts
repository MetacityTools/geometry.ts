import { earclipConvexPolygon } from '@geometry/geometry';
import { vec3 } from 'gl-matrix';
import { test, expect } from 'vitest';

test('earclipConvexPolygon simple', (t) => {
    const polygon: vec3[] = [
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ];
    const triangles = earclipConvexPolygon(polygon);
    expect(triangles).toEqual([
        [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
        ],
        [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
        ],
    ]);
});

test('earclipConvexPolygon complex', (t) => {
    const polygon: vec3[] = [
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0.5, 1.5, 1],
        [0, 1, 1],
    ];

    const triangles = earclipConvexPolygon(polygon);

    expect(triangles).toEqual([
        [
            [0, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
        ],
        [
            [0, 0, 1],
            [1, 1, 1],
            [0.5, 1.5, 1],
        ],
        [
            [0, 0, 1],
            [0.5, 1.5, 1],
            [0, 1, 1],
        ],
    ]);
});
