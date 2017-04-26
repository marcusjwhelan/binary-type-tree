/**
 * Shuffle numbers in array
 * @param nums
 * @returns {number[]}
 */
export const shuffleNumbersArray = ( nums: number[]): number[] => {
    let tmp: number;
    let current: number;
    let top: number = nums.length;
    if (top) {
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = nums[current];
            nums[current] = nums[top];
            nums[top] = tmp;
        }
    }
    return nums;
};

/**
 * Return an array with the numbers from 0 to n-1, in a random order.
 * @param n
 * @returns {number[]}
 */
export const getRandomArray = ( n: number): number[] => {
    const b: number[] = [];
    for (let i = 0; i < n ; ++i) {
        b.push(i);
    }
    return shuffleNumbersArray(b);
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
export const defaultCompareKeysFunction = ( a: number | string , b: number | string ): number => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        throw new Error(`Could not compare keys, please check types. ${a}:${typeof a}, ${b}:${typeof b}`);
    }
};

/**
 * Default compareValues function
 * @param a
 * @param b
 * @returns {number}
 * if a < b then return -1
 * if a > b then return 1
 * if a === b then return 0
 * else throw could not compare error.
 */
export const defaultCompareValues = ( a: Array<number|string>, b: Array<number|string>): number[] => {
    if (a.length !== b.length) {
        throw new Error(`Cannot compare values of different length. a:${a.length},b:${b.length}, a:${a},b:${b}`);
    } else {
        const returnNum: number[] = [];
        for (let i = a.length - 1; i >= 0; i--) {
            if ( a[i] < b[i]) {
                returnNum.push(-1);
            } else if (a[i] > b[i]) {
                returnNum.push(1);
            } else if (a[i] === b[i]) {
                returnNum.push(0);
            } else {
                throw new Error(`Could not compare values, please check types. ${a[i]}:${typeof a[i]}, ${b[i]}:${typeof b[i]}`);
            }
        }
        return returnNum;
    }
};

/**
 * Check whether two keys are equal with '==='
 * @param a
 * @param b
 * @returns {boolean}
 */
export const defaultCheckKeyEquality = ( a: number | string | Date, b: number | string | Date ): boolean => {
    return a === b;
};

/**
 * Check whether to values are equal
 * @param a
 * @param b
 * @returns {boolean}
 */
export const defaultCheckValueEquality = ( a: number | string | Date, b: number | string | Date ): boolean => {
    return a === b;
};
