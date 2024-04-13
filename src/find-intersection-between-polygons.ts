import { Point, LineSegment, Corner, Polygon, PolygonRecord, IEdge, ICorner, IIntersectionEdgePoint, IIntersectionCornerPoint, IntersectionPoint, Vector} from './polygon-intersection-types';

export class PolygonIntersectionHelper {

    public static test() {

        let polygon1: [number, number][];
        let polygon2: [number, number][];

        for (let i = 15; i < 17; i++) {

            if (i === 0) {
                polygon1 = [[0,0],[1,0],[1,1],[0,1]];
                polygon2 = [[0,-1],[2,0.5],[0,2]];  // true
            }
            else if (i === 1) {
                polygon1 = [[0,0],[1,0],[1,1],[0,1]];
                polygon2 = [[0.5,-1],[2,0.5],[0.5,2]];  // true
            }
            else if (i === 2) {
                polygon1 = [[0,0],[1,0],[1,1],[0,1]];
                polygon2 = [[1,-1],[2,0.5],[1,2]];  // false
            }
            else if (i === 3) {
                polygon1 = [[0,0],[3,0],[3,3],[0,3]];  
                polygon2 = [[1,1],[2,1.5],[1,2]];  // true
            }
            else if (i === 4) {
                polygon1 = [[0,0],[3,0],[3,3],[0,3]];
                polygon2 = [[0,0],[2,0],[1,1]];  // true
            }
            else if (i === 5) {
                polygon1 = [[0,0],[1.5,0],[0.5,1],[2.5,1],[1.5,0],[3,0],[3,3],[0,3]];
                polygon2 = [[0.5,1],[1.5,0],[2.5,1]];  // false
            }
            else if (i === 6) {
                polygon1 = [[0,0],[1.5,0],[0.5,1],[2.5,1],[1.5,0],[3,0],[3,3],[0,3]];
                polygon2 = [[0,0],[0,1],[-1,1],[-1,-1],[1,-1],[1,0]];  // false
            }
            else if (i === 7) {
                polygon1 = [[0,0],[3,0],[3,2],[2,2],[2,3],[0,3]];
                polygon2 = [[0,0.5],[1,2],[0,2.5]];  // true
            }
            else if (i === 8) {
                polygon1 = [[0,0],[4,0],[4,4],[3,4],[3,1],[2,1],[2,4],[0,4]];
                polygon2 = [[2,2],[3,2],[3,3],[2,3]];  // false  (U)
            }
            else if (i === 9) {
                polygon1 = [[0,4], [2,4], [2,1], [3,1], [3,4], [4,4], [4,5], [0,5]];
                polygon2 = [[2,2],[3,2],[3,3],[2,3]];  // true (T)
            } 
            else if (i === 10) {
                polygon1 = [[0,0],[2,0],[6,0],[0,3.75]];
                polygon2 = [[6,0],[9,9],[3,10],[2,9],[-2,5]];  // false
            }
            else if (i == 11) {
                polygon1 = [[0,0],[4,0],[4,3],[4,6],[0,6]];
                polygon2 = [[2,1],[4,3],[2,5],[2,4],[4,3],[2,2]];
            }
            else if (i == 12) {
                polygon1 = [[0,0],[6,0],[3,5],[6,10],[0,10],[3,5]];
                polygon2 = [[2,1],[4,1],[3,5],[5,9],[4,9],[3,5],[2,9],[1,9],[3,5]];
            }
            else if (i == 13) {
                polygon1 = [[0,0],[6,0],[3,5],[6,10],[0,10],[3,5]];
                polygon2 = [[2,1],[4,1],[3,5],[4,9],[2,9],[3,5],[-1,6],[-1,4],[3,5]];
            }
            else if (i == 14) {
                polygon1 = [[2,1],[4,1],[4,6],[2,6]];
                polygon2 = [[0,0],[5,0],[5,3],[1,3],[1,4],[4,3],[1,5],[1,6],[4,3],[5,7],[0,7]];
            }
            else if (i == 15) {
                polygon1 = [[2,1],[4,1],[4,6],[2,6]];
                polygon2 = [[0,0],[5,0],[5,3],[1,3],[1,4],[2.5,4],[1,5],[1,6],[4,3],[5,7],[0,7]];
            }
            else if (i == 16) {
                    polygon1 = [];
                  polygon2 = [];
            }
            else {
                return 0;
            }
            const intersectionPolygons = this.findIntersectionBetweenPolygons(polygon1, polygon2);
            console.log(intersectionPolygons);
            debugger;
        }
    }

    public static findIntersectionBetweenPolygons(polygon1: Polygon, polygon2: Polygon) {

        let polygonIntersection: Polygon[];
        if (this.checkIfArrayIsEmpty(polygon1) || this.checkIfArrayIsEmpty(polygon2)) {
            polygonIntersection = [];
        } else {
            polygonIntersection = this.findIntersectionOfPolygonWithPolygon(polygon1, polygon2);
            if (this.checkIfArrayIsEmpty(polygonIntersection)) {
                polygonIntersection = this.findIntersectionOfPolygonWithPolygon(polygon2, polygon1);
            }
        }
        return polygonIntersection;
    }

