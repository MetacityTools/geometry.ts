# geometry.ts 📐

Tiny utility for manipulating geometry in 2D and 3D space.

## TODOs

-   [ ] implement `overlapProjectedTriangle` (triangle x triangle) using the Weiler–Atherton clipping algorithm or design your own solution
-   [ ] write tests for `overlapProjectedTriangle` using vitest (see `test/`)
-   [ ] write analogical routine for overlaping 3D line segment and a triangle
-   [ ] test it

more notes are in `overlapTriangle.ts`

Side notes:

-   I have looked and no, there is not an efficient algorithm for triangle x triangle overlap. The result is gonna be a polygon anyway, so use polygon-clipping algo.
