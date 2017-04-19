"use strict";
exports.__esModule = true;
var src_1 = require("../src");
test("basic node test", function () {
    var node = new src_1.AVLNode({ key: "123", value: 3, unique: true });
    expect(node).toBeInstanceOf(src_1.AVLNode);
    expect(node.createRightChild({ key: "421", value: 4, unique: true })).toBeInstanceOf(src_1.AVLNode);
});
