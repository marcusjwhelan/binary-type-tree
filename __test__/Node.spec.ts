import { AVLTree, AVLNode, SNDBSA, ASNDBS, getRowsArrayFromHeight, createRefArrayFromTreeHeight } from "../src";

describe("creating JSON from Tree", () => {
    describe("AVL to JSON", () => {
        const avlTree: AVLTree = new AVLTree({ unique: true});
        expect(avlTree).toBeInstanceOf(AVLTree);

        // add 0-40 values
        for (let i = 0; i <= 40; i++) {
            avlTree.insert(i, ["v"]);
        }

        const arrayOfTree = avlTree.tree.getTreeAsArrayOfArrays<AVLNode>();

        test("hmm", () => {
            expect(arrayOfTree[0][0]).toEqual({key: 15, value: ["v"]});
        });
    });
});
