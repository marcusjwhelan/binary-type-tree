import { AVLTree, AVLNode, getRandomArray, randomCharArray, SNDBSA, ASNDBS} from "../src";

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
                avlTree.insert(+num, v);
            }
        }

        test("number of keys", () => {
            const numKeys: number = avlTree.tree.getNumberOfKeys();

            expect(numKeys).toBe(65536); // count 0
        });

        test("if this AVL Tree and made of AVL Nodes", () => {
            expect(avlTree).toBeInstanceOf(AVLTree);
            expect(avlTree.tree).toBeInstanceOf(AVLNode);
            expect(avlTree.tree.height).toBe(17);
            avlTree.tree.checkisAVLT();
        });

        describe("Searching, Delete re-balance sanity check ", () => {
            avlTree.insert(992929189981, "recon");
            const searchedValue: SNDBSA = avlTree.tree.search(992929189981);
            const between: SNDBSA = avlTree.tree.query({$gte: 0, $lte: 100});

            const oddLTSearch: SNDBSA = avlTree.tree.query({$lte: 100, $lt: 20});
            const oddGTSearch: SNDBSA = avlTree.tree.query({$gte: 65400, $gt: 65401});

            test("for odd $gt search", () => {
                expect(oddGTSearch[0]).toBe("ach");
                expect(oddGTSearch.length).toBe(134);
            });

            test("for odd $lt search", () => {
                expect(oddLTSearch[0]).toBe("bcdefghijklmnop");
                expect(oddLTSearch.length).toBe(19);
            });

            test("if searchedValue was found", () => {
                expect(searchedValue).toEqual(expect.arrayContaining(["recon"]));
            });

            test("if 100 values were found", () => {
                expect(between.length).toBe(100);
                expect(between[0]).toBe("bcdefghijklmnop");
            });

            test("if deleting single node causes errors, should re-balance", () => {
                avlTree.delete(992929189981, "recon");
                expect(avlTree.tree.height).toBe(16);
                avlTree.tree.checkisAVLT();
            });

            test("searching max value and getting key", () => {
               const key: ASNDBS = avlTree.tree.getMaxKey();
               expect(key).toBe(65534);
            });

            test("searching min value and getting key", () => {
                const key: ASNDBS = avlTree.tree.getMinKey();
                expect(key).toBe(0);
            });

            test("deleting all but 100 values, searching 5 but 1 $ne to get 4 values", () => {
                const keys = getRandomArray(65530);
                for (let i = 0; i < keys.length; i++) {
                    const value: SNDBSA = avlTree.tree.search(i);
                    avlTree.delete(i, [value]);
                }
                const searchedValues = avlTree.tree.query({$lte: 65535, $gte: 65530, $ne: 65532});

                expect(avlTree.tree.query({}).length).toBe(5);
                expect(searchedValues).toEqual(expect.arrayContaining(["ac", "c", "b", "a"]));
                expect(searchedValues.length).toBe(4);
            });

            test("only using $ne", () => {
                const searchedNE = avlTree.tree.query({$ne: 65533});

                expect(searchedNE.length).toBe(4);
                expect(searchedNE).toEqual(expect.arrayContaining(["ac", "c", "ab", "a"]));
            });
        });
    });
});
