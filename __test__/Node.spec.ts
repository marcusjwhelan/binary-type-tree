import { AVLTree } from "../src";

describe("creating JSON from Tree", () => {
    describe("AVL to JSON", () => {
        const avlTree: AVLTree = new AVLTree({ unique: true});
        expect(avlTree).toBeInstanceOf(AVLTree);

        // add 0-40 values
        for (let i = 0; i <= 20; i++) {
            avlTree.insert(i, ["v"]);
        }

        const jsonTree: any = avlTree.tree.toJSON<AVLTree>();
        test("hmm", () => {
            expect(jsonTree).toEqual(`[{"key":7,"value":["v"]},{"key":15,"value":["v"]},{"key":3,"value":["v"]},{"key":17,"value":["v"]},{"key":5,"value":["v"]},{"key":11,"value":["v"]},{"key":1,"value":["v"]},{"key":19,"value":["v"]},{"key":6,"value":["v"]},{"key":13,"value":["v"]},{"key":2,"value":["v"]},{"key":16,"value":["v"]},{"key":4,"value":["v"]},{"key":9,"value":["v"]},{"key":0,"value":["v"]},{"key":20,"value":["v"]},{"key":14,"value":["v"]},{"key":10,"value":["v"]},{"key":18,"value":["v"]},{"key":12,"value":["v"]},{"key":8,"value":["v"]}]`);
        });
    });
});
