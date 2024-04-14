import { Polygon } from './polygon-intersection-finder-types';
import { findIntersectionBetweenPolygons } from './main';

export class PolygonUnionHelper {

    public static findIntersectionBetweenMultiplePolygons(polygons: Polygon[]) {
        if (this.checkIfArrayIsEmpty(polygons)) {
            return [];
        }
        let intersectionPolygon = polygons[0];
        for (let i = 1; i < polygons.length; i++) {
            const intersectionPolygons = findIntersectionBetweenPolygons(intersectionPolygon, polygons[i]);
            intersectionPolygon = this.findIntersectionBetweenMultiplePolygons(intersectionPolygons);
        }
        return intersectionPolygon;
    }

    public static checkIfArrayIsEmpty<T>(a: Array<T>) {
        return (Array.isArray(a) && a.length === 0);
    }

    public static findPolygonArea(polygon: Polygon) {
        let area = 0;
        for (let i = 0; i < polygon.length; i++) {
            const edge = [polygon[i], polygon[(i + 1) % polygon.length]];
            area = area + (edge[0][1] + edge[1][1]) * (edge[0][0] - edge[1][0]) / 2;
        }
        return area;
    }

    public static indexArray<T>(a: Array<T>, b: number[]): Array<T> {
        return b.map((element) => a[element]);
    }

    public static findCombinationIndexes(n: number, k: number) {
        let combinationIndexes: number[][] = [];
        let temp: number[] = [];
        [combinationIndexes, temp] = this.findCombinationIndexesHelper(n, 1, k, combinationIndexes, temp);
        return combinationIndexes;
    }

    public static findCombinationIndexesHelper(n: number, left: number, k: number, ans: number[][], temp: number[]): [number[][], number[]] {
        // Pushing this vector to a vector of vector
        if (k == 0) {
            ans.push([...temp]);
            return [ans, temp];
        }
        // i iterates from left to n. First time left will be 1
        for (let i = left; i <= n; ++i) {
            temp.push(i - 1);  // This -1 makes a combination of e.g. 3 2 by 2 be [[0,1],[1,2],[0,2]], instead of [[1,2],[2,3],[1,3]] (which is useful since these are numbers to index an array)
            [ans, temp] = this.findCombinationIndexesHelper(n, i + 1, k - 1, ans, temp);
            temp.pop();
        }
        return [ans, temp]
    }
}