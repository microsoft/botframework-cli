/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Utility } from "./Utility";

export class ListArrayUtility {

    public static InsertionQuickSortNumberOfInstancesThreshold: number = 128;

    public static insertionSort1<T>(
        arrayT: T[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            j = i;
        }
    }
    public static insertionSort2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            const aU: U = arrayU[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                arrayU[jNext] = arrayU[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            arrayU[jNextOutside] = aU;
            j = i;
        }
    }
    public static insertionSort3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            const aU: U = arrayU[i];
            const aV: V = arrayV[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                arrayU[jNext] = arrayU[j];
                arrayV[jNext] = arrayV[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            arrayU[jNextOutside] = aU;
            arrayV[jNextOutside] = aV;
            j = i;
        }
    }
    public static insertionSort4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            const aU: U = arrayU[i];
            const aV: V = arrayV[i];
            const aW: W = arrayW[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                arrayU[jNext] = arrayU[j];
                arrayV[jNext] = arrayV[j];
                arrayW[jNext] = arrayW[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            arrayU[jNextOutside] = aU;
            arrayV[jNextOutside] = aV;
            arrayW[jNextOutside] = aW;
            j = i;
        }
    }
    public static insertionSort5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            const aU: U = arrayU[i];
            const aV: V = arrayV[i];
            const aW: W = arrayW[i];
            const aX: X = arrayX[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                arrayU[jNext] = arrayU[j];
                arrayV[jNext] = arrayV[j];
                arrayW[jNext] = arrayW[j];
                arrayX[jNext] = arrayX[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            arrayU[jNextOutside] = aU;
            arrayV[jNextOutside] = aV;
            arrayW[jNextOutside] = aW;
            arrayX[jNextOutside] = aX;
            j = i;
        }
    }
    public static insertionSort6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            const aU: U = arrayU[i];
            const aV: V = arrayV[i];
            const aW: W = arrayW[i];
            const aX: X = arrayX[i];
            const aY: Y = arrayY[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                arrayU[jNext] = arrayU[j];
                arrayV[jNext] = arrayV[j];
                arrayW[jNext] = arrayW[j];
                arrayX[jNext] = arrayX[j];
                arrayY[jNext] = arrayY[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            arrayU[jNextOutside] = aU;
            arrayV[jNextOutside] = aV;
            arrayW[jNextOutside] = aW;
            arrayX[jNextOutside] = aX;
            arrayY[jNextOutside] = aY;
            j = i;
        }
    }
    public static insertionSort7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number): void {
        let j: number = from;
        for (let i: number = from + 1; i < to; i++) {
            const aT: T = arrayT[i];
            const aU: U = arrayU[i];
            const aV: V = arrayV[i];
            const aW: W = arrayW[i];
            const aX: X = arrayX[i];
            const aY: Y = arrayY[i];
            const aZ: Z = arrayZ[i];
            while (j >= from && arrayT[j] > aT) {
                const jNext: number = j + 1;
                arrayT[jNext] = arrayT[j];
                arrayU[jNext] = arrayU[j];
                arrayV[jNext] = arrayV[j];
                arrayW[jNext] = arrayW[j];
                arrayX[jNext] = arrayX[j];
                arrayY[jNext] = arrayY[j];
                arrayZ[jNext] = arrayZ[j];
                j--;
            }
            const jNextOutside: number = j + 1;
            arrayT[jNextOutside] = aT;
            arrayU[jNextOutside] = aU;
            arrayV[jNextOutside] = aV;
            arrayW[jNextOutside] = aW;
            arrayX[jNextOutside] = aX;
            arrayY[jNextOutside] = aY;
            arrayZ[jNextOutside] = aZ;
            j = i;
        }
    }

    public static partition1<T>(
        arrayT: T[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing1(
            arrayT,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing1(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }
    public static partition2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing2(
            arrayT,
            arrayU,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing2(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayU,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }
    public static partition3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing3(
            arrayT,
            arrayU,
            arrayV,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing3(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayU,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayV,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }
    public static partition4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing4(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayU,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayV,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayW,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }
    public static partition5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing5(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayU,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayV,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayW,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayX,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }
    public static partition6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing6(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayU,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayV,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayW,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayX,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayY,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }
    public static partition7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number,
        pivot: number): number {
        return ListArrayUtility.partitionTwoEndProgressing7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            from,
            to,
            pivot);
        // tslint:disable-next-line: max-line-length
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ---- return partitionOneEndProgressing7(
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayT,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayU,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayV,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayW,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayX,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayY,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     arrayZ,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     from,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     to,
        // ---- NOTE-MAY-LEAD-TO-SKEW-PARTITIONING-WHEN-ALL-ELEMENTS-ARE-THE-SAME ----     pivot);
    }

    public static partitionThreeWayDutchNationalFlagProgressing1<T>(
        arrayT: T[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap1(
                    arrayT,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap1(
                    arrayT,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }
    public static partitionThreeWayDutchNationalFlagProgressing2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap2(
                    arrayT,
                    arrayU,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap2(
                    arrayT,
                    arrayU,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }
    public static partitionThreeWayDutchNationalFlagProgressing3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap3(
                    arrayT,
                    arrayU,
                    arrayV,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap3(
                    arrayT,
                    arrayU,
                    arrayV,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }
    public static partitionThreeWayDutchNationalFlagProgressing4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap4(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap4(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }
    public static partitionThreeWayDutchNationalFlagProgressing5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap5(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap5(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }
    public static partitionThreeWayDutchNationalFlagProgressing6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap6(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap6(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }
    public static partitionThreeWayDutchNationalFlagProgressing7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number,
        pivot: number): {"key": number, "value": number} {
        const pivotValue: T = arrayT[pivot];
        let lastIndex: number = to - 1;
        let i: number = from;
        let j: number = from;
        while (j <= lastIndex) {
            const elementT: T = arrayT[j];
            if (elementT < pivotValue) {
                ListArrayUtility.swap7(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    arrayZ,
                    i++,
                    j++);
            } else if (elementT > pivotValue) {
                ListArrayUtility.swap7(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    arrayZ,
                    j,
                    lastIndex--);
            } else {
                j++;
            }
        }
        return { key: i, value: j };
    }

    public static partitionTwoEndProgressing1<T>(
        arrayT: T[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap1(
            arrayT,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap1(
                arrayT,
                i,
                j);
        }
        ListArrayUtility.swap1(
            arrayT,
            j,
            from);
        return j;
    }
    public static partitionTwoEndProgressing2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap2(
            arrayT,
            arrayU,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap2(
                arrayT,
                arrayU,
                i,
                j);
        }
        ListArrayUtility.swap2(
            arrayT,
            arrayU,
            j,
            from);
        return j;
    }
    public static partitionTwoEndProgressing3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap3(
            arrayT,
            arrayU,
            arrayV,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap3(
                arrayT,
                arrayU,
                arrayV,
                i,
                j);
        }
        ListArrayUtility.swap3(
            arrayT,
            arrayU,
            arrayV,
            j,
            from);
        return j;
    }
    public static partitionTwoEndProgressing4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                i,
                j);
        }
        ListArrayUtility.swap4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            j,
            from);
        return j;
    }
    public static partitionTwoEndProgressing5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                i,
                j);
        }
        ListArrayUtility.swap5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            j,
            from);
        return j;
    }
    public static partitionTwoEndProgressing6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                i,
                j);
        }
        ListArrayUtility.swap6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            j,
            from);
        return j;
    }
    public static partitionTwoEndProgressing7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number,
        pivot: number): number {
        const pivotValue: T = arrayT[pivot];
        ListArrayUtility.swap7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            pivot,
            from);
        const lastIndex: number = to - 1;
        let i: number = from;
        let j: number = to;
        while (true) {
            while (arrayT[++i] < pivotValue) {
                if (i === lastIndex) {
                    break;
                }
            }
            while (arrayT[--j] > pivotValue) {
                if (i === from) {
                    break;
                }
            }
            if (i >= j) {
                break;
            }
            ListArrayUtility.swap7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                i,
                j);
        }
        ListArrayUtility.swap7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            j,
            from);
        return j;
    }

    public static partitionOneEndProgressing1<T>(
        arrayT: T[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap1(
            arrayT,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap1(
                    arrayT,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap1(
            arrayT,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }
    public static partitionOneEndProgressing2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap2(
            arrayT,
            arrayU,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap2(
                    arrayT,
                    arrayU,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap2(
            arrayT,
            arrayU,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }
    public static partitionOneEndProgressing3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap3(
            arrayT,
            arrayU,
            arrayV,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap3(
                    arrayT,
                    arrayU,
                    arrayV,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap3(
            arrayT,
            arrayU,
            arrayV,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }
    public static partitionOneEndProgressing4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap4(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }
    public static partitionOneEndProgressing5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap5(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }
    public static partitionOneEndProgressing6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap6(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }
    public static partitionOneEndProgressing7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number,
        pivot: number): number {
        // ---- Pre-condition: from <= pivot < to (other than that, pivot is arbitrary)
        const pivotValue: T = arrayT[pivot];  // ---- pivot value
        ListArrayUtility.swap7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            pivot,
            to - 1); // ---- move pivot value to end for now, after this pivot not used
        let nextPivotPosition: number = from; // ---- next pivot position
        for (let i: number = from; i < (to - 1); i++) { // ---- be careful to leave pivot value at the end
            // ---- Invariant condition: from <= nextPivotPosition <= i < to - 1 &&
            // tslint:disable-next-line: max-line-length
            // ---- forall from <= j <= nextPivotPosition, arrayT[j] <= pivotValue && forall nextPivotPosition < j <= i, arrayT[j] > pivotValue
            // ---- if (arrayT[i] <= pivotValue)
            if (arrayT[i] <= pivotValue) {
                ListArrayUtility.swap7(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    arrayZ,
                    nextPivotPosition,
                    i);  // ---- move value smaller than pivotValue down to nextPivotPosition
                nextPivotPosition++;
            }
        }
        ListArrayUtility.swap7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            nextPivotPosition,
            to - 1); // ---- move pivot value to its final place
        return nextPivotPosition; // ---- next pivot position
        // ---- Post-condition: forall i <= nextPivotPosition, arrayT[i] <= arrayT[nextPivotPosition]  && forall i > ...
    }

    public static sequentialQuickSortAll1<T>(
        arrayT: T[]): void {
        ListArrayUtility.sequentialQuickSort1(
            arrayT,
            0,
            arrayT.length);
    }
    public static sequentialQuickSortAll2<T, U>(
        arrayT: T[],
        arrayU: U[]): void {
        ListArrayUtility.sequentialQuickSort2(
            arrayT,
            arrayU,
            0,
            arrayT.length);
    }
    public static sequentialQuickSortAll3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[]): void {
        ListArrayUtility.sequentialQuickSort3(
            arrayT,
            arrayU,
            arrayV,
            0,
            arrayT.length);
    }
    public static sequentialQuickSortAll4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[]): void {
        ListArrayUtility.sequentialQuickSort4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            0,
            arrayT.length);
    }
    public static sequentialQuickSortAll5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[]): void {
        ListArrayUtility.sequentialQuickSort5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            0,
            arrayT.length);
    }
    public static sequentialQuickSortAll6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[]): void {
        ListArrayUtility.sequentialQuickSort6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            0,
            arrayT.length);
    }
    public static sequentialQuickSortAll7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[]): void {
        ListArrayUtility.sequentialQuickSort7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            0,
            arrayT.length);
    }

    public static sequentialQuickSort1<T>(
        arrayT: T[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning1(
            arrayT,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning1(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }
    public static sequentialQuickSort2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning2(
            arrayT,
            arrayU,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning2(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayU,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }
    public static sequentialQuickSort3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning3(
            arrayT,
            arrayU,
            arrayV,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning3(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayU,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayV,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }
    public static sequentialQuickSort4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning4(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning4(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayU,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayV,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayW,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }
    public static sequentialQuickSort5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning5(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning5(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayU,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayV,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayW,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayX,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }
    public static sequentialQuickSort6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning6(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning6(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayU,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayV,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayW,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayX,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayY,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }
    public static sequentialQuickSort7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number): void {
        ListArrayUtility.sequentialQuickSortByThreeWayPartitioning7(
            arrayT,
            arrayU,
            arrayV,
            arrayW,
            arrayX,
            arrayY,
            arrayZ,
            from,
            to);
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ---- ListArrayUtility.sequentialQuickSortByBinaryPartitioning7(
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayT,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayU,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayV,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayW,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayX,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayY,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     arrayZ,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     from,
        // ---- NOTE-PREFER-THREE-WAY-PARTITIONING ----     to);
    }

    public static sequentialQuickSortByThreeWayPartitioning1<T>(
        arrayT: T[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort1(
                arrayT,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing1(
                    arrayT,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning1(
                arrayT,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning1(
                arrayT,
                pivotPair.value,
                to);
        }
    }
    public static sequentialQuickSortByThreeWayPartitioning2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort2(
                arrayT,
                arrayU,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing2(
                    arrayT,
                    arrayU,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning2(
                arrayT,
                arrayU,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning2(
                arrayT,
                arrayU,
                pivotPair.value,
                to);
        }
    }
    public static sequentialQuickSortByThreeWayPartitioning3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort3(
                arrayT,
                arrayU,
                arrayV,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing3(
                    arrayT,
                    arrayU,
                    arrayV,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning3(
                arrayT,
                arrayU,
                arrayV,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning3(
                arrayT,
                arrayU,
                arrayV,
                pivotPair.value,
                to);
        }
    }
    public static sequentialQuickSortByThreeWayPartitioning4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing4(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                pivotPair.value,
                to);
        }
    }
    public static sequentialQuickSortByThreeWayPartitioning5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing5(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                pivotPair.value,
                to);
        }
    }
    public static sequentialQuickSortByThreeWayPartitioning6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing6(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                pivotPair.value,
                to);
        }
    }
    public static sequentialQuickSortByThreeWayPartitioning7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                from,
                to);
        } else {
            const pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            const pivotPair: { "key": number, "value": number } =
                ListArrayUtility.partitionThreeWayDutchNationalFlagProgressing7(
                    arrayT,
                    arrayU,
                    arrayV,
                    arrayW,
                    arrayX,
                    arrayY,
                    arrayZ,
                    from,
                    to,
                    pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                from,
                pivotPair.key);
            ListArrayUtility.sequentialQuickSortByThreeWayPartitioning7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                pivotPair.value,
                to);
        }
    }

    public static sequentialQuickSortByBinaryPartitioning1<T>(
        arrayT: T[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort1(
                arrayT,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition1(
                arrayT,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning1(
                arrayT,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning1(
                arrayT,
                pivot + 1,
                to);
        }
    }
    public static sequentialQuickSortByBinaryPartitioning2<T, U>(
        arrayT: T[],
        arrayU: U[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort2(
                arrayT,
                arrayU,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition2(
                arrayT,
                arrayU,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning2(
                arrayT,
                arrayU,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning2(
                arrayT,
                arrayU,
                pivot + 1,
                to);
        }
    }
    public static sequentialQuickSortByBinaryPartitioning3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort3(
                arrayT,
                arrayU,
                arrayV,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition3(
                arrayT,
                arrayU,
                arrayV,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning3(
                arrayT,
                arrayU,
                arrayV,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning3(
                arrayT,
                arrayU,
                arrayV,
                pivot + 1,
                to);
        }
    }
    public static sequentialQuickSortByBinaryPartitioning4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning4(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                pivot + 1,
                to);
        }
    }
    public static sequentialQuickSortByBinaryPartitioning5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning5(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                pivot + 1,
                to);
        }
    }
    public static sequentialQuickSortByBinaryPartitioning6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning6(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                pivot + 1,
                to);
        }
    }
    public static sequentialQuickSortByBinaryPartitioning7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        from: number,
        to: number): void {
        if ((to - from) <= ListArrayUtility.InsertionQuickSortNumberOfInstancesThreshold) {
            ListArrayUtility.insertionSort7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                from,
                to);
        } else {
            let pivot: number = from + Utility.getFloorInteger((to - from) / 2); // ---- could be anything, use middle
            pivot = ListArrayUtility.partition7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                from,
                to,
                pivot);
            // ---- Assert: forall i < pivot, arrayT[i] <= arrayT[pivot]  && forall i > ...
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                from,
                pivot);
            ListArrayUtility.sequentialQuickSortByBinaryPartitioning7(
                arrayT,
                arrayU,
                arrayV,
                arrayW,
                arrayX,
                arrayY,
                arrayZ,
                pivot + 1,
                to);
        }
    }

    public static swap1<T>(
        arrayT: T[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
    }
    public static swap2<T, U>(
        arrayT: T[],
        arrayU: U[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
        const temporaryU: U = arrayU[i];
        arrayU[i] = arrayU[j];
        arrayU[j] = temporaryU;
    }
    public static swap3<T, U, V>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
        const temporaryU: U = arrayU[i];
        arrayU[i] = arrayU[j];
        arrayU[j] = temporaryU;
        const temporaryV: V = arrayV[i];
        arrayV[i] = arrayV[j];
        arrayV[j] = temporaryV;
    }
    public static swap4<T, U, V, W>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
        const temporaryU: U = arrayU[i];
        arrayU[i] = arrayU[j];
        arrayU[j] = temporaryU;
        const temporaryV: V = arrayV[i];
        arrayV[i] = arrayV[j];
        arrayV[j] = temporaryV;
        const temporaryW: W = arrayW[i];
        arrayW[i] = arrayW[j];
        arrayW[j] = temporaryW;
    }
    public static swap5<T, U, V, W, X>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
        const temporaryU: U = arrayU[i];
        arrayU[i] = arrayU[j];
        arrayU[j] = temporaryU;
        const temporaryV: V = arrayV[i];
        arrayV[i] = arrayV[j];
        arrayV[j] = temporaryV;
        const temporaryW: W = arrayW[i];
        arrayW[i] = arrayW[j];
        arrayW[j] = temporaryW;
        const temporaryX: X = arrayX[i];
        arrayX[i] = arrayX[j];
        arrayX[j] = temporaryX;
    }
    public static swap6<T, U, V, W, X, Y>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
        const temporaryU: U = arrayU[i];
        arrayU[i] = arrayU[j];
        arrayU[j] = temporaryU;
        const temporaryV: V = arrayV[i];
        arrayV[i] = arrayV[j];
        arrayV[j] = temporaryV;
        const temporaryW: W = arrayW[i];
        arrayW[i] = arrayW[j];
        arrayW[j] = temporaryW;
        const temporaryX: X = arrayX[i];
        arrayX[i] = arrayX[j];
        arrayX[j] = temporaryX;
        const temporaryY: Y = arrayY[i];
        arrayY[i] = arrayY[j];
        arrayY[j] = temporaryY;
    }
    public static swap7<T, U, V, W, X, Y, Z>(
        arrayT: T[],
        arrayU: U[],
        arrayV: V[],
        arrayW: W[],
        arrayX: X[],
        arrayY: Y[],
        arrayZ: Z[],
        i: number,
        j: number) {
        const temporaryT: T = arrayT[i];
        arrayT[i] = arrayT[j];
        arrayT[j] = temporaryT;
        const temporaryU: U = arrayU[i];
        arrayU[i] = arrayU[j];
        arrayU[j] = temporaryU;
        const temporaryV: V = arrayV[i];
        arrayV[i] = arrayV[j];
        arrayV[j] = temporaryV;
        const temporaryW: W = arrayW[i];
        arrayW[i] = arrayW[j];
        arrayW[j] = temporaryW;
        const temporaryX: X = arrayX[i];
        arrayX[i] = arrayX[j];
        arrayX[j] = temporaryX;
        const temporaryY: Y = arrayY[i];
        arrayY[i] = arrayY[j];
        arrayY[j] = temporaryY;
        const temporaryZ: Z = arrayZ[i];
        arrayZ[i] = arrayZ[j];
        arrayZ[j] = temporaryZ;
    }

    public static sortGenerateOrderSequence<T>(
        arrayT: T[]): number[] {
        const numberInstances: number = arrayT.length;
        const indexArray: number[] = Array.from(Array(numberInstances).keys());
        ListArrayUtility.sequentialQuickSortAll2(
            arrayT,
            indexArray);
        return indexArray;
    }

    public static validateGenericArrayIndex<T>(
        genericArray: T[],
        index: number,
        throwIfNotLegal: boolean = true): boolean {
        if (index === undefined) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index===undefined");
            }
            return false;
        }
        if (index === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index===null");
            }
            return false;
        }
        if (genericArray === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArray===null");
            }
            return false;
        }
        if (index < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index<0");
            }
            return false;
        }
        if (index >= genericArray.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `index|${index}|` +
                    `>=genericArray.length|${ genericArray.length}|`);
            }
            return false;
        }
        return true;
    }
    public static validateGenericArrayPairStructure<T>(
        genericArrayFirst: T[],
        genericArraySecond: T[],
        throwIfNotLegal: boolean = true): boolean {
        // if ((genericArrayFirst == null) && (genericArraySecond == null)) {
        //     return true;
        // }
        if (genericArrayFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArrayFirst==null");
            }
            return false;
        }
        if (genericArraySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArraySecond==null");
            }
            return false;
        }
        if (genericArrayFirst.length !== genericArraySecond.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericArrayFirst.length|${genericArrayFirst.length}|` +
                    `!=genericArraySecond.length|${ genericArraySecond.length}|`);
            }
            return false;
        }
        return true;
    }

    public static validateGeneric2dArrayIndex<T>(
        genericArray: T[][],
        index0: number,
        index1: number,
        throwIfNotLegal: boolean = true): boolean {
        if (index0 === undefined) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0===undefined");
            }
            return false;
        }
        if (index0 === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0===null");
            }
            return false;
        }
        if (genericArray === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArray===null");
            }
            return false;
        }
        if (index0 < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0<0");
            }
            return false;
        }
        if (index0 >= genericArray.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `index0|${index0}|` +
                    `>=genericArray.length|${ genericArray.length}|`);
            }
            return false;
        }
        return ListArrayUtility.validateGenericArrayIndex(
            genericArray[index0],
            index1,
            throwIfNotLegal);
    }
    public static validateGeneric2dArrayPairStructure<T>(
        genericArrayFirst: T[][],
        genericArraySecond: T[][],
        throwIfNotLegal: boolean = true): boolean {
        // if ((genericArrayFirst == null) && (genericArraySecond == null)) {
        //     return true;
        // }
        if (genericArrayFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArrayFirst==null");
            }
            return false;
        }
        if (genericArraySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArraySecond==null");
            }
            return false;
        }
        if (genericArrayFirst.length !== genericArraySecond.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericArrayFirst.length|${genericArrayFirst.length}|` +
                    `!=genericArraySecond.length|${ genericArraySecond.length}|`);
            }
            return false;
        }
        for (let index = 0; index < genericArrayFirst.length; index++) {
            const isValid: boolean = ListArrayUtility.validateGenericArrayPairStructure(
                genericArrayFirst[index],
                genericArraySecond[index],
                throwIfNotLegal);
            if (!isValid) {
                return false;
            }
        }
        return true;
    }

    public static validateGeneric3dArrayIndex<T>(
        genericArray: T[][][],
        index0: number,
        index1: number,
        index2: number,
        throwIfNotLegal: boolean = true): boolean {
        if (index0 === undefined) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0===undefined");
            }
            return false;
        }
        if (index0 === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0===null");
            }
            return false;
        }
        if (genericArray === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArray===null");
            }
            return false;
        }
        if (index0 < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0<0");
            }
            return false;
        }
        if (index0 >= genericArray.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `index0|${index0}|` +
                    `>=genericArray.length|${ genericArray.length}|`);
            }
            return false;
        }
        return ListArrayUtility.validateGeneric2dArrayIndex(
            genericArray[index0],
            index1,
            index2,
            throwIfNotLegal);
    }
    public static validateGeneric3dArrayPairStructure<T>(
        genericArrayFirst: T[][][],
        genericArraySecond: T[][][],
        throwIfNotLegal: boolean = true): boolean {
        // if ((genericArrayFirst == null) && (genericArraySecond == null)) {
        //     return true;
        // }
        if (genericArrayFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArrayFirst==null");
            }
            return false;
        }
        if (genericArraySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArraySecond==null");
            }
            return false;
        }
        if (genericArrayFirst.length !== genericArraySecond.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericArrayFirst.length|${genericArrayFirst.length}|` +
                    `!=genericArraySecond.length|${ genericArraySecond.length}|`);
            }
            return false;
        }
        for (let index = 0; index < genericArrayFirst.length; index++) {
            const isValid: boolean = ListArrayUtility.validateGeneric2dArrayPairStructure(
                genericArrayFirst[index],
                genericArraySecond[index],
                throwIfNotLegal);
            if (!isValid) {
                return false;
            }
        }
        return true;
    }

    public static validateGeneric4dArrayIndex<T>(
        genericArray: T[][][][],
        index0: number,
        index1: number,
        index2: number,
        index3: number,
        throwIfNotLegal: boolean = true): boolean {
        if (index0 === undefined) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0===undefined");
            }
            return false;
        }
        if (index0 === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0===null");
            }
            return false;
        }
        if (genericArray === null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArray===null");
            }
            return false;
        }
        if (index0 < 0) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("index0<0");
            }
            return false;
        }
        if (index0 >= genericArray.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `index0|${index0}|` +
                    `>=genericArray.length|${ genericArray.length}|`);
            }
            return false;
        }
        return ListArrayUtility.validateGeneric3dArrayIndex(
            genericArray[index0],
            index1,
            index2,
            index3,
            throwIfNotLegal);
    }
    public static validateGeneric4dArrayPairStructure<T>(
        genericArrayFirst: T[][][][],
        genericArraySecond: T[][][][],
        throwIfNotLegal: boolean = true): boolean {
        // if ((genericArrayFirst == null) && (genericArraySecond == null)) {
        //     return true;
        // }
        if (genericArrayFirst == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArrayFirst==null");
            }
            return false;
        }
        if (genericArraySecond == null) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow("genericArraySecond==null");
            }
            return false;
        }
        if (genericArrayFirst.length !== genericArraySecond.length) {
            if (throwIfNotLegal) {
                Utility.debuggingThrow(
                    `genericArrayFirst.length|${genericArrayFirst.length}|` +
                    `!=genericArraySecond.length|${ genericArraySecond.length}|`);
            }
            return false;
        }
        for (let index = 0; index < genericArrayFirst.length; index++) {
            const isValid: boolean = ListArrayUtility.validateGeneric3dArrayPairStructure(
                genericArrayFirst[index],
                genericArraySecond[index],
                throwIfNotLegal);
            if (!isValid) {
                return false;
            }
        }
        return true;
    }
}
