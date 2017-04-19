/**
 * Return an array with the numbers from 0 to n-1, in a random order.
 * @param n
 * @returns {any}
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
 */
export const defaultCompareKeysFunction = ( a: number | string | Date, b: number | string | Date ): number => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        throw new Error("Could not compare elements, please check types.");
    }
};

/**
 * Check whether two values are equal
 * @param a
 * @param b
 * @returns {boolean}
 */
export const defaultCheckValueEquality = ( a: number | string | Date, b: number | string | Date ): boolean => {
    return a === b;
};
