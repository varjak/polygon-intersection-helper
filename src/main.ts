import { PolygonIntersectionFinderHelper } from "./polygon-intersection-finder-helper";
import { PolygonUnionHelper } from "./polygon-union-helper";
import { PolygonIntersectionCheckerHelper } from "./polygon-intersection-checker-helper";
import { Polygon } from "./polygon-intersection-finder-types";

/**
 * Polygons must have the same point order! (clock-wise or anti-clock-wise)
 * @param polygon1
 * @param polygon2
 * @returns true if polygons intersect
 */
export function checkIfPolygonsIntersect(polygon1: [number, number][], polygon2: [number, number][]): boolean {
  return (
    PolygonIntersectionCheckerHelper.checkIfPolygonEdgesIntersectAnyEdge(polygon1, polygon2) ||
    (PolygonIntersectionCheckerHelper.checkIfPolygonInteriorContainsAnyPoint(polygon1, polygon2) || PolygonIntersectionCheckerHelper.checkIfPolygonInteriorContainsAnyPoint(polygon2, polygon1)) ||
    (PolygonIntersectionCheckerHelper.checkIfPolygonEdgesIntersectAnyCorner(polygon1, polygon2) || PolygonIntersectionCheckerHelper.checkIfPolygonEdgesIntersectAnyCorner(polygon2, polygon1))
  );
}

export function findIntersectionBetweenPolygons(polygon1: Polygon, polygon2: Polygon): Polygon[] {
  let polygonIntersection: Polygon[] = [];

  if (!(PolygonIntersectionFinderHelper.checkIfArrayIsEmpty(polygon1) || PolygonIntersectionFinderHelper.checkIfArrayIsEmpty(polygon2))) {
    polygonIntersection = PolygonIntersectionFinderHelper.findIntersectionOfPolygonWithPolygon(polygon1, polygon2);
    if (PolygonIntersectionFinderHelper.checkIfArrayIsEmpty(polygonIntersection)) {
      polygonIntersection = PolygonIntersectionFinderHelper.findIntersectionOfPolygonWithPolygon(polygon2, polygon1);
    }
  }

  return polygonIntersection;
}

export function findAreaOfUnionOfPolygons(polygons: Polygon[]): number {
  const n = polygons.length;
  let unionArea = 0;

  for (let k = 0; k < n; k++) {
    const combinationIndexes = PolygonUnionHelper.findCombinationIndexes(n, k + 1);
    for (let i = 0; i < combinationIndexes.length; i++) {
      const intersectionPolygon = PolygonUnionHelper.findIntersectionBetweenMultiplePolygons(PolygonUnionHelper.indexArray(polygons, combinationIndexes[i]));
      const intersectionArea = PolygonUnionHelper.findPolygonArea(intersectionPolygon);
      unionArea = unionArea + ((-1) ** k) * intersectionArea;
    }
  }
  return unionArea;
}