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

/**
 * Create an array with every combination of string letters.
 * max character string of 16. After 16 character string the
 * increase in size begins to degrees and then degrades.
 * @param str
 * @returns {Array}
 */
export const randomCharArray = (str: string): string[] => {
    const set = [];
    const strSize = str.length;
    const combinationsCount = (1 << strSize);
    for ( let i = 1; i < combinationsCount; i++) {
        const combination = [];
        for ( let j = 0; j < strSize; j++) {
            if ((i & (1 << j))) {
                combination.push(str[j]);
            }
        }
        set.push(combination.join(""));
    }
    return set;
};
