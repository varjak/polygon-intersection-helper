import { expect, describe, it } from 'vitest'
import { checkIfPolygonsIntersect } from '../src/main';

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