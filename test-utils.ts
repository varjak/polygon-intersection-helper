export function checkIfArraysOfPolygonsAreEqual(a: number[][][], b: number[][][]) {
    if (a.length === b.length) {
        const numberOfPolygons = a.length;
        // This considers two empty arrays to be equal
        if (numberOfPolygons === 0) {
            return true;
        }
        const matchingPolygons1 = new Array(numberOfPolygons).fill(false);
        const matchingPolygons2 = new Array(numberOfPolygons).fill(false);
        for (let i = 0; i < numberOfPolygons; i++) {
            for (let j = 0; j < numberOfPolygons; j++) {
                if (checkIfPolygonsAreEqual(a[i], b[j])) {
                    matchingPolygons1[i] = true;
                    matchingPolygons2[j] = true;
                    break;
                }
            }
        }
        if (matchingPolygons1.every(e => e === true) && matchingPolygons2.every(e => e === true)) {
            return true;
        }
    }
    return false;
}

function checkIfPolygonsAreEqual(polygon1: number[][], polygon2: number[][]) {
    if (polygon1.length === polygon2.length) {
        const polygonLength = polygon1.length;
        // This considers two empty faces to be equal
        if (polygonLength === 0) {
            return true;
        }
        for (let i = 0; i < polygonLength; i++) {
            if (checkIfPointsAreEqual(polygon1[0], polygon2[i])) {
                const matchingElements = new Array(polygonLength).fill(false);
                const shiftedFace2: number[][] = [];
                for (let j = i; j < i + polygonLength; j++) {
                    shiftedFace2.push(polygon2[j % polygon2.length]);
                }
                for (let j = 0; j < polygonLength; j++) {
                    if (checkIfPointsAreEqual(polygon1[j], shiftedFace2[j])) {
                        matchingElements[j] = true;
                    }
                }
                if (matchingElements.every(e => e === true)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkIfPointsAreEqual(a: Array<any>, b: Array<any>) {
    const tolerance = 0.0001;
    const d = findDistanceBetweenPoints(a, b);
    return d < tolerance;
}

function findDistanceBetweenPoints(a: number[], b: number[]): number {
    const u = findVectorBetweenPoints(a, b);
    return findVectorNorm(u);
}

function findVectorBetweenPoints(a: number[], b: number[]): number[] {
    return b.map((element, i) => element - a[i]);
}

function findVectorNorm(u: number[]): number {
    return Math.sqrt(u.reduce((acc, element) => acc + Math.pow(element, 2), 0));
}
