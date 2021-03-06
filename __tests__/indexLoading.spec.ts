import { AVLTree, AVLNode, SNDBSA, ASNDBS } from "../src";

describe("testing a small index saving and loading", () => {
    const UTree: AVLTree = new AVLTree({unique: true});
    const avlTree: AVLTree = new AVLTree({unique: false});
    let uJSON: string;
    let aJSON: string;
    let uObj: any[];
    let aObj: any[];

    const nUTree: AVLTree = new AVLTree({unique: true});
    const nATree: AVLTree = new AVLTree({unique: false});

    test("inserting children unique", () => {
        expect.assertions(3);
        UTree.insert(0, ["0"]);
        UTree.insert(1, ["1"]);
        UTree.insert(2, ["2"]);

        const ri: AVLNode | null = UTree.tree.right;
        const ro: AVLNode | null = UTree.tree;
        const le: AVLNode | null = UTree.tree.left;
        if (ri && ro && le) {
            expect(ri.value).toEqual(expect.arrayContaining(["2"]));
            expect(ro.value).toEqual(expect.arrayContaining(["1"]));
            expect(le.value).toEqual(expect.arrayContaining(["0"]));
        }
    });

    test("inserting children not unique", () => {
        expect.assertions(2);
        avlTree.insert(0, ["0"]);
        avlTree.insert(1, ["1"]);
        avlTree.insert(0, ["2"]);
        avlTree.insert(1, ["3"]);

        const ro: AVLNode | null = avlTree.tree;
        const ri: AVLNode | null = avlTree.tree.right;

        if (ro && ri) {
            expect(ro.value).toEqual(expect.arrayContaining(["0", "2"]));
            expect(ri.value).toEqual(expect.arrayContaining(["1", "3"]));
        }
    });

    test("converting to json", () => {
        expect.assertions(2);
        return UTree.tree.toJSON()
            .then((res) => {
                uJSON = res;
                return avlTree.tree.toJSON();
            })
            .then((res) => {
                aJSON = res;
                expect(uJSON).toEqual("[{\"key\":1,\"value\":[\"1\"]},{\"key\":0,\"value\":[\"0\"]},{\"key\":2,\"value\":[\"2\"]}]");
                expect(aJSON).toEqual("[{\"key\":0,\"value\":[\"0\",\"2\"]},{\"key\":1,\"value\":[\"1\",\"3\"]}]");
            });
    });

    test("converting JSON to Obj", () => {
        uObj = JSON.parse(uJSON);
        aObj = JSON.parse(aJSON);
        expect(uObj).toEqual(expect.arrayContaining([
            {key: 1, value: ["1"]},
            {key: 2, value: ["2"]},
            {key: 0, value: ["0"]},
        ]));
        expect(aObj).toEqual(expect.arrayContaining([
            {key: 0, value: ["0", "2"]},
            {key: 1, value: ["1", "3"]},
        ]));
    });

    test("removing indices", () => {
        expect.assertions(1);
        avlTree.Delete(1, ["1", "3"]);
        avlTree.Delete(0, ["0"]);
        return avlTree.tree.toJSON()
            .then((res) => {
                expect(JSON.parse(res)).toEqual(expect.arrayContaining([
                    {key: 0, value: ["2"]},
                ]));
            });
    });

    test("inserting loaded object into new tree unique", () => {
        uObj.forEach((obj) => {
            nUTree.insert(obj.key, obj.value);
        });
        const ri: AVLNode | null = nUTree.tree.right;
        const ro: AVLNode | null = nUTree.tree;
        const le: AVLNode | null = nUTree.tree.left;
        if (ri && ro && le) {
            expect(ri.value).toEqual(expect.arrayContaining(["2"]));
            expect(ro.value).toEqual(expect.arrayContaining(["1"]));
            expect(le.value).toEqual(expect.arrayContaining(["0"]));
        }
    });

    test("inserting loaded object into new tree non unique", () => {
        aObj.forEach((obj) => {
            nATree.insert(obj.key, obj.value);
        });
        const ro: AVLNode | null = nATree.tree;
        const ri: AVLNode | null = nATree.tree.right;

        if (ro && ri) {
            expect(ro.value).toEqual(expect.arrayContaining(["0", "2"]));
            expect(ri.value).toEqual(expect.arrayContaining(["1", "3"]));
        }
    });

    test("finding", () => {
        const two = nUTree.tree.search(2);
        const zero = nATree.tree.search(0);
        expect(two).toEqual(expect.arrayContaining(["2"]));
        expect(zero).toEqual(expect.arrayContaining(["0", "2"]));
    });

});