    public static findIntersectionOfPolygonWithPolygon(polygon1: Polygon, polygon2: Polygon) {

        // Create start parameters
        const polygons: PolygonRecord = {0: polygon1, 1: polygon2};
        const startEdges: IEdge[] = [{polygonId: 0, edgeId: 0, lineSegment: this.findEdgeCoords(polygons, 0, 0)}];
        const previousEdges: IEdge[] = [];
        const previousLineSegments: LineSegment[] = [];
        const intersectionPolygons: Polygon[] = [];

        while (!this.checkIfArrayIsEmpty(startEdges)) {

            // Select current edge
            let currentEdge = startEdges.shift() as IEdge;  // The typing should be unecessary since startEdgeIds cannot be empty at this point.
            
            let intersectionPolygon: Polygon = [];

            while (true) {

                // Find intersection between current line segment and other polygon
                const intersectionPoints = this.findIntersectionBetweenLineSegmentAndPolygonsEdgesAndCorners(currentEdge, polygons);

                if (!this.checkIfArrayIsEmpty(intersectionPoints)) {

                    // Pick first intersection points
                    const firstIntersectionPoints = this.findFirstIntersectionPoints(currentEdge, intersectionPoints);

                    // Find current edge intersection point
                    const currentEdgeIntersectionPoint = {polygonId: currentEdge.polygonId, edgeId: currentEdge.edgeId, coord: firstIntersectionPoints[0].coord};

                    // Divide current edge at intersection
                    const [firstSlice, secondSlice] = this.sliceEdgeAtIntersection(currentEdge, currentEdgeIntersectionPoint);

                    // If current first line segment was already analysed, close the loop
                    if (this.checkIfPolygonHasClosed(previousLineSegments, firstSlice.lineSegment)) {
                        break;
                    }

                    // Add point to intersection polygon
                    intersectionPolygon.push(currentEdgeIntersectionPoint.coord);

                    // Update previous segments
                    previousEdges.push(firstSlice);
                    previousLineSegments.push(firstSlice.lineSegment);

                    // Find next edge segment
                    const nextEdge = this.findNextEdgeSegment(polygons, currentEdgeIntersectionPoint, firstIntersectionPoints);

                    // If the current polygons next edge was not pursued, save it to pursue it later
                    if (!this.checkIfEdgesAreEqual(secondSlice, nextEdge)) {
                        startEdges.push(secondSlice);
                    }

                    // Update current edge
                    currentEdge = nextEdge;

                } else {

                    // If current edge was already analysed, close the loop
                    if (this.checkIfPolygonHasClosed(previousLineSegments, currentEdge.lineSegment)) {
                        break;
                    }

                    // Update previous segments
                    previousEdges.push(currentEdge);
                    previousLineSegments.push(currentEdge.lineSegment);

                    // Select next point
                    const currentPolygon = polygons[currentEdge.polygonId];
                    const polygonNextEdge = this.findNextPolygonEdge(polygons, currentEdge);
                    const currentPoint = {polygonId: currentEdge.polygonId, cornerId: polygonNextEdge.edgeId, coord: polygonNextEdge.lineSegment[0]};
                    const currentCorner = {polygonId: currentEdge.polygonId, cornerId: polygonNextEdge.edgeId, coords: this.findCornerCoords(currentPolygon, polygonNextEdge.edgeId)};
                    const otherPolygon = this.findOtherPolygon(polygons, currentEdge.polygonId);

                    let nextEdge;

                    // Find if current corner intersects other edges/corners (from the inside)
                    const intersectionPoints = this.findIntersectionBetweenCornerAndPolygonsEdgesAndCorners(currentCorner, polygons);
                    if (!this.checkIfArrayIsEmpty(intersectionPoints)) {
                        intersectionPolygon.push(currentPoint.coord);
                        nextEdge = this.findNextEdgeSegment(polygons, currentPoint, intersectionPoints);
                        if (!this.checkIfEdgesAreEqual(polygonNextEdge, nextEdge)) {
                            startEdges.push(polygonNextEdge);
                        }

                    // If current point lies inside other polygon
                    } else if (this.checkIfPolygonInteriorContainsPoint(otherPolygon, currentPoint.coord)) {
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

            // If polygon has at least 3 points, add it
            if (intersectionPolygon.length > 2) {
                // If the first and last points are equal, remove last. It would be better if it was not necessary.
                if (this.checkIfPointsAreEqual(intersectionPolygon[0], intersectionPolygon[intersectionPolygon.length-1])) {
                    intersectionPolygon.pop();
                }
                intersectionPolygons.push(intersectionPolygon); 
            }
        }
        return intersectionPolygons;
    }

    public static findNextEdgeSegment(polygons: PolygonRecord, intersectionPoint: IntersectionPoint, intersectionPoints: IntersectionPoint[]): IEdge {

        const currentPolygon = polygons[intersectionPoint.polygonId];

        // Find previous segment
        let previousSegment;
        if (this.checkIfIntersectionPointIsAtCorner(intersectionPoint)) {
            intersectionPoint = intersectionPoint as IIntersectionCornerPoint;  // This should not be necessary
            const previousEdgeId = (intersectionPoint.cornerId - 1 + currentPolygon.length) % currentPolygon.length;
            previousSegment = {polygonId: intersectionPoint.polygonId, edgeId: previousEdgeId, lineSegment: [currentPolygon[previousEdgeId], currentPolygon[intersectionPoint.cornerId]]};

        } else if (this.checkIfIntersectionPointIsAtEdge(intersectionPoint)) {
            intersectionPoint = intersectionPoint as IIntersectionEdgePoint;  // This should not be necessary
            previousSegment = {polygonId: intersectionPoint.polygonId, edgeId: intersectionPoint.edgeId, lineSegment: [currentPolygon[intersectionPoint.edgeId], intersectionPoint.coord]};

        } else {
            throw new Error('Intersection points was not found to be at neither a corner nor an edge!');
        }

        // Find next possible branches
        intersectionPoints.push(intersectionPoint);
        const branchSegments = [];
        let branchSegment;
        for (let intersectionPoint of intersectionPoints) {
            if (this.checkIfIntersectionPointIsAtCorner(intersectionPoint)){
                intersectionPoint = intersectionPoint as IIntersectionCornerPoint;  // This should not be necessary
                const nextEdgeId = intersectionPoint.cornerId;
                branchSegment = {polygonId: intersectionPoint.polygonId, edgeId: nextEdgeId, lineSegment: this.findEdgeCoords(polygons, intersectionPoint.polygonId, nextEdgeId)};

            } else if (this.checkIfIntersectionPointIsAtEdge(intersectionPoint)) {
                intersectionPoint = intersectionPoint as IIntersectionEdgePoint;  // This should not be necessary
                const intersectionLineSegment = this.findEdgeCoords(polygons, intersectionPoint.polygonId, intersectionPoint.edgeId);
                branchSegment = {polygonId: intersectionPoint.polygonId, edgeId: intersectionPoint.edgeId, lineSegment: [intersectionPoint.coord, intersectionLineSegment[1]] as LineSegment};

            } else {
                throw new Error('Intersection points was not found to be at neither a corner nor an edge!');
            }
            branchSegments.push(branchSegment);
        }

        // Pick branch with highest counter-clockwise angle from back vector 
        const backVector = this.findVectorBetweenPoints(previousSegment.lineSegment[1], previousSegment.lineSegment[0]) as Vector;
        branchSegments.sort(this.compareBranches(backVector));
        const nextEdge = branchSegments[branchSegments.length - 1];

        return nextEdge;
    }

    public static findFirstIntersectionPoints(currentEdge: IEdge, intersectionPoints: IntersectionPoint[]): IntersectionPoint[] {
        intersectionPoints.sort((a,b) => this.findDistanceBetweenPoints(currentEdge.lineSegment[0], a.coord) - this.findDistanceBetweenPoints(currentEdge.lineSegment[0], b.coord));
        const firstIntersectionPoint = intersectionPoints[0];
        const firstIntersectionPoints = [];
        for (const intersectionPoint of intersectionPoints) {
            if (this.checkIfPointsAreEqual(firstIntersectionPoint.coord, intersectionPoint.coord)) {
                firstIntersectionPoints.push(intersectionPoint);
            }
        }
        return firstIntersectionPoints;
    }

    public static findIntersectionBetweenLineSegmentAndPolygonsEdgesAndCorners(edge: IEdge, polygons: PolygonRecord) {
        let intersectionPoints = [];
        intersectionPoints.push(...this.findIntersectionBetweenLineSegmentAndOtherPolygonEdges(polygons, edge));  // The same polygon cannot have an edge intersected by another edge, so just check the other polygon edges
        intersectionPoints.push(...this.findIntersectionBetweenLineSegmentAndPolygonsCorners(polygons, edge));
        return intersectionPoints;
    } 

    public static findIntersectionBetweenLineSegmentAndOtherPolygonEdges(polygons: PolygonRecord, edge: IEdge): IIntersectionEdgePoint[] {
        const otherPolygonId = this.findOtherPolygonId(polygons, edge.polygonId);
        const otherPolygon = polygons[otherPolygonId];
        const intersectionPoints = [];
        for (let i = 0; i < otherPolygon.length; i++) {
            const otherLineSegment = [otherPolygon[i], otherPolygon[(i + 1) % otherPolygon.length]];
            const intersectionPoint = this.findIntersectionBetweenLineSegments(edge.lineSegment, otherLineSegment) as number[];
            if (!this.checkIfArrayIsEmpty(intersectionPoint)) {
                intersectionPoints.push({polygonId: otherPolygonId, edgeId: i, coord: intersectionPoint as [number, number]})
            }
        }
        return intersectionPoints;
    }

    public static findIntersectionBetweenCornerAndPolygonsEdgesAndCorners(corner: ICorner, polygons: PolygonRecord): IntersectionPoint[]{
        let intersectionPoints: IntersectionPoint[] = [];
        intersectionPoints.push(...this.findIntersectionBetweenCornerAndPolygonsEdges(polygons, corner));
        intersectionPoints.push(...this.findIntersectionBetweenCornerAndPolygonsCorners(polygons, corner));
        return intersectionPoints;
    }

    public static findIntersectionBetweenCornerAndPolygonsEdges(polygons: PolygonRecord, corner: ICorner): IIntersectionEdgePoint[] {
        const polygonIds = Object.keys(polygons).map(Number);
        const intersectionPoints = [];
        for (let i = 0; i < polygonIds.length; i++) {
            const polygonId = polygonIds[i];
            const polygon = polygons[polygonId];
            for (let j = 0; j < polygon.length; j++) {
                const lineSegment: LineSegment = [polygon[j], polygon[(j + 1) % polygon.length]];
                if (this.checkIfLineSegmentInteriorContainsCorner(lineSegment, corner)) {
                    intersectionPoints.push({polygonId: polygonId, edgeId: j, coord: corner.coords[1]});
                }
            }
        }
        return intersectionPoints;
    }

    public static findIntersectionBetweenCornerAndPolygonsCorners(polygons: PolygonRecord, corner: ICorner): IIntersectionCornerPoint[] {
        const polygonIds = Object.keys(polygons).map(Number);
        const intersectionCorners = [];
        for (let i = 0; i < polygonIds.length; i++) {
            const polygonId = polygonIds[i];
            const polygon = polygons[polygonId];
            for (let j = 0; j < polygon.length; j++) {
                const polygonCorner = {polygonId: polygonId, cornerId: j, coords: this.findCornerCoords(polygon, j)};
                if (!this.checkIfCornersAreEqual(corner, polygonCorner) && this.checkIfCornerInteriorsIntersect(corner, polygonCorner)) {
                    intersectionCorners.push({polygonId: polygonId, cornerId: j, coord: polygonCorner.coords[1]});
                }
            }
        }
        return intersectionCorners;
    }

    public static checkIfCornerInteriorsIntersect(corner1: ICorner, corner2: ICorner) {
        if (this.checkIfCornersTouch(corner1.coords, corner2.coords)) {
            if (this.checkIfTouchingCornersInteriorsIntersect(corner1.coords, corner2.coords)) {
                return true;
            }
        }
        return false;
    }

    public static checkIfLineSegmentInteriorContainsCorner(lineSegment: LineSegment, corner: ICorner) {
        if (this.checkIfLineSegmentInteriorContainsPoint(lineSegment, corner)) {
            const polygonCorner: Corner = [lineSegment[0], corner.coords[1], lineSegment[1]];
            if (this.checkIfTouchingCornersInteriorsIntersect(polygonCorner, corner.coords)) {
                return true;
            }
        }
        return false;
    }

    public static checkIfLineSegmentInteriorContainsPoint(lineSegment: LineSegment, corner: ICorner){
        const tolerance = 0.0001;
        if (this.checkIfPointsAreCollinear([lineSegment[0],lineSegment[1],corner.coords[1]])) {
            const lineAxis = {o: lineSegment[0], u: this.findVersorBetweenPoints(lineSegment[0], lineSegment[1])};
            const [A, B, C] = this.convertCollinearPointsTo1D([lineSegment[0],lineSegment[1],corner.coords[1]], lineAxis);
            if (A < (C - tolerance) && (C + tolerance) < B){
                return true;
            }
        }
        return false;
    }
    
    public static findIntersectionBetweenCornerAndPolygon(polygons: PolygonRecord, corner: ICorner) {

        const otherPolygonId = this.findOtherPolygonId(polygons, corner.polygonId);
        const otherPolygon = polygons[otherPolygonId];
        const cornerCoords = corner.coords;

        const tolerance = 0.0001;  // It's important that this tolerance is the same as MathHelpers.checkIfPointsAreEqual tolerance. In fact, all linear tolerances should be the same!
        const intersectionPoints = [];
        for (let i = 0; i < otherPolygon.length; i++) {
            const lineSegment = [otherPolygon[i], otherPolygon[(i + 1) % otherPolygon.length]];
            if (this.checkIfPointsAreCollinear([lineSegment[0],lineSegment[1],cornerCoords[1]])) {
                const lineAxis = {o: lineSegment[0], u: this.findVersorBetweenPoints(lineSegment[0], lineSegment[1])};
                const [A, B, C] = this.convertCollinearPointsTo1D([lineSegment[0],lineSegment[1],cornerCoords[1]], lineAxis);
                // If edge intersects point. (C + tolerance) < B excludes end point of edge of being classified into corner! This way no corners are repeated.
                if (A < (C + tolerance) && (C + tolerance) < B) {
                    let polygonCorner: Corner;
                    // If edge start point coincides with point
                    if (this.checkIfPointsAreEqual([A], [C])) {
                        polygonCorner = [otherPolygon[(i - 1 + otherPolygon.length) % otherPolygon.length], otherPolygon[i], otherPolygon[(i + 1) % otherPolygon.length]];
                    }
                    // If edge end point coincides with point
                    else if (this.checkIfPointsAreEqual([B], [C])) {
                        throw new Error('Corner was found to intersect edge without end point, but then was found to intersect end point!')
                    }
                    // If edge interior contains point
                    else {
                        polygonCorner = [lineSegment[0], cornerCoords[1], lineSegment[1]];
                    }

                    if (this.checkIfTouchingCornersInteriorsIntersect(polygonCorner, cornerCoords)) {
                        const intersectionPoint = { polygonId: otherPolygonId, edgeId: i, coord: cornerCoords[1]};
                        intersectionPoints.push(intersectionPoint);
                    }

                }
            }
        }
        return intersectionPoints;
    }

    public static findIntersectionBetweenLineSegmentAndPolygonsCorners(polygons: PolygonRecord, edge: IEdge) {
        const polygonIds = Object.keys(polygons).map(Number);
        const intersectionCorners = [];
        for (let i = 0; i < polygonIds.length; i++) {
            const polygonId = polygonIds[i];
            const polygon = polygons[polygonId];
            for (let j = 0; j < polygon.length; j++) {
                const polygonCorner = {polygonId: polygonId, cornerId: j, coords: this.findCornerCoords(polygon, j)};
                const intersectionPoint = this.findIntersectionBetweenLineSegmentAndPolygonCorner(polygons, edge, polygonCorner) as number[];
                if (!this.checkIfArrayIsEmpty(intersectionPoint)) {
                    intersectionCorners.push({polygonId: polygonId, edgeId: j, coord: intersectionPoint as [number, number]});
                }
            }
        }
        return intersectionCorners
    }

    public static checkIfEdgesAreEqual(edge1: IEdge, edge2: IEdge) {
        return (edge1.polygonId === edge2.polygonId) && (edge1.edgeId === edge2.edgeId);
    }

    public static checkIfPolygonHasClosed(previousLineSegments: LineSegment[], nextLineSegment: LineSegment) {
        for (let i = 0; i < previousLineSegments.length; i++) {
            if (this.checkIfVersorsHaveTheSameDirection(this.findVersorBetweenPoints(previousLineSegments[i][0], previousLineSegments[i][1]), this.findVersorBetweenPoints(nextLineSegment[0], nextLineSegment[1]))) {
                if (this.checkIfLinesAreCollinear(previousLineSegments[i][0], previousLineSegments[i][1], nextLineSegment[0], nextLineSegment[1])) {
                    if (this.checkIfCollinearLineSegmentInteriorsIntersect(previousLineSegments[i][0], previousLineSegments[i][1], nextLineSegment[0], nextLineSegment[1])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static checkIfIntersectionPointIsAtCorner(intersectionPoint: IntersectionPoint) {
        return Object.keys(intersectionPoint).includes('cornerId');
    }

    public static checkIfIntersectionPointIsAtEdge(intersectionPoint: IntersectionPoint) {
        return Object.keys(intersectionPoint).includes('edgeId');
    }


    public static compareBranches(backVector: Vector) {
        return function(a: {polygonId: number, edgeId: number, lineSegment: [number, number][]}, b: {polygonId: number, edgeId: number, lineSegment: [number, number][]}) {
            const branchAAngleToBack = PolygonIntersectionHelper.findCounterClockwiseAngleBetweenVectors(backVector, PolygonIntersectionHelper.findVectorBetweenPoints(a.lineSegment[0], a.lineSegment[1]) as [number, number]);
            const branchBAngleToBack = PolygonIntersectionHelper.findCounterClockwiseAngleBetweenVectors(backVector, PolygonIntersectionHelper.findVectorBetweenPoints(b.lineSegment[0], b.lineSegment[1]) as [number, number]);
            return branchAAngleToBack - branchBAngleToBack;
        }
    }

    public static findNextPolygonEdge(polygons: PolygonRecord, currentEdge: IEdge) {
        const currentPolygon = polygons[currentEdge.polygonId];
        const nextEdgeId = (currentEdge.edgeId + 1) % currentPolygon.length;
        const nextLineSegment = this.findEdgeCoords(polygons, currentEdge.polygonId, nextEdgeId);
        const nextEdge = {polygonId: currentEdge.polygonId, edgeId: nextEdgeId, lineSegment: nextLineSegment};
        return nextEdge;
    }

    public static sliceEdgeAtIntersection(edge: IEdge, intersectionPoint: IntersectionPoint): [IEdge, IEdge]{
        const firstSlice = {polygonId: edge.polygonId, edgeId: edge.edgeId, lineSegment: [edge.lineSegment[0], intersectionPoint.coord] as LineSegment};
        const secondSlice = {polygonId: edge.polygonId, edgeId: edge.edgeId, lineSegment: [intersectionPoint.coord, edge.lineSegment[1]] as LineSegment};
        return [firstSlice, secondSlice];
    }

    public static findEdgeCoords(polygons: PolygonRecord, polygonId: number, edgeId: number): LineSegment {
        return [polygons[polygonId][edgeId], polygons[polygonId][(edgeId + 1) % polygons[polygonId].length]];
    }

    public static findOtherPolygon(polygons: PolygonRecord, currentPolygonIndex: number) {
        return polygons[this.findOtherPolygonId(polygons, currentPolygonIndex)];
    }

    public static findOtherPolygonId(polygons: PolygonRecord, currentPolygonIndex: number) {
        return (currentPolygonIndex + 1) % Object.keys(polygons).length;
    }

    public static checkIfCornersAreEqual(corner1: ICorner, corner2: ICorner) {
        return (corner1.polygonId === corner2.polygonId) && (corner1.cornerId === corner2.cornerId);
    }

    public static findIntersectionBetweenLineSegmentAndPolygonCorners(polygons: PolygonRecord, edge: IEdge) {
        const otherPolygonId = this.findOtherPolygonId(polygons, edge.polygonId);
        const otherPolygon = polygons[otherPolygonId];
        const intersectionPoints = [];
        for (let i = 0; i < otherPolygon.length; i++) {
            const otherPolygonCorner = {polygonId: otherPolygonId, cornerId: i, coords: this.findCornerCoords(otherPolygon, i)};
            const intersectionPoint = this.findIntersectionBetweenLineSegmentAndPolygonCorner(polygons, edge, otherPolygonCorner) as number[];
            if (!this.checkIfArrayIsEmpty(intersectionPoint)) {
                intersectionPoints.push({polygonId: otherPolygonId, edgeId: i, coord: intersectionPoint as [number, number]});
            }
        }
        return intersectionPoints;
    }

    public static findCornerCoords(polygon: Polygon, cornerId: number):  Corner{
        return [polygon[(cornerId - 1 + polygon.length) % polygon.length], polygon[cornerId], polygon[(cornerId + 1) % polygon.length]];
    }

    public static findIntersectionBetweenLineSegmentAndPolygonCorner(polygons: PolygonRecord, edge: IEdge, corner: ICorner) {
        const tolerance = 0.0001;  // It's important that this tolerance is the same as MathHelpers.checkIfPointsAreEqual tolerance. In fact, all linear tolerances should be the same!
        const lineSegment = edge.lineSegment;
        const cornerCoords = corner.coords;
        let intersectionPointCoords: Point | [] = [];
        if (this.checkIfPointsAreCollinear([lineSegment[0],lineSegment[1],cornerCoords[1]])) {
            const lineAxis = {o: lineSegment[0], u: this.findVersorBetweenPoints(lineSegment[0], lineSegment[1])};
            const [A, B, C] = this.convertCollinearPointsTo1D([lineSegment[0],lineSegment[1],cornerCoords[1]], lineAxis);
            // If edge interior intersects corner
            if (A < (C - tolerance) && (C + tolerance) < B) {
                const polygonCornerCoords: Corner = [lineSegment[0], cornerCoords[1], lineSegment[1]];
                if (this.checkIfTouchingCornersInteriorsIntersect(polygonCornerCoords, cornerCoords)) {
                    intersectionPointCoords = cornerCoords[1];
                }
            }
        }
        return intersectionPointCoords;
    }

    public static checkIfCornersTouch(corner1: Corner, corner2: Corner) {
        return this.checkIfPointsAreEqual(corner1[1], corner2[1]);
    }

    public static checkIfTouchingCornersInteriorsIntersect(corner1: Corner, corner2: Corner) {
        const corner1Vector1 = this.findVectorBetweenPoints(corner1[1], corner1[0]) as [number, number];
        const corner1Vector2 = this.findVectorBetweenPoints(corner1[1], corner1[2]) as [number, number];
        const corner1Angle = this.findCounterClockwiseAngleBetweenVectors(corner1Vector2, corner1Vector1);
        const corner1BisectorVersor = this.findBisectorVersor(corner1Vector2, corner1Vector1);

        const corner2Vector1 = this.findVectorBetweenPoints(corner2[1], corner2[0]) as [number, number];
        const corner2Vector2 = this.findVectorBetweenPoints(corner2[1], corner2[2]) as [number, number];
        const corner2Angle = this.findCounterClockwiseAngleBetweenVectors(corner2Vector2, corner2Vector1);
        const corner2BisectorVersor = this.findBisectorVersor(corner2Vector2, corner2Vector1);
        
        const bisectorVersorsAngle = this.findSmallestAngleBetweenVectors(corner1BisectorVersor, corner2BisectorVersor);
        const maximumAngle = corner1Angle / 2 + corner2Angle / 2;
        return bisectorVersorsAngle < maximumAngle;
    }

    public static findBisectorVersor(u: Vector, v: Vector) {
        const angle = this.findCounterClockwiseAngleBetweenVectors(u,v);
        const bisectorVersor = this.rotateVectorCounterClockwise(u, angle/2);
        return bisectorVersor;
    }

    public static findSmallestAngleBetweenVectors(u: number[], v: number[]) {
        const angle = Math.acos(this.dot(this.findVectorVersor(u), this.findVectorVersor(v)))  / Math.PI * 180;
        return angle;
    }

    public static rotateVectorCounterClockwise(u: [number, number], a: number){
        a = a * Math.PI / 180;
        const v = [u[0] * Math.cos(a) - u[1] * Math.sin(a), u[0] * Math.sin(a) + u[1] * Math.cos(a)];
        return v;
    }

    public static findIntersectionBetweenLineSegments(lineSegment1: [number, number][], lineSegment2: [number, number][]) {
        const a = lineSegment1[0];
        const b = lineSegment1[1];
        const c = lineSegment2[0];
        const d = lineSegment2[1];
        const det = (b[0] - a[0]) * (d[1] - c[1]) - (d[0] - c[0]) * (b[1] - a[1]);
        if (det !== 0) {
            const lambda = ((d[1] - c[1]) * (d[0] - a[0]) + (c[0] - d[0]) * (d[1] - a[1])) / det;
            const gamma = ((a[1] - b[1]) * (d[0] - a[0]) + (b[0] - a[0]) * (d[1] - a[1])) / det;
            if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)) {
                const ab = this.findVectorBetweenPoints(a, b)
                return this.addArray(a, this.multiplyArray(ab, lambda));
            }
        }
        return [];
    }

    public static addArray(a: number[], c: number[] | number): number[] {
        if (!Array.isArray(c)) {
          c = Array(a.length).fill(c);
        }
        return a.map((element, i) => element + (c as [])[i]);
    }


    public static findEdgeIdLineSegment(polygons: PolygonRecord, edge: IEdge) {
        const polygon = polygons[edge.polygonId];
        const polygonEdgeId = edge.edgeId;
        const lineSegment = [polygon[polygonEdgeId], polygon[(polygonEdgeId + 1) % polygon[polygonEdgeId].length]];
        return lineSegment;
    }

    public static checkIfAnyLineSegmentHasTheSameDirectionIsCollinearAndIntersectsLineSegmentInterior(lineSegments: LineSegment[], lineSegment: LineSegment) {
        for (let i = 0; i < lineSegments.length; i++) {
            if (this.checkIfVersorsHaveTheSameDirection(this.findVersorBetweenPoints(lineSegments[i][0], lineSegments[i][1]), this.findVersorBetweenPoints(lineSegment[0], lineSegment[1]))) {
                if (this.checkIfLinesAreCollinear(lineSegments[i][0], lineSegments[i][1], lineSegment[0], lineSegment[1])) {
                    if (this.checkIfCollinearLineSegmentInteriorsIntersect(lineSegments[i][0], lineSegments[i][1], lineSegment[0], lineSegment[1])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static checkIfVersorsHaveTheSameDirection(u: number[], v: number[]) {
        const tolerance = 0.0001;
        return Math.abs(this.dot(u, v)) > (1 - tolerance);
    }

    public static findCounterClockwiseAngleBetweenVectors(u: [number, number], v: [number, number]) {
        u = this.findVectorVersor(u) as [number, number];
        v = this.findVectorVersor(v) as [number, number];
        const dot = this.dot(u, v);
        const det = u[0] * v[1] - u[1] * v[0]; 
        const angle = (Math.atan2(det, dot) * 180 / Math.PI + 360) % 360;  // In degrees
        return angle;
    }

    public static findVectorVersor(u: number[]): number[] {
        const n = this.findVectorNorm(u);
        return this.multiplyArray(u, 1 / n);
    }

    public static checkIfEdgeIntersectsEdge(a: [number, number], b: [number, number], c: [number, number], d: [number, number]) {
        if (!this.checkIfLinesAreParallel(a,b,c,d)) {
            if (this.checkIfNonParallelLineSegmentInteriorsIntersect(a,b,c,d)) {
                return true;
            }
        }
        return false;
    }

    public static checkIfLinesAreParallel(a: [number, number], b: [number, number], c: [number, number], d: [number, number]) {
        const det = (b[0] - a[0]) * (d[1] - c[1]) - (d[0] - c[0]) * (b[1] - a[1]);
        return det === 0;
    }

    public static checkIfNonParallelLineSegmentInteriorsIntersect(a: [number, number], b: [number, number], c: [number, number], d: [number, number]) {
        const det = (b[0] - a[0]) * (d[1] - c[1]) - (d[0] - c[0]) * (b[1] - a[1]);
        const lambda = ((d[1] - c[1]) * (d[0] - a[0]) + (c[0] - d[0]) * (d[1] - a[1])) / det;
        const gamma = ((a[1] - b[1]) * (d[0] - a[0]) + (b[0] - a[0]) * (d[1] - a[1])) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }


    public static checkIfArrayIsEmpty(a: Array<any>) {
        return (Array.isArray(a) && a.length === 0);
    }

    public static checkIfCollinearLineSegmentInteriorsIntersect(a: [number, number], b: [number, number], c: [number, number], d: [number, number]) {

        const lineAxis = { o: a, u: this.findVersorBetweenPoints(a, b) }; const [a1, b1, c1, d1] = this.convertCollinearPointsTo1D([a, b, c, d], lineAxis);

        const min1 = Math.min(a1, b1);
        const max1 = Math.max(a1, b1);
        const min2 = Math.min(c1, d1);
        const max2 = Math.max(c1, d1);

        if (min1 >= min2 && min1 < max2) return true;  // Left part of segment 1 intersects segment 2
        if (max1 > min2 && max1 <= max2) return true;  // Right part of segment 1 intersects segment 2
        if (min1 < min2 && max1 > max2) return true;  // Middle of segment 1 intersects segment 2
        return false;
    }

    public static findVersorBetweenPoints(a: number[], b: number[]): number[] {
        const u = this.findVectorBetweenPoints(a, b);
        const n = this.findVectorNorm(u);
        return this.multiplyArray(u, 1 / n);
    }

    public static findVectorBetweenPoints(a: number[], b: number[]): number[] {
        return b.map((element, i) => element - a[i]);
    }

    public static findVectorNorm(u: number[]): number {
        return Math.sqrt(u.reduce((acc, element) => acc + Math.pow(element, 2), 0));
    }

    public static multiplyArray(a: number[], c: number): number[] {
        return a.map((element) => element * c);
    }

    public static convertCollinearPointsTo1D(a: number[][], lineAxis: { o: number[], u: number[] }) {
        const points1D = [];
        for (let p of a) {
            const v = this.findVectorBetweenPoints(lineAxis.o, p);
            points1D.push(this.dot(v, lineAxis.u));
        }
        return points1D;
    }

    public static dot(u: number[], v: number[]): number {
        return u.reduce((acc, element, i) => acc + element * v[i], 0);
    }

    public static checkIfLinesAreCollinear(a: [number, number], b: [number, number], c: [number, number], d: [number, number]) {
        return this.checkIfPointsAreCollinear([a, b, c, d]);
    }

    public static checkIfPointsAreCollinear(points: Point[]) {
        const tolerance = 0.0001;
        let u: number[] = [];
        const nonCollinearPoints = [points[0]];
        for (let i = 1; i < points.length; i++) {
            if (!this.checkIfPointsContainPoint(nonCollinearPoints, points[i])) {
                if (this.checkIfArrayIsEmpty(u)) {
                    u = this.findVersorBetweenPoints(nonCollinearPoints[0], points[i]);
                } else {
                    const v = this.findVersorBetweenPoints(nonCollinearPoints[0], points[i]);
                    if (Math.abs(this.dot(u, v)) < 1 - tolerance) {
                        return false;
                    }
                }
            }
            nonCollinearPoints.push(points[i]);
        }
        return true;
    }

    public static checkIfPointsContainPoint(points: number[][], point: number[]) {
        for (let p of points) {
            if (this.checkIfPointsAreEqual(p, point)) {
                return true;
            }
        }
        return false;
    }

    public static checkIfPointsAreEqual(a: Array<any>, b: Array<any>) {
        const tolerance = 0.0001;
        const d = this.findDistanceBetweenPoints(a, b);
        return d < tolerance;
    }

    public static findDistanceBetweenPoints(a: number[], b: number[]): number {
        const u = this.findVectorBetweenPoints(a, b);
        return this.findVectorNorm(u);
    }

    public static checkIfPolygonInteriorContainsPoint(polygon: Polygon, point: Point) {
        let numOfCrossings = 0;
        for (let i = 0; i < polygon.length; i++) {
            const lineSegment: LineSegment = [polygon[i], polygon[(i + 1) % polygon.length]];
            // If edge contains point, polygon interior does not contain point
            if (this.checkIfPointsAreCollinear([lineSegment[0],lineSegment[1],point])) {
                const lineAxis = {o: lineSegment[0], u: this.findVersorBetweenPoints(lineSegment[0], lineSegment[1])};
                const [A, B, C] = this.convertCollinearPointsTo1D([lineSegment[0],lineSegment[1],point], lineAxis);
                const tolerance = 0.0001;
                if (A < (C + tolerance) && (C - tolerance) < B) {
                    return false;
                }
            }
            else {
                if (this.checkIfHorizontalLineCrossesNonCollinearLineSegmentToTheRight(point, lineSegment)) {
                    numOfCrossings++;
                }
            }
        }
        return this.checkIfNumberIsOdd(numOfCrossings);
    }

    public static checkIfHorizontalLineCrossesNonCollinearLineSegmentToTheRight(horizontalLinePoint: Point, lineSegment: LineSegment) {
        const tolerance = 0.0001;
        const A = lineSegment[0];
        const B = lineSegment[1];
        const C = horizontalLinePoint;
        const AyCyBy = (((A[1] - tolerance) < C[1]) && ((B[1] - tolerance) > C[1])); // This checks if horizontal line crosses line segment (with a positive margin below and a negative margin above)
        const ByCyAy = (((A[1] - tolerance) > C[1]) && (B[1] - tolerance < C[1]));
        return (AyCyBy || ByCyAy) && (C[0] < ((B[0] - A[0]) * (C[1] - A[1]) / (B[1] - A[1]) + A[0] - tolerance));  // If line crosses line segment to the right
    }

    public static checkIfNumberIsOdd(n: number) {
        return Math.abs(n % 2) == 1;
     }
}