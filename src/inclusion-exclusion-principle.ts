import { Polygon } from './polygon-intersection-types';
import { PolygonIntersectionHelper } from './find-intersection-between-polygons'


export class PolygonUnionHelper {

    public static test() {


        const polygon1: Polygon = [[0,0],[1,0],[1,1],[0,1]];
        const polygon2: Polygon = [[0.5,0],[1.5,0],[1.5,1],[0.5,1]];
        const polygon3: Polygon = [[1,0],[2,0],[2,1],[1,1]];
        const polygon4: Polygon = [[1,1],[2,1],[2,2],[1,2]];
        const polygon5: Polygon = [[1,0.5],[2,0.5],[2,1.5],[1,1.5]];
        const polygon6: Polygon = [[0.5,0.5],[1.5,0.5],[1.5,1.5],[0.5,1.5]];
        const polygon7: Polygon = [[0,0],[0.999,0],[1,1],[0,1]];

        // const polygons = [polygon1, polygon4, polygon5];
        // const polygons = [polygon1, polygon4, polygon6];

        let polygons: Polygon[];

        for (let i = 7; i < 8; i++) {

            if (i === 0) {
                polygons = [polygon1, polygon1];  // 1
            }
            else if (i === 1) {
                polygons = [polygon1, polygon2];  // 1.5
            }
            else if (i === 2) {
                polygons = [polygon1, polygon3];  // 2
            }
            else if (i === 3) {
                polygons = [polygon1, polygon1, polygon1];  // 1
            }
            else if (i === 4) {
                polygons = [polygon1, polygon3, polygon4];  // 3
            }
            else if (i === 5) {
                polygons = [polygon1, polygon3, polygon5];  // 2.5
            } 
            else if (i === 6) {
                polygons = [polygon1, polygon3, polygon6];  // 2.5
            } 
            else if (i === 7) {
                polygons = [polygon7];  // 0
            } 
            else if (i === 8) {
                polygons = [];  // 0
            } 
            else {
                return 0;
            }

            const area = this.findAreaOfUnionOfPolygons(polygons);
            console.log(area);
            debugger;
        }
        debugger;
    }

    public static findAreaOfUnionOfPolygons(polygons: Polygon[]) {
        const n = polygons.length;
        let unionArea = 0;
        for (let k = 0; k < n; k++) {
            const combinationIndexes = this.findCombinationIndexes(n, k + 1);
            for (let i = 0; i < combinationIndexes.length; i++) {
                const intersectionPolygon = this.findIntersectionBetweenMultiplePolygons(this.indexArray(polygons, combinationIndexes[i]));
                const intersectionArea = this.findPolygonArea(intersectionPolygon);
                unionArea = unionArea + ((-1) ** k) * intersectionArea;
            }
        }
        return unionArea;
    }

    public static findIntersectionBetweenMultiplePolygons(polygons: Polygon[]) {
        if (this.checkIfArrayIsEmpty(polygons)) {
            return [];
        }
        let intersectionPolygon = polygons[0];
        for (let i = 1; i < polygons.length; i++) {
            const intersectionPolygons = PolygonIntersectionHelper.findIntersectionBetweenPolygons(intersectionPolygon, polygons[i]);
            intersectionPolygon = this.findIntersectionBetweenMultiplePolygons(intersectionPolygons);
        }
        return intersectionPolygon;
    }

    public static checkIfArrayIsEmpty(a: Array<any>) {
        return (Array.isArray(a) && a.length === 0);
      }

    public static findPolygonArea(polygon: Polygon) {
        let area = 0;
        for (let i = 0; i < polygon.length; i++) { 
            const edge = [polygon[i], polygon[(i + 1) % polygon.length]];
            area = area +  (edge[0][1] + edge[1][1]) * (edge[0][0] - edge[1][0]) / 2; 
        }   
        return area; 
    }

    public static indexArray(a: Array<unknown>, b: number[]): Array<any> {
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
            temp.push(i-1);  // This -1 makes a combination of e.g. 3 2 by 2 be [[0,1],[1,2],[0,2]], instead of [[1,2],[2,3],[1,3]] (which is useful since these are numbers to index an array)
            [ans, temp] = this.findCombinationIndexesHelper(n, i + 1, k - 1, ans, temp);
            temp.pop();
        }
        return [ans, temp]
    }
}