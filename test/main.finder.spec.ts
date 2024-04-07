import { expect, describe, it } from 'vitest'
import { checkIfPolygonsIntersect } from '../src/main';

//
function checkIfArraysOfPolygonsAreEqual(a: number[][][], b: number[][][]) {
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

//
describe('findIntersectionBetweenPolygons', () => {
    let polygon1: [number, number][];
    let polygon2: [number, number][];
    let expectedResult: [number, number][][];

    describe('when polygon1 and polygon2 something something', () => {

        it('should intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[0, -1], [2, 0.5], [0, 2]];
            expectedResult = [[[0, 0], [1, 0], [1, 1], [0, 1]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[0.5, -1], [2, 0.5], [0.5, 2]];
            expectedResult = [[[0.5, 0], [1, 0], [1, 1], [0.5, 1]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[1, -1], [2, 0.5], [1, 2]];
            expectedResult = [];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[1, 1], [2, 1.5], [1, 2]];  // true
            expectedResult = [[[1, 1], [2, 1.5], [1, 2]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[0, 0], [2, 0], [1, 1]];  // true
            expectedResult = [[[0, 0], [2, 0], [1, 1]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [1.5, 0], [0.5, 1], [2.5, 1], [1.5, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[0.5, 1], [1.5, 0], [2.5, 1]];  // false
            expectedResult = [];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [1.5, 0], [0.5, 1], [2.5, 1], [1.5, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[0, 0], [0, 1], [-1, 1], [-1, -1], [1, -1], [1, 0]];  // false
            expectedResult = [];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [3, 0], [3, 2], [2, 2], [2, 3], [0, 3]];
            polygon2 = [[0, 0.5], [1, 2], [0, 2.5]];  // true
            expectedResult = [[[0, 0.5], [1, 2], [0, 2.5]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [4, 0], [4, 4], [3, 4], [3, 1], [2, 1], [2, 4], [0, 4]];
            polygon2 = [[2, 2], [3, 2], [3, 3], [2, 3]];  // false  (U)
            expectedResult = [];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 4], [2, 4], [2, 1], [3, 1], [3, 4], [4, 4], [4, 5], [0, 5]];
            polygon2 = [[2, 2], [3, 2], [3, 3], [2, 3]];  // true (T)
            expectedResult = [[[2, 2], [3, 2], [3, 3], [2, 3]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [2, 0], [6, 0], [0, 3.75]];
            polygon2 = [[6, 0], [9, 9], [3, 10], [2, 9], [-2, 5]];  // false
            expectedResult = [];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [4, 0], [4, 6], [0, 6]];
            polygon2 = [[2, 1], [4, 3], [2, 5], [2, 4], [4, 3], [2, 2]];
            expectedResult = [[[2, 1], [4, 3], [2, 2]], [[4, 3], [2, 5], [2, 4]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [6, 0], [3, 5], [6, 10], [0, 10], [3, 5]];
            polygon2 = [[2, 1], [4, 1], [3, 5], [5, 9], [4, 9], [3, 5], [2, 9], [1, 9], [3, 5]];
            expectedResult = [[[3, 5], [2, 1], [4, 1]], [[3, 5], [5, 9], [4, 9]], [[3, 5], [2, 9], [1, 9]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [6, 0], [3, 5], [6, 10], [0, 10], [3, 5]];
            polygon2 = [[2, 1], [4, 1], [3, 5], [4, 9], [2, 9], [3, 5], [-1, 6], [-1, 4], [3, 5]];
            expectedResult = [[[3, 5], [2, 1], [4, 1]], [[3, 5], [4, 9], [2, 9]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[2, 1], [4, 1], [4, 6], [2, 6]];
            polygon2 = [[0, 0], [5, 0], [5, 3], [1, 3], [1, 4], [4, 3], [1, 5], [1, 6], [4, 3], [5, 7], [0, 7]];
            expectedResult = [[[2, 1], [4, 1], [4, 3], [2, 3]], [[4, 3], [4, 6], [2, 6], [2, 5]], [[4, 3], [2, 4.333333], [2, 3.666666]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[2, 1], [4, 1], [4, 6], [2, 6]];
            polygon2 = [[0, 0], [5, 0], [5, 3], [1, 3], [1, 4], [2.5, 4], [1, 5], [1, 6], [4, 3], [5, 7], [0, 7]];
            expectedResult = [[[2, 1], [4, 1], [4, 3], [2, 3]], [[4, 3], [4, 6], [2, 6], [2, 5]], [[2.5, 4], [2, 4.333333], [2, 4]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            expectedResult = [[[0, 0], [1, 0], [1, 1], [0, 1]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[0, 0], [0.5, 0], [0.5, 1], [0, 1]];
            expectedResult = [[[0, 0], [0.5, 0], [0.5, 1], [0, 1]]];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 are empty arrays', () => {
        it('should not intersect', () => {
            polygon1 = [];
            polygon2 = [];
            expectedResult = [];
            const result = findIntersectionBetweenPolygons(polygon1, polygon2);
            const isResultExpected = checkIfArraysOfPolygonsAreEqual(result, expectedResult)
            expect(isResultExpected).toBe(true);
        });
    });
});