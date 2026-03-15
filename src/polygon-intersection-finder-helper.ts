import type {
  Corner,
  ICorner,
  IEdge,
  IIntersectionCornerPoint,
  IIntersectionEdgePoint,
  IntersectionPoint,
  LineSegment,
  Point,
  Polygon,
  PolygonRecord,
  Vector,
} from "./polygon-intersection-finder-types";

export function findIntersectionOfPolygonWithPolygon(
  polygon1: Polygon,
  polygon2: Polygon,
) {
  // Create start parameters
  const polygons: PolygonRecord = { 0: polygon1, 1: polygon2 };
  const startEdges: IEdge[] = [
    {
      polygonId: 0,
      edgeId: 0,
      lineSegment: findEdgeCoords(polygons, 0, 0),
    },
  ];
  const previousEdges: IEdge[] = [];
  const previousLineSegments: LineSegment[] = [];
  const intersectionPolygons: Polygon[] = [];

  while (!checkIfArrayIsEmpty(startEdges)) {
    // Select current edge
    let currentEdge = startEdges.shift() as IEdge; // The typing should be unecessary since startEdgeIds cannot be empty at this point.

    const intersectionPolygon: Polygon = [];

    while (true) {
      // Find intersection between current line segment and other polygon
      const intersectionPoints =
        findIntersectionBetweenLineSegmentAndPolygonsEdgesAndCorners(
          currentEdge,
          polygons,
        );

      if (!checkIfArrayIsEmpty(intersectionPoints)) {
        // Pick first intersection points
        const firstIntersectionPoints = findFirstIntersectionPoints(
          currentEdge,
          intersectionPoints,
        );

        // Find current edge intersection point
        const currentEdgeIntersectionPoint = {
          polygonId: currentEdge.polygonId,
          edgeId: currentEdge.edgeId,
          coord: firstIntersectionPoints[0].coord,
        };

        // Divide current edge at intersection
        const [firstSlice, secondSlice] = sliceEdgeAtIntersection(
          currentEdge,
          currentEdgeIntersectionPoint,
        );

        // If current first line segment was already analysed, close the loop
        if (
          checkIfPolygonHasClosed(previousLineSegments, firstSlice.lineSegment)
        ) {
          break;
        }

        // Add point to intersection polygon
        intersectionPolygon.push(currentEdgeIntersectionPoint.coord);

        // Update previous segments
        previousEdges.push(firstSlice);
        previousLineSegments.push(firstSlice.lineSegment);

        // Find next edge segment
        const nextEdge = findNextEdgeSegment(
          polygons,
          currentEdgeIntersectionPoint,
          firstIntersectionPoints,
        );

        // If the current polygons next edge was not pursued, save it to pursue it later
        if (!checkIfEdgesAreEqual(secondSlice, nextEdge)) {
          startEdges.push(secondSlice);
        }

        // Update current edge
        currentEdge = nextEdge;
      } else {
        // If current edge was already analysed, close the loop
        if (
          checkIfPolygonHasClosed(previousLineSegments, currentEdge.lineSegment)
        ) {
          break;
        }

        // Update previous segments
        previousEdges.push(currentEdge);
        previousLineSegments.push(currentEdge.lineSegment);

        // Select next point
        const currentPolygon = polygons[currentEdge.polygonId];
        const polygonNextEdge = findNextPolygonEdge(polygons, currentEdge);
        const currentPoint = {
          polygonId: currentEdge.polygonId,
          cornerId: polygonNextEdge.edgeId,
          coord: polygonNextEdge.lineSegment[0],
        };
        const currentCorner = {
          polygonId: currentEdge.polygonId,
          cornerId: polygonNextEdge.edgeId,
          coords: findCornerCoords(currentPolygon, polygonNextEdge.edgeId),
        };
        const otherPolygon = findOtherPolygon(polygons, currentEdge.polygonId);

        let nextEdge: IEdge;

        // Find if current corner intersects other edges/corners (from the inside)
        const intersectionPoints =
          findIntersectionBetweenCornerAndPolygonsEdgesAndCorners(
            currentCorner,
            polygons,
          );
        if (!checkIfArrayIsEmpty(intersectionPoints)) {
          intersectionPolygon.push(currentPoint.coord);
          nextEdge = findNextEdgeSegment(
            polygons,
            currentPoint,
            intersectionPoints,
          );
          if (!checkIfEdgesAreEqual(polygonNextEdge, nextEdge)) {
            startEdges.push(polygonNextEdge);
          }

          // If current point lies inside other polygon
        } else if (
          checkIfPolygonInteriorContainsPoint(otherPolygon, currentPoint.coord)
        ) {
          intersectionPolygon.push(currentPoint.coord);
          nextEdge = polygonNextEdge;

          // If current point lies outside polygon
        } else {
          nextEdge = polygonNextEdge;
        }

        // Update current edge
        currentEdge = nextEdge;
      }
    }

    // If the first and last points are equal, remove last. It would be better if it was not necessary.
    if (intersectionPolygon.length > 2) {
      if (
        checkIfPointsAreEqual(
          intersectionPolygon[0],
          intersectionPolygon[intersectionPolygon.length - 1],
        )
      ) {
        intersectionPolygon.pop();
      }
    }
    // If polygon has at least 3 points, add it
    if (intersectionPolygon.length > 2) {
      intersectionPolygons.push(intersectionPolygon);
    }
  }
  return intersectionPolygons;
}

