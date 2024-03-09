export class PolygonIntersectionHelper{

    public static test() {

        let polygon1: [number, number][];
        let polygon2: [number, number][];

        for (let i = 0; i < 10; i++) {

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
            else {
                return 0;
            }
            console.log(this.checkIfPolygonsIntersect(polygon1, polygon2));
            debugger;
        }
        
    }

    // Polygons must have the same point order! (clock-wise or anti-clock-wise)
    public static checkIfPolygonsIntersect(polygon1: [number, number][], polygon2: [number, number][]) {
        if (this.checkIfPolygonEdgesIntersectAnyEdge(polygon1, polygon2)) return true;
        if (this.checkIfPolygonInteriorContainsAnyPoint(polygon1, polygon2) || this.checkIfPolygonInteriorContainsAnyPoint(polygon2, polygon1)) return true;
        if (this.checkIfPolygonEdgesIntersectAnyCorner(polygon1, polygon2) || this.checkIfPolygonEdgesIntersectAnyCorner(polygon2, polygon1)) return true;
        return false;
    }

    public static checkIfPolygonEdgesIntersectAnyEdge(polygon1: [number, number][], polygon2:  [number, number][]) {
        for (let i = 0; i < polygon1.length; i++) {
            const lineSegment1 = [polygon1[i], polygon1[(i + 1) % polygon1.length]];
            for (let j = 0; j < polygon2.length; j++) {
                const lineSegment2 = [polygon2[j], polygon2[(j + 1) % polygon2.length]];
                if (this.checkIfEdgeIntersectsEdge(lineSegment1[0], lineSegment1[1], lineSegment2[0], lineSegment2[1])) {
                    return true;
                }
            }        
        }
        return false;
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

    public static checkIfPolygonInteriorContainsAnyPoint(polygon1: [number, number][], polygon2: [number, number][]) {
        for (let polygon2Point of polygon2) {
            const polygonCointainsPoint = this.checkIfPolygonInteriorContainsPoint(polygon1, polygon2Point);
            if (polygonCointainsPoint) {
                return true;
            } 
        }
        return false;
    }

    public static checkIfPolygonInteriorContainsPoint(polygon: [number, number][], point: [number, number]) {
        let numOfCrossings = 0;
        for (let i = 0; i < polygon.length; i++) {
            const lineSegment = [polygon[i], polygon[(i + 1) % polygon.length]];
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

    public static convertCollinearPointsTo1D(a: number[][], lineAxis: {o:number[], u: number[]}) {
        const points1D = [];
        for (let p of a) {
          const v = this.findVectorBetweenPoints(lineAxis.o, p);
          points1D.push(this.dot(v,lineAxis.u));
        }
        return points1D;
      }

    public static checkIfHorizontalLineCrossesNonCollinearLineSegmentToTheRight(horizontalLinePoint: [number, number], lineSegment: [number, number][]) {
        const tolerance = 0.0001;
        const A = lineSegment[0];
        const B = lineSegment[1];
        const C = horizontalLinePoint;
        const AyCyBy = (((A[1] - tolerance) < C[1]) && ((B[1] - tolerance) > C[1])); // This checks if horizontal line crosses line segment (with a positive margin below and a negative margin above)
        const ByCyAy = (((A[1] - tolerance) > C[1]) && (B[1] - tolerance < C[1]));
        return ( AyCyBy || ByCyAy ) &&  (C[0] < ((B[0] - A[0]) * (C[1] - A[1]) / (A[1] - B[1]) + B[0] - tolerance));  // If line crosses line segment to the right
    }

    public static checkIfNumberIsOdd(n: number) {
        return Math.abs(n % 2) == 1;
     }

    public static checkIfPolygonEdgesIntersectAnyCorner(polygon1: [number, number][], polygon2: [number, number][]) {
        for (let i = 0; i < polygon2.length; i++) {
            const polygon2Corner = [polygon2[(i - 1 + polygon2.length) % polygon2.length], polygon2[i], polygon2[(i + 1) % polygon2.length]];
            if (this.checkIfPolygonEdgesIntersectCorner(polygon1, polygon2Corner)) {
                return true;
            }
        }
        return false;
    }

    public static checkIfPolygonEdgesIntersectCorner(polygon: [number, number][], corner: [number, number][]) {
        const tolerance = 0.0001;  // It's important that this tolerance is the same as MathHelpers.checkIfPointsAreEqual tolerance. In fact, all linear tolerances should be the same!
        for (let i = 0; i < polygon.length; i++) {
            const lineSegment = [polygon[i], polygon[(i + 1) % polygon.length]];
            if (this.checkIfPointsAreCollinear([lineSegment[0],lineSegment[1],corner[1]])) {
                const lineAxis = {o: lineSegment[0], u: this.findVersorBetweenPoints(lineSegment[0], lineSegment[1])};
                const [A, B, C] = this.convertCollinearPointsTo1D([lineSegment[0],lineSegment[1],corner[1]], lineAxis);
                // If edge intersects point
                if (A < (C + tolerance) && (C - tolerance) < B) {
                    let polygonCorner;
                    // If edge start point coincides with point
                    if (this.checkIfPointsAreEqual([A], [C])) {
                        polygonCorner = [polygon[(i - 1 + polygon.length) % polygon.length], polygon[i], polygon[(i + 1) % polygon.length]];
                    }
                    // If edge end point coincides with point
                    else if (this.checkIfPointsAreEqual([B], [C])) {
                        polygonCorner = [polygon[i], polygon[(i + 1) % polygon.length], polygon[(i + 2) % polygon.length]];
                    }
                    // If edge interior contains point
                    else {
                        polygonCorner = [lineSegment[0], corner[1], lineSegment[1]];
                    }
                    return this.checkIfCornersIntersect(polygonCorner, corner);
                }
            }
        }
    return false;
    }

    public static checkIfPointsAreCollinear(points: number[][]) {
        const tolerance = 0.0001;
        let u: number[] = [];
        const nonCollinearPoints = [points[0]];
        for (let i = 1; i < points.length; i++) {
          if (!this.checkIfPointsContainPoint(nonCollinearPoints, points[i])) {
            if (this.checkIfArrayIsEmpty(u)) {
              u = this.findVersorBetweenPoints(nonCollinearPoints[0], points[i]);
            } else {
              const v = this.findVersorBetweenPoints(nonCollinearPoints[0], points[i]);
              if (Math.abs(this.dot(u,v)) < 1 - tolerance) {
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

    public static findVersorBetweenPoints(a: number[], b: number[]): number[] {
        const u = this.findVectorBetweenPoints(a, b);
        const n = this.findVectorNorm(u);
        return this.multiplyArray(u, 1 / n);
    }
    
    public static findVectorBetweenPoints(a: number[], b: number[]): number[] {
    return b.map((element, i) => element - a[i]);
    }

    public static dot(u: number[], v: number[]): number {
        return u.reduce((acc, element, i) => acc + element * v[i], 0);
    }

    public static checkIfArrayIsEmpty(a: Array<any>) {
        return (Array.isArray(a) && a.length === 0);
    }

    public static checkIfPointsAreEqual(a: Array<any>, b: Array<any>) {
    const tolerance = 0.0001;
    const d = this.findDistanceBetweenPoints(a, b);
    return d < tolerance;
    }

    public static findVectorNorm(u: number[]): number {
        return Math.sqrt(u.reduce((acc, element) => acc + Math.pow(element, 2), 0));
    }

    public static multiplyArray(a: number[], c: number): number[] {
        return a.map((element) => element * c);
    }

    public static findDistanceBetweenPoints(a: number[], b: number[]): number {
        const u = this.findVectorBetweenPoints(a, b);
        return this.findVectorNorm(u);
    }

    public static checkIfCornersIntersect(corner1: [number, number][], corner2: [number, number][]) {
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

    public static findBisectorVersor(u: [number, number], v: [number, number]) {
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
}
