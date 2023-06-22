import { overlapProjectedTriangle } from '@geometry/geometry';
import { test, expect } from 'vitest';

test('overlapTriangle', () => {
    const triangleA = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
    const triangleB = new Float32Array([0.2, 0.2, 0, 1.2, 0.2, 0, 0.2, 1.2, 0]);

    const overlap = overlapProjectedTriangle(triangleA, triangleB);
    expect(overlap).not.toBeNull();
    //TODO add more elaborate tests
    console.log(overlap);
});