export function findNextEdgeSegment(
  polygons: PolygonRecord,
  intersectionPoint: IntersectionPoint,
  intersectionPoints: IntersectionPoint[],
): IEdge {
  const currentPolygon = polygons[intersectionPoint.polygonId];

  // Find previous segment
  let previousSegment: IEdge;
  if (checkIfIntersectionPointIsAtCorner(intersectionPoint)) {
    intersectionPoint = intersectionPoint as IIntersectionCornerPoint; // This should not be necessary
    const previousEdgeId =
      (intersectionPoint.cornerId - 1 + currentPolygon.length) %
      currentPolygon.length;
    previousSegment = {
      polygonId: intersectionPoint.polygonId,
      edgeId: previousEdgeId,
      lineSegment: [
        currentPolygon[previousEdgeId],
        currentPolygon[intersectionPoint.cornerId],
      ],
    };
  } else if (checkIfIntersectionPointIsAtEdge(intersectionPoint)) {
    intersectionPoint = intersectionPoint as IIntersectionEdgePoint; // This should not be necessary
    previousSegment = {
      polygonId: intersectionPoint.polygonId,
      edgeId: intersectionPoint.edgeId,
      lineSegment: [
        currentPolygon[intersectionPoint.edgeId],
        intersectionPoint.coord,
      ],
    };
  } else {
    throw new Error(
      "Intersection points was not found to be at neither a corner nor an edge!",
    );
  }

  // Find next possible branches
  intersectionPoints.push(intersectionPoint);
  const branchSegments = [];
  let branchSegment: IEdge;
  for (let intersectionPoint of intersectionPoints) {
    if (checkIfIntersectionPointIsAtCorner(intersectionPoint)) {
      intersectionPoint = intersectionPoint as IIntersectionCornerPoint; // This should not be necessary
      const nextEdgeId = intersectionPoint.cornerId;
      branchSegment = {
        polygonId: intersectionPoint.polygonId,
        edgeId: nextEdgeId,
        lineSegment: findEdgeCoords(
          polygons,
          intersectionPoint.polygonId,
          nextEdgeId,
        ),
      };
    } else if (checkIfIntersectionPointIsAtEdge(intersectionPoint)) {
      intersectionPoint = intersectionPoint as IIntersectionEdgePoint; // This should not be necessary
      const intersectionLineSegment = findEdgeCoords(
        polygons,
        intersectionPoint.polygonId,
        intersectionPoint.edgeId,
      );
      branchSegment = {
        polygonId: intersectionPoint.polygonId,
        edgeId: intersectionPoint.edgeId,
        lineSegment: [
          intersectionPoint.coord,
          intersectionLineSegment[1],
        ] as LineSegment,
      };
    } else {
      throw new Error(
        "Intersection points was not found to be at neither a corner nor an edge!",
      );
    }
    branchSegments.push(branchSegment);
  }

  // Pick branch with highest counter-clockwise angle from back vector
  const backVector = findVectorBetweenPoints(
    previousSegment.lineSegment[1],
    previousSegment.lineSegment[0],
  ) as Vector;
  branchSegments.sort(compareBranches(backVector));
  const nextEdge = branchSegments[branchSegments.length - 1];

  return nextEdge;
}

