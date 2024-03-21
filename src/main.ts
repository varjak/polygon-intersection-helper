import { PolygonIntersection } from "./polygon-intersection";

/**
 * Polygons must have the same point order! (clock-wise or anti-clock-wise)
 * @param polygon1
 * @param polygon2
 * @returns true if polygons intersect
 */
export function checkIfPolygonsIntersect(polygon1: [number, number][], polygon2: [number, number][]): boolean {
  return (
    PolygonIntersection.checkIfPolygonEdgesIntersectAnyEdge(polygon1, polygon2) ||
    (PolygonIntersection.checkIfPolygonInteriorContainsAnyPoint(polygon1, polygon2) || PolygonIntersection.checkIfPolygonInteriorContainsAnyPoint(polygon2, polygon1)) ||
    (PolygonIntersection.checkIfPolygonEdgesIntersectAnyCorner(polygon1, polygon2) || PolygonIntersection.checkIfPolygonEdgesIntersectAnyCorner(polygon2, polygon1))
  );
}