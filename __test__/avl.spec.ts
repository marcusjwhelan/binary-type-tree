import { AVLNode } from "../src";

test("basic node test", () => {
    const node: AVLNode  = new AVLNode({});
    expect(node).toBeInstanceOf(AVLNode);
    expect(node.createRightChild({ key: "421", value: 4, unique: true})).toBeInstanceOf(AVLNode);
});
