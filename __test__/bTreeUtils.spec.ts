import { defaultCheckKeyEquality, getRandomArray, defaultCompareKeysFunction, randomCharArray } from "../src";

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

    test("randomCharArray", () => {
        const randoC = randomCharArray("cains");

        expect(randoC[0]).toBe("c");
        expect(randoC.length).toBe(31);
        expect(randoC[30]).toBe("cains");
    });
});
