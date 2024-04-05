# Polygon intersection helper

This algorithm checks and finds the intersection of two simple polygons. For the intersection to exist, the intersection area must be > 0. In other words, their interiors must intersect. 

For example, the black and red polygons do not intersect in the first case, but intersect in the second:

![Intersection example](polygon-intersection-example.png)

Both polygons must be arrays of 2D point coordinates, ordered counter-clockwise. In principle, the algorithm should work on non-simple polygons with holes, it just needs to be adapted to accept variables representing such polygons (such as an array with an array for each polygon border).

To check if the intersection exists, you may call `checkIfPolygonsIntersect()`, and to find the intersection polygons, call `findIntersectionBetweenPolygons()`, like:

```
const polygon1 = [[0,0],[1,0],[1,1],[0,1]];
const polygon2 = [[0,-1],[2,0.5],[0,2]];
const polygonsIntersect = checkIfPolygonsIntersect(polygon1, polygon2);
const intersectionPolygons = findIntersectionBetweenPolygons(polygon1, polygon2);
```

Here are more tests either functions passed:
⠀ | ⠀ | ⠀ | ⠀ |
|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|
![Intersection example](test/test-00-intersection-true.png) Test 01. Intersection: true |  ![Intersection example](test/test-01-intersection-true.png) Test 02. Intersection: true | ![Intersection example](test/test-02-intersection-false.png) Test 03. Intersection: false | ![Intersection example](test/test-03-intersection-true.png) Test 04. Intersection: true
![Intersection example](test/test-04-intersection-true.png) Test 05. Intersection: true |  ![Intersection example](test/test-05-intersection-false.png) Test 06. Intersection: false | ![Intersection example](test/test-06-intersection-false.png) Test 07. Intersection: false | ![Intersection example](test/test-07-intersection-true.png) Test 08. Intersection: true
![Intersection example](test/test-08-intersection-false.png) Test 09. Intersection: false |  ![Intersection example](test/test-09-intersection-true.png) Test 10. Intersection: true | ![Intersection example](test/test-10-intersection-false.png) Test 11. Intersection: false  | ![Intersection example](test/test-11-intersection-false.png) Test 12. Intersection: true
![Intersection example](test/test-12-intersection-false.png) Test 13. Intersection: true |  ![Intersection example](test/test-13-intersection-true.png) Test 14. Intersection: true | ![Intersection example](test/test-14-intersection-false.png) Test 15. Intersection: true  | ![Intersection example](test/test-15-intersection-false.png) Test 16. Intersection: true

