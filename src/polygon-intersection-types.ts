export type Point = [number, number];

export type Vector = [number, number];

export type LineSegment = [Point, Point];

export type Corner = [Point, Point, Point];

export type Polygon = Point[];

export type PolygonRecord = Record<number, Polygon>;

export interface IEdge {
    polygonId: number;
    edgeId: number;
    lineSegment: LineSegment;
}

export interface ICorner {
    polygonId: number;
    cornerId: number;
    coords: Corner;
}

export interface IIntersectionEdgePoint {
    polygonId: number,
    edgeId: number,
    coord: Point
}

export interface IIntersectionCornerPoint {
    polygonId: number,
    cornerId: number,
    coord: Point
}

export type IntersectionPoint = IIntersectionEdgePoint | IIntersectionCornerPoint;






