import { AVLTree } from "../src";

describe("creating JSON from Tree", () => {
    test("Insert ordered array no rebalance", () => {
        expect.assertions(3);
        const avl: AVLTree = new AVLTree({ unique: true });
        const parsedJSON = [{ key: 27, value: ["a"]}, { key: 35, value: ["b"]}, { key: 22, value: ["c"]}, { key: 39, value: ["d"]}, { key: 25, value: ["d"]}, { key: 28, value: ["e"]}, { key: 0, value: ["f"]}, { key: 26, value: ["g"]}, { key: 1, value: ["h"]}];

        for (const item of parsedJSON) {
            avl.insert(item.key, item.value);
        }
        return avl.tree.toJSON<AVLTree>()
            .then((res) => {
                const json = JSON.parse(res);
                const zoneOfTheEnders = avl.tree.search(0);
                expect(zoneOfTheEnders).toEqual(expect.arrayContaining(["f"]));
                expect(json).toEqual(expect.arrayContaining([{ key: 27, value: ["a"]}, { key: 35, value: ["b"]}, { key: 22, value: ["c"]}, { key: 39, value: ["d"]}, { key: 25, value: ["d"]}, { key: 28, value: ["e"]}, { key: 0, value: ["f"]}, { key: 26, value: ["g"]}, { key: 1, value: ["h"]}]));
            });
    });

    describe("AVL to JSON", () => {
        const avlTree: AVLTree = new AVLTree({ unique: true});
        expect(avlTree).toBeInstanceOf(AVLTree);

        // add 0-40 values
        for (let i = 0; i <= 20; i++) {
            avlTree.insert(i, ["v"]);
        }
        test("hmm", () => {
            expect.assertions(1);
            return avlTree.tree.toJSON<AVLTree>()
                .then((res) => {
                    expect(res).toEqual(`[{"key":7,"value":["v"]},{"key":3,"value":["v"]},{"key":15,"value":["v"]},{"key":17,"value":["v"]},{"key":5,"value":["v"]},{"key":11,"value":["v"]},{"key":1,"value":["v"]},{"key":13,"value":["v"]},{"key":6,"value":["v"]},{"key":19,"value":["v"]},{"key":2,"value":["v"]},{"key":9,"value":["v"]},{"key":4,"value":["v"]},{"key":16,"value":["v"]},{"key":0,"value":["v"]},{"key":10,"value":["v"]},{"key":14,"value":["v"]},{"key":20,"value":["v"]},{"key":8,"value":["v"]},{"key":12,"value":["v"]},{"key":18,"value":["v"]}]`);
                });
        });
    });
});
