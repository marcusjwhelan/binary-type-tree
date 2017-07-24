import { equalArray } from "../src/utils";

test("compareArray", () => {
    const equal: boolean = equalArray([1, 2, 3], [1, 2, 3]);
    const greater: boolean = equalArray(["b"], ["a"]);
    const less: boolean = equalArray([new Date("1/1/2017")], [new Date()]);
    const notSame: boolean = equalArray([1, 3, 2], [1, 2, 3]);

    expect(equal).toEqual(true);
    expect(greater).toEqual(false);
    expect(less).toEqual(false);
    expect(notSame).toEqual(true);
});
