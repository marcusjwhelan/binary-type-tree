import { AVLTree, AVLNode, SNDBSA, ASNDBS } from "../src";
import useFakeTimers = jest.useFakeTimers;

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
        uJSON = UTree.tree.toJSON();
        aJSON = avlTree.tree.toJSON();
        expect(uJSON).toEqual("[{\"key\":1,\"value\":[\"1\"]},{\"key\":2,\"value\":[\"2\"]},{\"key\":0,\"value\":[\"0\"]}]");
        expect(aJSON).toEqual("[{\"key\":0,\"value\":[\"0\",\"2\"]},{\"key\":1,\"value\":[\"1\",\"3\"]}]");
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

});