export function findFirstIntersectionPoints(
  currentEdge: IEdge,
  intersectionPoints: IntersectionPoint[],
): IntersectionPoint[] {
  intersectionPoints.sort(
    (a, b) =>
      findDistanceBetweenPoints(currentEdge.lineSegment[0], a.coord) -
      findDistanceBetweenPoints(currentEdge.lineSegment[0], b.coord),
  );
  const firstIntersectionPoint = intersectionPoints[0];
  const firstIntersectionPoints = [];
  for (const intersectionPoint of intersectionPoints) {
    if (
      checkIfPointsAreEqual(
        firstIntersectionPoint.coord,
        intersectionPoint.coord,
      )
    ) {
      firstIntersectionPoints.push(intersectionPoint);
    }
  }
  return firstIntersectionPoints;
}

export function findIntersectionBetweenLineSegmentAndPolygonsEdgesAndCorners(
  edge: IEdge,
  polygons: PolygonRecord,
) {
  const intersectionPoints = [];
  intersectionPoints.push(
    ...findIntersectionBetweenLineSegmentAndOtherPolygonEdges(polygons, edge),
  ); // The same polygon cannot have an edge intersected by another edge, so just check the other polygon edges
  intersectionPoints.push(
    ...findIntersectionBetweenLineSegmentAndPolygonsCorners(polygons, edge),
  );
  return intersectionPoints;
}

export function findIntersectionBetweenLineSegmentAndOtherPolygonEdges(
  polygons: PolygonRecord,
  edge: IEdge,
): IIntersectionEdgePoint[] {
  const otherPolygonId = findOtherPolygonId(polygons, edge.polygonId);
  const otherPolygon = polygons[otherPolygonId];
  const intersectionPoints = [];
  for (let i = 0; i < otherPolygon.length; i++) {
    const otherLineSegment = [
      otherPolygon[i],
      otherPolygon[(i + 1) % otherPolygon.length],
    ];
    const intersectionPoint = findIntersectionBetweenLineSegments(
      edge.lineSegment,
      otherLineSegment,
    ) as number[];
    if (!checkIfArrayIsEmpty(intersectionPoint)) {
      intersectionPoints.push({
        polygonId: otherPolygonId,
        edgeId: i,
        coord: intersectionPoint as [number, number],
      });
    }
  }
  return intersectionPoints;
}

export function findIntersectionBetweenCornerAndPolygonsEdgesAndCorners(
  corner: ICorner,
  polygons: PolygonRecord,
): IntersectionPoint[] {
  const intersectionPoints: IntersectionPoint[] = [];
  intersectionPoints.push(
    ...findIntersectionBetweenCornerAndPolygonsEdges(polygons, corner),
  );
  intersectionPoints.push(
    ...findIntersectionBetweenCornerAndPolygonsCorners(polygons, corner),
  );
  return intersectionPoints;
}

