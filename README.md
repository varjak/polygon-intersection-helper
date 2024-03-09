# Polygon intersection helper

This algorithm finds if two polygons intersect. For the intersection to exist, the intersection area must be > 0. In other words, their interiors must intersect. 

For example, the black and red polygons do not intersect in the first case, but intersect in the second:

![Intersection example](polygon-intersection-example.png)

To use it,  call `checkIfPolygonsIntersect()` like:

```
const polygon1 = [[0,0],[1,0],[1,1],[0,1]];
const polygon2 = [[0,-1],[2,0.5],[0,2]];
PolygonIntersectionHelper.checkIfPolygonsIntersect(polygon1, polygon2);
```
