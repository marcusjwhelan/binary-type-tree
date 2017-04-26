import { defaultCheckKeyEquality, getRandomArray, defaultCompareKeysFunction, defaultCheckValueEquality } from "../src";

describe("Test utils", () => {

    test("defaultCheckKeyEquality", () => {
        const num: boolean = defaultCheckKeyEquality(1, 1);
        const str: boolean = defaultCheckKeyEquality("a", "a");
        const now = new Date();
        const day: boolean = defaultCheckKeyEquality(now, now);
        const later = new Date();
        const day2: boolean = defaultCheckKeyEquality(now, later);

        expect(num).toBe(true);
        expect(str).toBe(true);
        expect(day).toBe(true);
        expect(day2).toBe(false);
    });

    test("defaultCheckValueEquality", () => {
        const num: boolean = defaultCheckValueEquality(1, 1);
        const str: boolean = defaultCheckValueEquality("a", "a");
        const now = new Date();
        const day: boolean = defaultCheckValueEquality(now, now);
        const later = new Date();
        const day2: boolean = defaultCheckValueEquality(now, later);

        expect(num).toBe(true);
        expect(str).toBe(true);
        expect(day).toBe(true);
        expect(day2).toBe(false);
    });

    test("getRandomArray of numbers", () => {
        expect(getRandomArray(10).length).toBe(10);
    });

    test("defaultCompareKeysFunction", () => {
        const day: Date = new Date();
        const numsL: number = defaultCompareKeysFunction(1, 2);
        const numsG: number = defaultCompareKeysFunction(2, 1);
        const numsE: number = defaultCompareKeysFunction(2, 2);
        const str: number = defaultCompareKeysFunction("a", "b");
        const date: number = defaultCompareKeysFunction(day.getTime(), day.getTime());

        expect(numsL).toBe(-1);
        expect(numsG).toBe(1);
        expect(numsE).toBe(0);
        expect(date).toBe(0);
        expect(str).toBe(-1);
    });
});