export function findIntersectionBetweenCornerAndPolygonsEdges(
  polygons: PolygonRecord,
  corner: ICorner,
): IIntersectionEdgePoint[] {
  const polygonIds = Object.keys(polygons).map(Number);
  const intersectionPoints = [];
  for (let i = 0; i < polygonIds.length; i++) {
    const polygonId = polygonIds[i];
    const polygon = polygons[polygonId];
    for (let j = 0; j < polygon.length; j++) {
      const lineSegment: LineSegment = [
        polygon[j],
        polygon[(j + 1) % polygon.length],
      ];
      if (checkIfLineSegmentInteriorContainsCorner(lineSegment, corner)) {
        intersectionPoints.push({
          polygonId: polygonId,
          edgeId: j,
          coord: corner.coords[1],
        });
      }
    }
  }
  return intersectionPoints;
}

export function findIntersectionBetweenCornerAndPolygonsCorners(
  polygons: PolygonRecord,
  corner: ICorner,
): IIntersectionCornerPoint[] {
  const polygonIds = Object.keys(polygons).map(Number);
  const intersectionCorners = [];
  for (let i = 0; i < polygonIds.length; i++) {
    const polygonId = polygonIds[i];
    const polygon = polygons[polygonId];
    for (let j = 0; j < polygon.length; j++) {
      const polygonCorner = {
        polygonId: polygonId,
        cornerId: j,
        coords: findCornerCoords(polygon, j),
      };
      if (
        !checkIfCornersAreEqual(corner, polygonCorner) &&
        checkIfCornerInteriorsIntersect(corner, polygonCorner)
      ) {
        intersectionCorners.push({
          polygonId: polygonId,
          cornerId: j,
          coord: polygonCorner.coords[1],
        });
      }
    }
  }
  return intersectionCorners;
}

export function checkIfCornerInteriorsIntersect(
  corner1: ICorner,
  corner2: ICorner,
) {
  if (checkIfCornersTouch(corner1.coords, corner2.coords)) {
    if (
      checkIfTouchingCornersInteriorsIntersect(corner1.coords, corner2.coords)
    ) {
      return true;
    }
  }
  return false;
}

export function checkIfLineSegmentInteriorContainsCorner(
  lineSegment: LineSegment,
  corner: ICorner,
) {
  if (checkIfLineSegmentInteriorContainsPoint(lineSegment, corner)) {
    const polygonCorner: Corner = [
      lineSegment[0],
      corner.coords[1],
      lineSegment[1],
    ];
    if (
      checkIfTouchingCornersInteriorsIntersect(polygonCorner, corner.coords)
    ) {
      return true;
    }
  }
  return false;
}

export function checkIfLineSegmentInteriorContainsPoint(
  lineSegment: LineSegment,
  corner: ICorner,
) {
  const tolerance = 0.0001;
  if (
    checkIfPointsAreCollinear([
      lineSegment[0],
      lineSegment[1],
      corner.coords[1],
    ])
  ) {
    const lineAxis = {
      o: lineSegment[0],
      u: findVersorBetweenPoints(lineSegment[0], lineSegment[1]),
    };
    const [A, B, C] = convertCollinearPointsTo1D(
      [lineSegment[0], lineSegment[1], corner.coords[1]],
      lineAxis,
    );
    if (A < C - tolerance && C + tolerance < B) {
      return true;
    }
  }
  return false;
}

