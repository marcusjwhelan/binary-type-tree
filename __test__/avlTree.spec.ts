import { AVLTree, AVLNode, getRandomArray, randomCharArray } from "../src";

describe("Test all of AVL Tree", () => {
    describe("basic tree create + insert + delete", () => {
        const avlTree: AVLTree = new AVLTree({unique: true});
        expect(avlTree).toBeInstanceOf(AVLTree);

        test("creating tree by adding AVL Node with key and value", () => {
            avlTree.insert("rocket", "123456789");

            expect(avlTree.tree.key).toBe("rocket");
            expect(avlTree.tree.value).toEqual(expect.arrayContaining(["123456789"]));
            expect(avlTree.tree.height).toBe(1);
            expect(avlTree.tree.parent).toBe(null);
            expect(avlTree.tree.left).toBe(null);
            expect(avlTree.tree.right).toBe(null);
        });

        test("insert children with valid references to parent", () => {
            avlTree.insert("league", "123456788");
            avlTree.insert("ghost", "123456787");
            const rocket: AVLNode|null = avlTree.tree.right;
            const league: AVLNode|null = avlTree.tree;
            const ghost: AVLNode|null = avlTree.tree.left;
            if (avlTree.tree.right) {
                expect(avlTree.tree.right.parent).toBe(league);
                expect(avlTree.tree.right).toBe(rocket);
            }
            if (avlTree.tree.left) {
                expect(avlTree.tree.left.parent).toBe(league);
                expect(avlTree.tree.left).toBe(ghost);
            }
            expect(avlTree.tree.parent).toBe(null);
        });

        test("left and right should be instances of AVLNode", () => {
            expect(avlTree.tree.right).toBeInstanceOf(AVLNode);
            expect(avlTree.tree.left).toBeInstanceOf(AVLNode);
        });

        test("appropriate values for key and value", () => {
            if (avlTree.tree.right) {
                expect(avlTree.tree.right.key).toBe("rocket");
                expect(avlTree.tree.right.value).toEqual(expect.arrayContaining(["123456789"]));
            }
            if (avlTree.tree.left) {
                expect(avlTree.tree.left.key).toBe("ghost");
                expect(avlTree.tree.left.value).toEqual(expect.arrayContaining(["123456787"]));
            }
            expect(avlTree.tree.key).toBe("league");
            expect(avlTree.tree.value).toEqual(expect.arrayContaining(["123456788"]));
        });

        test("tree has height of 2 after inserts", () => {
            expect(avlTree.tree.height).toBe(2);
        });

        test("delete one left child", () => {
            avlTree.delete("rocket", "123456789");

            expect(avlTree.tree.key).toBe("league");
            expect(avlTree.tree.value).toEqual(expect.arrayContaining(["123456788"]));
            expect(avlTree.tree.right).toBe(null);
            if (avlTree.tree.left) {
                expect(avlTree.tree.left.key).toBe("ghost");
            }
        });
    });

    describe("large scale tree", () => {
        const avlTree: AVLTree = new AVLTree({unique: true});
        const randomArray: number[] = getRandomArray(65535);
        const randomCArray: string[] = randomCharArray("abcdefghijklmnop");
        for (const num in randomArray) {
            if (randomArray.hasOwnProperty(num)) {
                const v: string = randomCArray.pop() || " ";
                avlTree.insert(num, v);
            }
        }

        test("is AVL Tree with AVL Nodes", () => {
            expect(avlTree).toBeInstanceOf(AVLTree);
            expect(avlTree.tree).toBeInstanceOf(AVLNode);
            expect(avlTree.tree.height).toBe(19);
            avlTree.tree.checkisAVLT();
        });
    });

});
