import { AVLNode } from "../src";

test("basic node test", () => {
    const node: AVLNode  = new AVLNode({key: "123", value: 3, unique: true});
    expect(node).toBeInstanceOf(AVLNode);
    expect(node.createRightChild({ key: "421", value: 4, unique: true})).toBeInstanceOf(AVLNode);
});
