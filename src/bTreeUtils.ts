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

/**
 * get array with number of items in each row. [1,2,4,8,16] depending
 * on the height of the btree
 * @param height
 * @returns {number[]}
 */
export const getRowsArrayFromHeight = (height: number): number[] => {
    const returnArr: number[] = [];
    for (let i = 0; i <= height; i++) {
        returnArr.push(Math.pow(2, i));
    }
    return returnArr;
};

/**
 * create an array based on the height of the bTee to insert nodes key
 * and value. example: height 3, [ [], [], [], [] ]. 3-0
 * @param height
 * @returns {any}
 */
export const createRefArrayFromTreeHeight = (height: number): any[] => {
    const returnArr: any = [];
    for (let i = 0; i <= height; i++) {
        returnArr.push(new Array(0));
    }
    return returnArr;
};

/**
 * Create the reference index master array. This tells another method
 * where the nodes need to be inserted in the final array that is turned
 * into JSON.
 * @param refArray
 * @returns {any[]}
 */
export const createRandomSortedIndex = (refArray: any[]): any[] => {
    const returnArray: any[] = [];

    for (let i = 0; i < refArray.length; i++) {
        returnArray.push([]);
        for (let j = refArray[i].length - 1; j >= 0; j--) {
            returnArray[i].push(j);
        }
    }

    const fillRefA = (prev: number[], current: number[]): number[] => {
        const a = [];
        const prefAOdds = prev.filter((val: number) => (val % 2) !== 0);
        const prefAEvens = prev.filter((val: number) => (val % 2) === 0);
        const currentAOdds = current.filter((val: number) => (val % 2) !== 0);
        const currentAEvens = current.filter((val: number) => (val % 2) === 0);
        const newAOdds = currentAOdds.filter((val: number) => !prefAOdds.includes(val));
        const newAEvens = currentAEvens.filter((val: number) => !prefAEvens.includes(val));

        for (let i = 0; i < prefAOdds.length; i++) {
            a.push(newAOdds[i]);
            a.push(prefAOdds[i]);
        }
        for (let i = 0; i < prefAOdds.length; i++) {
            a.push(newAEvens[i]);
            a.push(prefAEvens[i]);
        }
        return a;
    };

    for (let i = 2; i < returnArray.length; i++) {
        returnArray[i] = fillRefA(returnArray[i - 1], returnArray[i]);
    }
    return returnArray;
};
