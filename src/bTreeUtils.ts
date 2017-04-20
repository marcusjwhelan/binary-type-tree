/**
 * Return an array with the numbers from 0 to n-1, in a random order.
 * @param n
 * @returns {any}
 * Actually returns a number array.
 */
export const getRandomArray = ( n: number ): number[] => {
    let res;
    let next;

    if (n === 0) {
        return [];
    }
    if (n === 1) {
        return [0];
    }

    res = getRandomArray(n - 1);
    next = Math.floor(Math.random() * n);
    res.splice(next, 0, n - 1);   // Add n-1 at a random position in the array

    return res;
};

/**
 * Default compareKeys function
 * @param a
 * @param b
 * @returns {number}
 * if a < b then return -1
 * if a > b then return 1
 * if a === b then return 0
 * else throw could not compare error.
 */
export const defaultCompareKeysFunction = ( a: number | string | Date, b: number | string | Date ): number => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        throw new Error(`Could not compare elements, please check types. ${a}:${typeof a}, ${b}:${typeof b}`);
    }
};

/**
 * Check whether two values are equal with '==='
 * @param a
 * @param b
 * @returns {boolean}
 */
export const defaultCheckValueEquality = ( a: number | string | Date, b: number | string | Date ): boolean => {
    return a === b;
};