export function findIntersectionBetweenCornerAndPolygon(
  polygons: PolygonRecord,
  corner: ICorner,
) {
  const otherPolygonId = findOtherPolygonId(polygons, corner.polygonId);
  const otherPolygon = polygons[otherPolygonId];
  const cornerCoords = corner.coords;

  const tolerance = 0.0001; // It's important that this tolerance is the same as MathHelpers.checkIfPointsAreEqual tolerance. In fact, all linear tolerances should be the same!
  const intersectionPoints = [];
  for (let i = 0; i < otherPolygon.length; i++) {
    const lineSegment = [
      otherPolygon[i],
      otherPolygon[(i + 1) % otherPolygon.length],
    ];
    if (
      checkIfPointsAreCollinear([
        lineSegment[0],
        lineSegment[1],
        cornerCoords[1],
      ])
    ) {
      const lineAxis = {
        o: lineSegment[0],
        u: findVersorBetweenPoints(lineSegment[0], lineSegment[1]),
      };
      const [A, B, C] = convertCollinearPointsTo1D(
        [lineSegment[0], lineSegment[1], cornerCoords[1]],
        lineAxis,
      );
      // If edge intersects point. (C + tolerance) < B excludes end point of edge of being classified into corner! This way no corners are repeated.
      if (A < C + tolerance && C + tolerance < B) {
        let polygonCorner: Corner;
        // If edge start point coincides with point
        if (checkIfPointsAreEqual([A], [C])) {
          polygonCorner = [
            otherPolygon[(i - 1 + otherPolygon.length) % otherPolygon.length],
            otherPolygon[i],
            otherPolygon[(i + 1) % otherPolygon.length],
          ];
        }
        // If edge end point coincides with point
        else if (checkIfPointsAreEqual([B], [C])) {
          throw new Error(
            "Corner was found to intersect edge without end point, but then was found to intersect end point!",
          );
        }
        // If edge interior contains point
        else {
          polygonCorner = [lineSegment[0], cornerCoords[1], lineSegment[1]];
        }

        if (
          checkIfTouchingCornersInteriorsIntersect(polygonCorner, cornerCoords)
        ) {
          const intersectionPoint = {
            polygonId: otherPolygonId,
            edgeId: i,
            coord: cornerCoords[1],
          };
          intersectionPoints.push(intersectionPoint);
        }
      }
    }
  }
  return intersectionPoints;
}

export function findIntersectionBetweenLineSegmentAndPolygonsCorners(
  polygons: PolygonRecord,
  edge: IEdge,
) {
  const polygonIds = Object.keys(polygons).map(Number);
  const intersectionCorners = [];
  for (let i = 0; i < polygonIds.length; i++) {
    const polygonId = polygonIds[i];
    const polygon = polygons[polygonId];
    for (let j = 0; j < polygon.length; j++) {
      const polygonCorner = {
        polygonId: polygonId,
        cornerId: j,
        coords: findCornerCoords(polygon, j),
      };
      const intersectionPoint =
        findIntersectionBetweenLineSegmentAndPolygonCorner(
          edge,
          polygonCorner,
        ) as number[];
      if (!checkIfArrayIsEmpty(intersectionPoint)) {
        intersectionCorners.push({
          polygonId: polygonId,
          edgeId: j,
          coord: intersectionPoint as [number, number],
        });
      }
    }
  }
  return intersectionCorners;
}

export function checkIfEdgesAreEqual(edge1: IEdge, edge2: IEdge) {
  return edge1.polygonId === edge2.polygonId && edge1.edgeId === edge2.edgeId;
}

