# Polygon intersection helper

This algorithm checks and finds the intersection of two simple polygons. For the intersection to exist, the intersection area must be > 0. In other words, their interiors must intersect. 

For example, the black and red polygons do not intersect in the first case, but intersect in the second:

![Intersection example](polygon-intersection-example.png)

Both polygons must be arrays of 2D point coordinates, ordered counter-clockwise. In principle, the algorithm should work on non-simple polygons with holes, it just needs to be adapted to accept variables representing such polygons (such as an array with an array for each polygon border).

To use it,  call `checkIfPolygonsIntersect()` like:

```
const polygon1 = [[0,0],[1,0],[1,1],[0,1]];
const polygon2 = [[0,-1],[2,0.5],[0,2]];
checkIfPolygonsIntersect(polygon1, polygon2);
```
