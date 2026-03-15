export function checkIfPolygonEdgesIntersectAnyEdge(
  polygon1: [number, number][],
  polygon2: [number, number][],
) {
  for (let i = 0; i < polygon1.length; i++) {
    const lineSegment1 = [polygon1[i], polygon1[(i + 1) % polygon1.length]];
    for (let j = 0; j < polygon2.length; j++) {
      const lineSegment2 = [polygon2[j], polygon2[(j + 1) % polygon2.length]];
      if (
        checkIfEdgeIntersectsEdge(
          lineSegment1[0],
          lineSegment1[1],
          lineSegment2[0],
          lineSegment2[1],
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

export function checkIfEdgeIntersectsEdge(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
) {
  if (!checkIfLinesAreParallel(a, b, c, d)) {
    if (checkIfNonParallelLineSegmentInteriorsIntersect(a, b, c, d)) {
      return true;
    }
  }
  return false;
}

export function checkIfLinesAreParallel(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
) {
  const det = (b[0] - a[0]) * (d[1] - c[1]) - (d[0] - c[0]) * (b[1] - a[1]);
  return det === 0;
}

export function checkIfNonParallelLineSegmentInteriorsIntersect(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
) {
  const det = (b[0] - a[0]) * (d[1] - c[1]) - (d[0] - c[0]) * (b[1] - a[1]);
  const lambda =
    ((d[1] - c[1]) * (d[0] - a[0]) + (c[0] - d[0]) * (d[1] - a[1])) / det;
  const gamma =
    ((a[1] - b[1]) * (d[0] - a[0]) + (b[0] - a[0]) * (d[1] - a[1])) / det;
  return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
}

export function checkIfPolygonInteriorContainsAnyPoint(
  polygon1: [number, number][],
  polygon2: [number, number][],
) {
  for (const polygon2Point of polygon2) {
    const polygonCointainsPoint = checkIfPolygonInteriorContainsPoint(
      polygon1,
      polygon2Point,
    );
    if (polygonCointainsPoint) {
      return true;
    }
  }
  return false;
}

export function checkIfPolygonInteriorContainsPoint(
  polygon: [number, number][],
  point: [number, number],
) {
  let numOfCrossings = 0;
  for (let i = 0; i < polygon.length; i++) {
    const lineSegment = [polygon[i], polygon[(i + 1) % polygon.length]];
    // If edge contains point, polygon interior does not contain point
    if (checkIfPointsAreCollinear([lineSegment[0], lineSegment[1], point])) {
      const lineAxis = {
        o: lineSegment[0],
        u: findVersorBetweenPoints(lineSegment[0], lineSegment[1]),
      };
      const [A, B, C] = convertCollinearPointsTo1D(
        [lineSegment[0], lineSegment[1], point],
        lineAxis,
      );
      const tolerance = 0.0001;
      if (A < C + tolerance && C - tolerance < B) {
        return false;
      }
    } else {
      if (
        checkIfHorizontalLineCrossesNonCollinearLineSegmentToTheRight(
          point,
          lineSegment,
        )
      ) {
        numOfCrossings++;
      }
    }
  }
  return checkIfNumberIsOdd(numOfCrossings);
}

export function convertCollinearPointsTo1D(
  a: number[][],
  lineAxis: { o: number[]; u: number[] },
) {
  const points1D = [];
  for (const p of a) {
    const v = findVectorBetweenPoints(lineAxis.o, p);
    points1D.push(dot(v, lineAxis.u));
  }
  return points1D;
}

export function checkIfHorizontalLineCrossesNonCollinearLineSegmentToTheRight(
  horizontalLinePoint: [number, number],
  lineSegment: [number, number][],
) {
  const tolerance = 0.0001;
  const A = lineSegment[0];
  const B = lineSegment[1];
  const C = horizontalLinePoint;
  const AyCyBy = A[1] - tolerance < C[1] && B[1] - tolerance > C[1]; // This checks if horizontal line crosses line segment (with a positive margin below and a negative margin above)
  const ByCyAy = A[1] - tolerance > C[1] && B[1] - tolerance < C[1];
  return (
    (AyCyBy || ByCyAy) &&
    C[0] < ((B[0] - A[0]) * (C[1] - A[1])) / (B[1] - A[1]) + A[0] - tolerance
  ); // If line crosses line segment to the right
}

export function checkIfNumberIsOdd(n: number) {
  return Math.abs(n % 2) === 1;
}

export function checkIfPolygonEdgesIntersectAnyCorner(
  polygon1: [number, number][],
  polygon2: [number, number][],
) {
  for (let i = 0; i < polygon2.length; i++) {
    const polygon2Corner = [
      polygon2[(i - 1 + polygon2.length) % polygon2.length],
      polygon2[i],
      polygon2[(i + 1) % polygon2.length],
    ];
    if (checkIfPolygonEdgesIntersectCorner(polygon1, polygon2Corner)) {
      return true;
    }
  }
  return false;
}

export function checkIfPolygonEdgesIntersectCorner(
  polygon: [number, number][],
  corner: [number, number][],
) {
  const tolerance = 0.0001; // It's important that this tolerance is the same as MathHelpers.checkIfPointsAreEqual tolerance. In fact, all linear tolerances should be the same!
  for (let i = 0; i < polygon.length; i++) {
    const lineSegment = [polygon[i], polygon[(i + 1) % polygon.length]];
    if (
      checkIfPointsAreCollinear([lineSegment[0], lineSegment[1], corner[1]])
    ) {
      const lineAxis = {
        o: lineSegment[0],
        u: findVersorBetweenPoints(lineSegment[0], lineSegment[1]),
      };
      const [A, B, C] = convertCollinearPointsTo1D(
        [lineSegment[0], lineSegment[1], corner[1]],
        lineAxis,
      );
      // If edge intersects point
      if (A < C + tolerance && C - tolerance < B) {
        let polygonCorner: [number, number][];
        // If edge start point coincides with point
        if (checkIfPointsAreEqual([A], [C])) {
          polygonCorner = [
            polygon[(i - 1 + polygon.length) % polygon.length],
            polygon[i],
            polygon[(i + 1) % polygon.length],
          ];
        }
        // If edge end point coincides with point
        else if (checkIfPointsAreEqual([B], [C])) {
          polygonCorner = [
            polygon[i],
            polygon[(i + 1) % polygon.length],
            polygon[(i + 2) % polygon.length],
          ];
        }
        // If edge interior contains point
        else {
          polygonCorner = [lineSegment[0], corner[1], lineSegment[1]];
        }
        return checkIfCornersIntersect(polygonCorner, corner);
      }
    }
  }
  return false;
}

export function checkIfPointsAreCollinear(points: number[][]) {
  const tolerance = 0.0001;
  let u: number[] = [];
  const nonCollinearPoints = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (!checkIfPointsContainPoint(nonCollinearPoints, points[i])) {
      if (checkIfArrayIsEmpty(u)) {
        u = findVersorBetweenPoints(nonCollinearPoints[0], points[i]);
      } else {
        const v = findVersorBetweenPoints(nonCollinearPoints[0], points[i]);
        if (Math.abs(dot(u, v)) < 1 - tolerance) {
          return false;
        }
      }
    }
    nonCollinearPoints.push(points[i]);
  }
  return true;
}

export function checkIfPointsContainPoint(points: number[][], point: number[]) {
  for (const p of points) {
    if (checkIfPointsAreEqual(p, point)) {
      return true;
    }
  }
  return false;
}

export function findVersorBetweenPoints(a: number[], b: number[]): number[] {
  const u = findVectorBetweenPoints(a, b);
  const n = findVectorNorm(u);
  return multiplyArray(u, 1 / n);
}

export function findVectorBetweenPoints(a: number[], b: number[]): number[] {
  return b.map((element, i) => element - a[i]);
}

export function dot(u: number[], v: number[]): number {
  return u.reduce((acc, element, i) => acc + element * v[i], 0);
}

export function checkIfArrayIsEmpty<T>(a: Array<T>): boolean {
  return Array.isArray(a) && a.length === 0;
}

export function checkIfPointsAreEqual(
  a: Array<number>,
  b: Array<number>,
): boolean {
  const tolerance = 0.0001;
  const d = findDistanceBetweenPoints(a, b);
  return d < tolerance;
}

export function findVectorNorm(u: number[]): number {
  return Math.sqrt(u.reduce((acc, element) => acc + element ** 2, 0));
}

export function multiplyArray(a: number[], c: number): number[] {
  return a.map((element) => element * c);
}

export function findDistanceBetweenPoints(a: number[], b: number[]): number {
  const u = findVectorBetweenPoints(a, b);
  return findVectorNorm(u);
}

export function checkIfCornersIntersect(
  corner1: [number, number][],
  corner2: [number, number][],
) {
  const corner1Vector1 = findVectorBetweenPoints(corner1[1], corner1[0]) as [
    number,
    number,
  ];
  const corner1Vector2 = findVectorBetweenPoints(corner1[1], corner1[2]) as [
    number,
    number,
  ];
  const corner1Angle = findCounterClockwiseAngleBetweenVectors(
    corner1Vector2,
    corner1Vector1,
  );
  const corner1BisectorVersor = findBisectorVersor(
    corner1Vector2,
    corner1Vector1,
  );

  const corner2Vector1 = findVectorBetweenPoints(corner2[1], corner2[0]) as [
    number,
    number,
  ];
  const corner2Vector2 = findVectorBetweenPoints(corner2[1], corner2[2]) as [
    number,
    number,
  ];
  const corner2Angle = findCounterClockwiseAngleBetweenVectors(
    corner2Vector2,
    corner2Vector1,
  );
  const corner2BisectorVersor = findBisectorVersor(
    corner2Vector2,
    corner2Vector1,
  );

  const bisectorVersorsAngle = findSmallestAngleBetweenVectors(
    corner1BisectorVersor,
    corner2BisectorVersor,
  );
  const maximumAngle = corner1Angle / 2 + corner2Angle / 2;
  return bisectorVersorsAngle < maximumAngle;
}

export function findCounterClockwiseAngleBetweenVectors(
  u: [number, number],
  v: [number, number],
) {
  u = findVectorVersor(u) as [number, number];
  v = findVectorVersor(v) as [number, number];
  const dot_result = dot(u, v);
  const det = u[0] * v[1] - u[1] * v[0];
  const angle = ((Math.atan2(det, dot_result) * 180) / Math.PI + 360) % 360; // In degrees
  return angle;
}

export function findVectorVersor(u: number[]): number[] {
  const n = findVectorNorm(u);
  return multiplyArray(u, 1 / n);
}

export function findBisectorVersor(u: [number, number], v: [number, number]) {
  const angle = findCounterClockwiseAngleBetweenVectors(u, v);
  const bisectorVersor = rotateVectorCounterClockwise(u, angle / 2);
  return bisectorVersor;
}

export function findSmallestAngleBetweenVectors(u: number[], v: number[]) {
  const angle =
    (Math.acos(dot(findVectorVersor(u), findVectorVersor(v))) / Math.PI) * 180;
  return angle;
}

export function rotateVectorCounterClockwise(u: [number, number], a: number) {
  a = (a * Math.PI) / 180;
  const v = [
    u[0] * Math.cos(a) - u[1] * Math.sin(a),
    u[0] * Math.sin(a) + u[1] * Math.cos(a),
  ];
  return v;
}
