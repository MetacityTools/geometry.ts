import { overlapTriangle } from '@geometry/geometry';
import { test, expect } from 'vitest';

test('overlapTriangle', () => {
    const triangleA = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
    const triangleB = new Float32Array([0.2, 0.2, 0, 1.2, 0.2, 0, 0.2, 1.2, 0]);

    const overlap = overlapTriangle(triangleA, triangleB);
    expect(overlap).not.toBeNull();
    console.log(overlap);
});
