"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var avl_node_1 = require("../avl-node");
var AVLTree = (function (_super) {
    __extends(AVLTree, _super);
    /**
     * Constructor of the AVLTree class
     * @param options
     */
    function AVLTree(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.tree = new avl_node_1.AVLNode(options);
        return _this;
    }
    /**
     *
     * @param key
     * @param value
     */
    AVLTree.prototype.insert = function (key, value) {
        var newTree = this.tree._insert(key, value);
        // If newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    };
    /**
     *
     * @param key
     * @param value
     */
    AVLTree.prototype["delete"] = function (key, value) {
        var newTree = this.tree._delete(key, value);
        // if newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    };
    return AVLTree;
}(avl_node_1.AVLNode));
exports.AVLTree = AVLTree;