export function checkIfPolygonHasClosed(
  previousLineSegments: LineSegment[],
  nextLineSegment: LineSegment,
) {
  for (let i = 0; i < previousLineSegments.length; i++) {
    if (
      checkIfVersorsHaveTheSameDirection(
        findVersorBetweenPoints(
          previousLineSegments[i][0],
          previousLineSegments[i][1],
        ),
        findVersorBetweenPoints(nextLineSegment[0], nextLineSegment[1]),
      )
    ) {
      if (
        checkIfLinesAreCollinear(
          previousLineSegments[i][0],
          previousLineSegments[i][1],
          nextLineSegment[0],
          nextLineSegment[1],
        )
      ) {
        if (
          checkIfCollinearLineSegmentInteriorsIntersect(
            previousLineSegments[i][0],
            previousLineSegments[i][1],
            nextLineSegment[0],
            nextLineSegment[1],
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function checkIfIntersectionPointIsAtCorner(
  intersectionPoint: IntersectionPoint,
) {
  return Object.keys(intersectionPoint).includes("cornerId");
}

export function checkIfIntersectionPointIsAtEdge(
  intersectionPoint: IntersectionPoint,
) {
  return Object.keys(intersectionPoint).includes("edgeId");
}

export function compareBranches(backVector: Vector) {
  return (
    a: { polygonId: number; edgeId: number; lineSegment: [number, number][] },
    b: { polygonId: number; edgeId: number; lineSegment: [number, number][] },
  ) => {
    const branchAAngleToBack = findCounterClockwiseAngleBetweenVectors(
      backVector,
      findVectorBetweenPoints(a.lineSegment[0], a.lineSegment[1]) as [
        number,
        number,
      ],
    );
    const branchBAngleToBack = findCounterClockwiseAngleBetweenVectors(
      backVector,
      findVectorBetweenPoints(b.lineSegment[0], b.lineSegment[1]) as [
        number,
        number,
      ],
    );
    return branchAAngleToBack - branchBAngleToBack;
  };
}

export function findNextPolygonEdge(
  polygons: PolygonRecord,
  currentEdge: IEdge,
) {
  const currentPolygon = polygons[currentEdge.polygonId];
  const nextEdgeId = (currentEdge.edgeId + 1) % currentPolygon.length;
  const nextLineSegment = findEdgeCoords(
    polygons,
    currentEdge.polygonId,
    nextEdgeId,
  );
  const nextEdge = {
    polygonId: currentEdge.polygonId,
    edgeId: nextEdgeId,
    lineSegment: nextLineSegment,
  };
  return nextEdge;
}

export function sliceEdgeAtIntersection(
  edge: IEdge,
  intersectionPoint: IntersectionPoint,
): [IEdge, IEdge] {
  const firstSlice = {
    polygonId: edge.polygonId,
    edgeId: edge.edgeId,
    lineSegment: [edge.lineSegment[0], intersectionPoint.coord] as LineSegment,
  };
  const secondSlice = {
    polygonId: edge.polygonId,
    edgeId: edge.edgeId,
    lineSegment: [intersectionPoint.coord, edge.lineSegment[1]] as LineSegment,
  };
  return [firstSlice, secondSlice];
}

export function findEdgeCoords(
  polygons: PolygonRecord,
  polygonId: number,
  edgeId: number,
): LineSegment {
  return [
    polygons[polygonId][edgeId],
    polygons[polygonId][(edgeId + 1) % polygons[polygonId].length],
  ];
}

export function findOtherPolygon(
  polygons: PolygonRecord,
  currentPolygonIndex: number,
) {
  return polygons[findOtherPolygonId(polygons, currentPolygonIndex)];
}

export function findOtherPolygonId(
  polygons: PolygonRecord,
  currentPolygonIndex: number,
) {
  return (currentPolygonIndex + 1) % Object.keys(polygons).length;
}

export function checkIfCornersAreEqual(corner1: ICorner, corner2: ICorner) {
  return (
    corner1.polygonId === corner2.polygonId &&
    corner1.cornerId === corner2.cornerId
  );
}

export function findIntersectionBetweenLineSegmentAndPolygonCorners(
  polygons: PolygonRecord,
  edge: IEdge,
) {
  const otherPolygonId = findOtherPolygonId(polygons, edge.polygonId);
  const otherPolygon = polygons[otherPolygonId];
  const intersectionPoints = [];
  for (let i = 0; i < otherPolygon.length; i++) {
    const otherPolygonCorner = {
      polygonId: otherPolygonId,
      cornerId: i,
      coords: findCornerCoords(otherPolygon, i),
    };
    const intersectionPoint =
      findIntersectionBetweenLineSegmentAndPolygonCorner(
        edge,
        otherPolygonCorner,
      ) as number[];
    if (!checkIfArrayIsEmpty(intersectionPoint)) {
      intersectionPoints.push({
        polygonId: otherPolygonId,
        edgeId: i,
        coord: intersectionPoint as [number, number],
      });
    }
  }
  return intersectionPoints;
}

export function findCornerCoords(polygon: Polygon, cornerId: number): Corner {
  return [
    polygon[(cornerId - 1 + polygon.length) % polygon.length],
    polygon[cornerId],
    polygon[(cornerId + 1) % polygon.length],
  ];
}

export function findIntersectionBetweenLineSegmentAndPolygonCorner(
  edge: IEdge,
  corner: ICorner,
) {
  const tolerance = 0.0001; // It's important that this tolerance is the same as MathHelpers.checkIfPointsAreEqual tolerance. In fact, all linear tolerances should be the same!
  const lineSegment = edge.lineSegment;
  const cornerCoords = corner.coords;
  let intersectionPointCoords: Point | [] = [];
  if (
    checkIfPointsAreCollinear([lineSegment[0], lineSegment[1], cornerCoords[1]])
  ) {
    const lineAxis = {
      o: lineSegment[0],
      u: findVersorBetweenPoints(lineSegment[0], lineSegment[1]),
    };
    const [A, B, C] = convertCollinearPointsTo1D(
      [lineSegment[0], lineSegment[1], cornerCoords[1]],
      lineAxis,
    );
    // If edge interior intersects corner
    if (A < C - tolerance && C + tolerance < B) {
      const polygonCornerCoords: Corner = [
        lineSegment[0],
        cornerCoords[1],
        lineSegment[1],
      ];
      if (
        checkIfTouchingCornersInteriorsIntersect(
          polygonCornerCoords,
          cornerCoords,
        )
      ) {
        intersectionPointCoords = cornerCoords[1];
      }
    }
  }
  return intersectionPointCoords;
}

export function checkIfCornersTouch(corner1: Corner, corner2: Corner) {
  return checkIfPointsAreEqual(corner1[1], corner2[1]);
}

export function checkIfTouchingCornersInteriorsIntersect(
  corner1: Corner,
  corner2: Corner,
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

export function findBisectorVersor(u: Vector, v: Vector) {
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

// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
export function findIntersectionBetweenLineSegments(
  lineSegment1: [number, number][],
  lineSegment2: [number, number][],
) {
  const tolerance = 0.0001;
  const norm1 = findVectorNorm(
    findVectorBetweenPoints(lineSegment1[0], lineSegment1[1]),
  );
  const norm2 = findVectorNorm(
    findVectorBetweenPoints(lineSegment2[0], lineSegment2[1]),
  );
  const a = lineSegment1[0];
  const b = lineSegment1[1];
  const c = lineSegment2[0];
  const d = lineSegment2[1];
  const det = (b[0] - a[0]) * (d[1] - c[1]) - (d[0] - c[0]) * (b[1] - a[1]);
  if (det !== 0) {
    const lambda =
      ((d[1] - c[1]) * (d[0] - a[0]) + (c[0] - d[0]) * (d[1] - a[1])) / det;
    const gamma =
      ((a[1] - b[1]) * (d[0] - a[0]) + (b[0] - a[0]) * (d[1] - a[1])) / det;
    if (
      0 + tolerance < lambda * norm1 &&
      lambda * norm1 < norm1 - tolerance &&
      0 + tolerance < gamma * norm2 &&
      gamma * norm2 < norm2 - tolerance
    ) {
      const ab = findVectorBetweenPoints(a, b);
      return addArray(a, multiplyArray(ab, lambda));
    }
  }
  return [];
}

export function addArray(a: number[], c: number[] | number): number[] {
  if (!Array.isArray(c)) {
    c = Array(a.length).fill(c);
  }
  return a.map((element, i) => element + (c as [])[i]);
}

export function findEdgeIdLineSegment(polygons: PolygonRecord, edge: IEdge) {
  const polygon = polygons[edge.polygonId];
  const polygonEdgeId = edge.edgeId;
  const lineSegment = [
    polygon[polygonEdgeId],
    polygon[(polygonEdgeId + 1) % polygon[polygonEdgeId].length],
  ];
  return lineSegment;
}

export function checkIfAnyLineSegmentHasTheSameDirectionIsCollinearAndIntersectsLineSegmentInterior(
  lineSegments: LineSegment[],
  lineSegment: LineSegment,
) {
  for (let i = 0; i < lineSegments.length; i++) {
    if (
      checkIfVersorsHaveTheSameDirection(
        findVersorBetweenPoints(lineSegments[i][0], lineSegments[i][1]),
        findVersorBetweenPoints(lineSegment[0], lineSegment[1]),
      )
    ) {
      if (
        checkIfLinesAreCollinear(
          lineSegments[i][0],
          lineSegments[i][1],
          lineSegment[0],
          lineSegment[1],
        )
      ) {
        if (
          checkIfCollinearLineSegmentInteriorsIntersect(
            lineSegments[i][0],
            lineSegments[i][1],
            lineSegment[0],
            lineSegment[1],
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export function checkIfVersorsHaveTheSameDirection(u: number[], v: number[]) {
  const tolerance = 0.0001;
  return Math.abs(dot(u, v)) > 1 - tolerance;
}

export function findCounterClockwiseAngleBetweenVectors(
  u: [number, number],
  v: [number, number],
) {
  u = findVectorVersor(u) as [number, number];
  v = findVectorVersor(v) as [number, number];
  const dotProduct = dot(u, v);
  const det = u[0] * v[1] - u[1] * v[0];
  const angle = ((Math.atan2(det, dotProduct) * 180) / Math.PI + 360) % 360; // In degrees
  return angle;
}

export function findVectorVersor(u: number[]): number[] {
  const n = findVectorNorm(u);
  return multiplyArray(u, 1 / n);
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

export function checkIfArrayIsEmpty<T>(a: Array<T>): boolean {
  return Array.isArray(a) && a.length === 0;
}

export function checkIfCollinearLineSegmentInteriorsIntersect(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
) {
  const lineAxis = {
    o: a,
    u: findVersorBetweenPoints(a, b),
  };
  const [a1, b1, c1, d1] = convertCollinearPointsTo1D([a, b, c, d], lineAxis);

  const min1 = Math.min(a1, b1);
  const max1 = Math.max(a1, b1);
  const min2 = Math.min(c1, d1);
  const max2 = Math.max(c1, d1);

  if (min1 >= min2 && min1 < max2) return true; // Left part of segment 1 intersects segment 2
  if (max1 > min2 && max1 <= max2) return true; // Right part of segment 1 intersects segment 2
  if (min1 < min2 && max1 > max2) return true; // Middle of segment 1 intersects segment 2
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

export function findVectorNorm(u: number[]): number {
  return Math.sqrt(u.reduce((acc, element) => acc + element ** 2, 0));
}

export function multiplyArray(a: number[], c: number): number[] {
  return a.map((element) => element * c);
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

export function dot(u: number[], v: number[]): number {
  return u.reduce((acc, element, i) => acc + element * v[i], 0);
}

export function checkIfLinesAreCollinear(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
) {
  return checkIfPointsAreCollinear([a, b, c, d]);
}

export function checkIfPointsAreCollinear(points: Point[]) {
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

export function checkIfPointsAreEqual(
  a: Array<number>,
  b: Array<number>,
): boolean {
  const tolerance = 0.0001;
  const d = findDistanceBetweenPoints(a, b);
  return d < tolerance;
}

export function findDistanceBetweenPoints(a: number[], b: number[]): number {
  const u = findVectorBetweenPoints(a, b);
  return findVectorNorm(u);
}

export function checkIfPolygonInteriorContainsPoint(
  polygon: Polygon,
  point: Point,
) {
  let numOfCrossings = 0;
  for (let i = 0; i < polygon.length; i++) {
    const lineSegment: LineSegment = [
      polygon[i],
      polygon[(i + 1) % polygon.length],
    ];
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

export function checkIfHorizontalLineCrossesNonCollinearLineSegmentToTheRight(
  horizontalLinePoint: Point,
  lineSegment: LineSegment,
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
