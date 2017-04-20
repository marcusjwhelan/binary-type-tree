import { AVLTree } from "../src";

describe("AVLTree functionality", () => {
    const avlTree: AVLTree = new AVLTree({unique: true});
    expect(avlTree).toBeInstanceOf(AVLTree);

    test("creating tree by adding avlnode with key and value", () => {
        avlTree.insert("rocket", "123456789");

        expect(avlTree.tree.key).toBe("rocket");
        expect(avlTree.tree.value).toEqual(expect.arrayContaining(["123456789"]));
        expect(avlTree.tree.height).toBe(1);
        expect(avlTree.tree.parent).toBe(null);
        expect(avlTree.tree.left).toBe(null);
        expect(avlTree.tree.right).toBe(null);
    });

    test("adding children with valid references to parent", () => {
        avlTree.insert("league", "123456788");
        avlTree.insert("ghost", "123456787");
        const rocket = avlTree.tree.right;
        const league = avlTree.tree;
        const ghost = avlTree.tree.left;
        if (avlTree.tree.right) {
            expect(avlTree.tree.right.key).toBe("rocket");
            expect(avlTree.tree.right.value).toEqual(expect.arrayContaining(["123456789"]));
            expect(avlTree.tree.right.parent).toBe(league);
            expect(avlTree.tree.right).toBe(rocket);
        }
        if (avlTree.tree.left) {
            expect(avlTree.tree.left.key).toBe("ghost");
            expect(avlTree.tree.left.value).toEqual(expect.arrayContaining(["123456787"]));
            expect(avlTree.tree.left.parent).toBe(league);
            expect(avlTree.tree.left).toBe(ghost);
        }
        expect(avlTree.tree.key).toBe("league");
        expect(avlTree.tree.value).toEqual(expect.arrayContaining(["123456788"]));
        expect(avlTree.tree.height).toBe(2);
    });
});
