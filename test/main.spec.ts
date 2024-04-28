import { expect, describe, it } from 'vitest'
import { checkIfPolygonsIntersect, findAreaOfUnionOfPolygons, findIntersectionBetweenPolygons } from '../src/main';
import { checkIfArraysOfPolygonsAreEqual } from './test-utils';
import { Polygon } from '../src/polygon-intersection-finder-types';

describe('checkIfPolygonsIntersect', () => {
    let polygon1: [number, number][];
    let polygon2: [number, number][];

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[0, -1], [2, 0.5], [0, 2]];
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[0.5, -1], [2, 0.5], [0.5, 2]];  // true
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
            polygon2 = [[1, -1], [2, 0.5], [1, 2]];  // false
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(false);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[1, 1], [2, 1.5], [1, 2]];  // true
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[0, 0], [2, 0], [1, 1]];  // true
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [1.5, 0], [0.5, 1], [2.5, 1], [1.5, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[0.5, 1], [1.5, 0], [2.5, 1]];  // false
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(false);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [1.5, 0], [0.5, 1], [2.5, 1], [1.5, 0], [3, 0], [3, 3], [0, 3]];
            polygon2 = [[0, 0], [0, 1], [-1, 1], [-1, -1], [1, -1], [1, 0]];  // false
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(false);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [3, 0], [3, 2], [2, 2], [2, 3], [0, 3]];
            polygon2 = [[0, 0.5], [1, 2], [0, 2.5]];  // true
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should not intersect', () => {
            polygon1 = [[0, 0], [4, 0], [4, 4], [3, 4], [3, 1], [2, 1], [2, 4], [0, 4]];
            polygon2 = [[2, 2], [3, 2], [3, 3], [2, 3]];  // false  (U)
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(false);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 4], [2, 4], [2, 1], [3, 1], [3, 4], [4, 4], [4, 5], [0, 5]];
            polygon2 = [[2, 2], [3, 2], [3, 3], [2, 3]];  // true (T)
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(true);
        });
    });

    describe('when polygon1 and polygon2 something something', () => {
        it('should intersect', () => {
            polygon1 = [[0, 0], [2, 0], [6, 0], [0, 3.75]];
            polygon2 = [[6, 0], [9, 9], [3, 10], [2, 9], [-2, 5]];  // false
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(false);
        });
    });

    describe('when polygon1 and polygon2 are empty arrays', () => {
        it('should not intersect', () => {
            polygon1 = [];
            polygon2 = [];
            const result = checkIfPolygonsIntersect(polygon1, polygon2);
            expect(result).toBe(false);
        });
    });
});

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

describe('findAreaOfUnionOfPolygons', () => {
    const polygon1: Polygon = [[0, 0], [1, 0], [1, 1], [0, 1]];
    const polygon2: Polygon = [[0.5, 0], [1.5, 0], [1.5, 1], [0.5, 1]];
    const polygon3: Polygon = [[1, 0], [2, 0], [2, 1], [1, 1]];
    const polygon4: Polygon = [[1, 1], [2, 1], [2, 2], [1, 2]];
    const polygon5: Polygon = [[1, 0.5], [2, 0.5], [2, 1.5], [1, 1.5]];
    const polygon6: Polygon = [[0.5, 0.5], [1.5, 0.5], [1.5, 1.5], [0.5, 1.5]];

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon1]);
            expect(result).toEqual(1)
        });
    });

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon2]);
            expect(result).toEqual(1.5)
        });
    });

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon3]);
            expect(result).toEqual(2)
        });
    });

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon1, polygon1]);
            expect(result).toEqual(1)
        });
    });

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon3, polygon4]);
            expect(result).toEqual(3)
        });
    });

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon3, polygon5]);
            expect(result).toEqual(2.5)
        });
    });

    describe('when we have the same two polygons on the same coordinates', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([polygon1, polygon3, polygon6]);
            expect(result).toEqual(2.5)
        });
    });

    describe('when we have an empty polygon', () => {
        it('should have an area', () => {
            const result = findAreaOfUnionOfPolygons([]);
            expect(result).toEqual(0)
        });
    });

});