import {
  checkIfPolygonEdgesIntersectAnyCorner,
  checkIfPolygonEdgesIntersectAnyEdge,
  checkIfPolygonInteriorContainsAnyPoint,
} from "./polygon-intersection-checker-helper";
import {
  checkIfArrayIsEmpty,
  findIntersectionOfPolygonWithPolygon,
} from "./polygon-intersection-finder-helper";
import type { Polygon } from "./polygon-intersection-finder-types";
import {
  findCombinationIndexes,
  findIntersectionBetweenMultiplePolygons,
  findPolygonArea,
  indexArray,
} from "./polygon-union-helper";

/**
 * Polygons must have the same point order! (clock-wise or anti-clock-wise)
 * @param polygon1
 * @param polygon2
 * @returns true if polygons intersect
 */
export function checkIfPolygonsIntersect(
  polygon1: [number, number][],
  polygon2: [number, number][],
): boolean {
  return (
    checkIfPolygonEdgesIntersectAnyEdge(polygon1, polygon2) ||
    checkIfPolygonInteriorContainsAnyPoint(polygon1, polygon2) ||
    checkIfPolygonInteriorContainsAnyPoint(polygon2, polygon1) ||
    checkIfPolygonEdgesIntersectAnyCorner(polygon1, polygon2) ||
    checkIfPolygonEdgesIntersectAnyCorner(polygon2, polygon1)
  );
}

export function findIntersectionBetweenPolygons(
  polygon1: Polygon,
  polygon2: Polygon,
): Polygon[] {
  let polygonIntersection: Polygon[] = [];

  if (!(checkIfArrayIsEmpty(polygon1) || checkIfArrayIsEmpty(polygon2))) {
    polygonIntersection = findIntersectionOfPolygonWithPolygon(
      polygon1,
      polygon2,
    );
    if (checkIfArrayIsEmpty(polygonIntersection)) {
      polygonIntersection = findIntersectionOfPolygonWithPolygon(
        polygon2,
        polygon1,
      );
    }
  }

  return polygonIntersection;
}

export function findAreaOfUnionOfPolygons(polygons: Polygon[]): number {
  const n = polygons.length;
  let unionArea = 0;

  for (let k = 0; k < n; k++) {
    const combinationIndexes = findCombinationIndexes(n, k + 1);
    for (let i = 0; i < combinationIndexes.length; i++) {
      const intersectionPolygon = findIntersectionBetweenMultiplePolygons(
        indexArray(polygons, combinationIndexes[i]),
      );
      const intersectionArea = findPolygonArea(intersectionPolygon);
      unionArea = unionArea + (-1) ** k * intersectionArea;
    }
  }
  return unionArea;
}
