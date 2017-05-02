"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Shuffle numbers in array
 * @param nums
 * @returns {number[]}
 */
exports.shuffleNumbersArray = function (nums) {
    var tmp;
    var current;
    var top = nums.length;
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
exports.getRandomArray = function (n) {
    var b = [];
    for (var i = 0; i < n; ++i) {
        b.push(i);
    }
    return exports.shuffleNumbersArray(b);
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
exports.defaultCompareKeysFunction = function (a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else if (a === b) {
        return 0;
    }
    else {
        throw new Error("Could not compare keys, please check types. " + a + ":" + typeof a + ", " + b + ":" + typeof b);
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
exports.defaultCompareValues = function (a, b) {
    if (a.length !== b.length) {
        throw new Error("Cannot compare values of different length. a:" + a.length + ",b:" + b.length + ", a:" + a + ",b:" + b);
    }
    else {
        var returnNum = [];
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] < b[i]) {
                returnNum.push(-1);
            }
            else if (a[i] > b[i]) {
                returnNum.push(1);
            }
            else if (a[i] === b[i]) {
                returnNum.push(0);
            }
            else {
                throw new Error("Could not compare values, please check types. " + a[i] + ":" + typeof a[i] + ", " + b[i] + ":" + typeof b[i]);
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
exports.defaultCheckKeyEquality = function (a, b) {
    return a === b;
};
/**
 * Check whether to values are equal
 * @param a
 * @param b
 * @returns {boolean}
 */
exports.defaultCheckValueEquality = function (a, b) {
    return a === b;
};
/**
 * get array with number of items in each row. [1,2,4,8,16] depending
 * on the height of the btree
 * @param height
 * @returns {number[]}
 */
exports.getRowsArrayFromHeight = function (height) {
    var returnArr = [];
    for (var i = 0; i <= height; i++) {
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
exports.createRefArrayFromTreeHeight = function (height) {
    var returnArr = [];
    for (var i = 0; i <= height; i++) {
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
exports.createRandomSortedIndex = function (refArray) {
    var returnArray = [];
    for (var i = 0; i < refArray.length; i++) {
        returnArray.push([]);
        for (var j = refArray[i].length - 1; j >= 0; j--) {
            returnArray[i].push(j);
        }
    }
    var fillRefA = function (prev, current) {
        var a = [];
        var prefAOdds = prev.filter(function (val) { return (val % 2) !== 0; });
        var prefAEvens = prev.filter(function (val) { return (val % 2) === 0; });
        var currentAOdds = current.filter(function (val) { return (val % 2) !== 0; });
        var currentAEvens = current.filter(function (val) { return (val % 2) === 0; });
        var newAOdds = currentAOdds.filter(function (val) { return !prefAOdds.includes(val); });
        var newAEvens = currentAEvens.filter(function (val) { return !prefAEvens.includes(val); });
        for (var i = 0; i < prefAOdds.length; i++) {
            a.push(newAOdds[i]);
            a.push(prefAOdds[i]);
        }
        for (var i = 0; i < prefAOdds.length; i++) {
            a.push(newAEvens[i]);
            a.push(prefAEvens[i]);
        }
        return a;
    };
    for (var i = 2; i < returnArray.length; i++) {
        returnArray[i] = fillRefA(returnArray[i - 1], returnArray[i]);
    }
    return returnArray;
};
