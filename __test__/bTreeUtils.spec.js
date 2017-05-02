"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
describe("Test utils", function () {
    test("defaultCheckKeyEquality", function () {
        var num = src_1.defaultCheckKeyEquality(1, 1);
        var str = src_1.defaultCheckKeyEquality("a", "a");
        var now = new Date();
        var day = src_1.defaultCheckKeyEquality(now, now);
        var later = new Date();
        var day2 = src_1.defaultCheckKeyEquality(now, later);
        expect(num).toBe(true);
        expect(str).toBe(true);
        expect(day).toBe(true);
        expect(day2).toBe(false);
    });
    test("defaultCheckValueEquality", function () {
        var num = src_1.defaultCheckValueEquality(1, 1);
        var str = src_1.defaultCheckValueEquality("a", "a");
        var now = new Date();
        var day = src_1.defaultCheckValueEquality(now, now);
        var later = new Date();
        var day2 = src_1.defaultCheckValueEquality(now, later);
        expect(num).toBe(true);
        expect(str).toBe(true);
        expect(day).toBe(true);
        expect(day2).toBe(false);
    });
    test("getRandomArray of numbers", function () {
        expect(src_1.getRandomArray(10).length).toBe(10);
    });
    test("defaultCompareKeysFunction", function () {
        var day = new Date();
        var numsL = src_1.defaultCompareKeysFunction(1, 2);
        var numsG = src_1.defaultCompareKeysFunction(2, 1);
        var numsE = src_1.defaultCompareKeysFunction(2, 2);
        var str = src_1.defaultCompareKeysFunction("a", "b");
        var date = src_1.defaultCompareKeysFunction(day.getTime(), day.getTime());
        expect(numsL).toBe(-1);
        expect(numsG).toBe(1);
        expect(numsE).toBe(0);
        expect(date).toBe(0);
        expect(str).toBe(-1);
    });
});
