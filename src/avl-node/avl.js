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
var basic_node_1 = require("../basic-node");
var AVLNode = (function (_super) {
    __extends(AVLNode, _super);
    function AVLNode(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.height = 0;
        return _this;
    }
    AVLNode.prototype.returnThisAVL = function () {
        return this;
    };
    AVLNode.prototype.createSimilar = function (options) {
        options.unique = this.unique;
        return new AVLNode(options);
    };
    AVLNode.prototype.createLeftChild = function (options) {
        var leftChild = this.createSimilar(options);
        leftChild.parent = this;
        this.left = leftChild;
        return leftChild;
    };
    AVLNode.prototype.createRightChild = function (options) {
        var rightChild = this.createSimilar(options);
        rightChild.parent = this;
        this.right = rightChild;
        return rightChild;
    };
    AVLNode.prototype.checkHeightCorrect = function () {
        var leftH;
        var rightH;
        if (!this.hasOwnProperty("key")) {
            return;
        }
        if (this.left && this.left.height === undefined) {
            throw new Error("Undefined height for basic-node " + this.left.key);
        }
        if (this.right && this.right.height === undefined) {
            throw new Error("Undefined height for basic-node " + this.right.key);
        }
        if (this.height === undefined) {
            throw new Error("Undefined height for basic-node " + this.key);
        }
        leftH = this.left ? this.left.height : 0;
        rightH = this.right ? this.right.height : 0;
        if (this.height !== 1 + Math.max(leftH, rightH)) {
            throw new Error("Height constraint failed for basic-node " + this.key);
        }
        if (this.left) {
            this.left.checkHeightCorrect();
        }
        if (this.right) {
            this.right.checkHeightCorrect();
        }
    };
    AVLNode.prototype.balanceFactor = function () {
        var leftH = this.left ? this.left.height : 0;
        var rightH = this.right ? this.right.height : 0;
        return leftH - rightH;
    };
    AVLNode.prototype.checkBalanceFactors = function () {
        if (Math.abs(this.balanceFactor()) > 1) {
            throw new Error("Tree is unbalanced at basic-node " + this.key);
        }
        if (this.left) {
            this.left.checkBalanceFactors();
        }
        if (this.right) {
            this.right.checkBalanceFactors();
        }
    };
    AVLNode.prototype.checkisAVLT = function () {
        _super.prototype.checkIsNode.call(this);
        this.checkHeightCorrect();
        this.checkBalanceFactors();
    };
    AVLNode.prototype.rightRotation = function () {
        var p = this.left;
        var b;
        var ah;
        var bh;
        var ch;
        // No change
        if (!p) {
            return this;
        }
        b = p.right;
        // Alter tree structure
        if (this.parent) {
            p.parent = this.parent;
            if (this.parent.left === this) {
                this.parent.left = p;
            }
            else {
                this.parent.right = p;
            }
        }
        else {
            p.parent = null;
        }
        p.right = this;
        this.parent = p;
        this.left = b;
        if (b) {
            b.parent = this;
        }
        // Update heights
        ah = p.left ? p.left.height : 0;
        bh = b ? b.height : 0;
        ch = this.right ? this.right.height : 0;
        this.height = Math.max(bh, ch) + 1;
        p.height = Math.max(ah, this.height) + 1;
        return p;
    };
    AVLNode.prototype.leftRotation = function () {
        var q = this.right;
        var b;
        var ah;
        var bh;
        var ch;
        // No Change
        if (!q) {
            return this;
        }
        b = q.left;
        // Alter tree structure
        if (this.parent) {
            q.parent = this.parent;
            if (this.parent.left === this) {
                this.parent.left = q;
            }
            else {
                this.parent.right = q;
            }
        }
        else {
            q.parent = null;
        }
        q.left = this;
        this.parent = q;
        this.right = b;
        if (b) {
            b.parent = this;
        }
        // Update heights
        ah = this.left ? this.left.height : 0;
        bh = b ? b.height : 0;
        ch = q.right ? q.right.height : 0;
        this.height = Math.max(ah, bh) + 1;
        q.height = Math.max(ch, this.height) + 1;
        return q;
    };
    AVLNode.prototype.rightTooSmall = function () {
        // Right is not too small, don't change
        if (this.balanceFactor() <= 1) {
            return this;
        }
        if (this.left) {
            if (this.left.balanceFactor() < 0) {
                this.left.leftRotation();
            }
        }
        return this.rightRotation();
    };
    AVLNode.prototype.leftTooSmall = function () {
        // Left is not too small, don't change
        if (this.balanceFactor() >= -1) {
            return this;
        }
        if (this.right) {
            if (this.right.balanceFactor() > 0) {
                this.right.rightRotation();
            }
        }
        return this.leftRotation();
    };
    AVLNode.prototype.rebalanceAlongPath = function (path) {
        var newRoot = this;
        var rotated;
        if (!this.hasOwnProperty("key")) {
            delete this.height;
            return this;
        }
        // Re-balance the tree and update all heights
        for (var i = path.length - 1; i >= 0; i -= 1) {
            var selfOfLoop = path[i];
            var arg1 = selfOfLoop.left ? selfOfLoop.left.height : 0;
            var arg2 = selfOfLoop.right ? selfOfLoop.right.height : 0;
            var hHeight = Math.max(arg1, arg2);
            selfOfLoop.height = 1 + hHeight;
            if (selfOfLoop.balanceFactor() > 1) {
                rotated = selfOfLoop.rightTooSmall();
                if (i === 0) {
                    newRoot = rotated;
                }
            }
            if (selfOfLoop.balanceFactor() < -1) {
                rotated = selfOfLoop.leftTooSmall();
                if (i === 0) {
                    newRoot = rotated;
                }
            }
        }
        return newRoot;
    };
    AVLNode.prototype._insert = function (key, value) {
        var insertPath = [];
        var currentNode = this;
        // Empty tree, insert as root
        if (!this.hasOwnProperty("key")) {
            this.key = key;
            this.value.push(value);
            this.height = 1;
            return this;
        }
        // Insert new leaf at the right place
        while (true) {
            // Same key: no change in the tree structure
            if (currentNode.compareKeys(currentNode.key, key) === 0) {
                if (currentNode.unique) {
                    throw new Error("Can't insert key " + key + ", it violates the unique constraint: TYPE: uniqueViolated");
                }
                else {
                    currentNode.value.push(value);
                }
                return this;
            }
            insertPath.push(currentNode);
            if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (!currentNode.left) {
                    insertPath.push(currentNode.createLeftChild({ key: key, value: value }));
                    break;
                }
                else {
                    currentNode = currentNode.left;
                }
            }
            else {
                if (!currentNode.right) {
                    insertPath.push(currentNode.createRightChild({ key: key, value: value }));
                    break;
                }
                else {
                    currentNode = currentNode.right;
                }
            }
        }
        return this.rebalanceAlongPath(insertPath);
    };
    AVLNode.prototype._delete = function (key, value) {
        var deletePath = [];
        var newData = [];
        var replaceWith;
        var currentNode = this;
        // Empty tree
        if (!this.hasOwnProperty("key")) {
            return this;
        }
        // Either no match is found and the function will return
        // from within the loop
        // Or a match is found and deletePath will contain the path
        // from the root to the basic-node to delete after the loop
        while (true) {
            if (currentNode.compareKeys(key, currentNode.key) === 0) {
                break;
            }
            deletePath.push(currentNode);
            if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                }
                else {
                    return this; // Key not found, no modification
                }
            }
            else {
                // currentNode.compareKeys(key, currentNode.key) is > 0
                if (currentNode.right) {
                    currentNode = currentNode.right;
                }
                else {
                    return this; // Key not found, no modification
                }
            }
        }
        // Delete only a value (no tree modification)
        if (currentNode.value.length > 1 && value !== undefined) {
            currentNode.value.forEach(function (d) {
                if (!currentNode.checkValueEquality(d, value)) {
                    newData.push(d);
                }
            });
            currentNode.value = newData;
            return this;
        }
        // Delete a whole basic-node
        // Leaf
        if (!currentNode.left && !currentNode.right) {
            // This leaf is also the root
            if (currentNode === this) {
                delete currentNode.key;
                currentNode.value = [];
                delete currentNode.height;
                return this;
            }
            else {
                if (currentNode.parent) {
                    if (currentNode.parent.left === currentNode) {
                        currentNode.parent.left = null;
                    }
                    else {
                        currentNode.parent.right = null;
                    }
                }
                else {
                    throw new Error(" Cannot Delete Root Node, cannot have node with null parent.");
                }
                return this.rebalanceAlongPath(deletePath);
            }
        }
        // Node with only one child
        if (!currentNode.left || !currentNode.right) {
            replaceWith = currentNode.left ? currentNode.left : currentNode.right;
            if (currentNode === this) {
                if (replaceWith) {
                    replaceWith.parent = null;
                    return replaceWith;
                }
                else {
                    throw new Error("Cannot have Node with only one Child and one Null.");
                }
                // height of replaceWith is necessarily 1 because the tree was balanced before deletion
            }
            else {
                // With TS upgrade these objects must exist.
                if (replaceWith && currentNode && currentNode.parent) {
                    if (currentNode.parent.left === currentNode) {
                        currentNode.parent.left = replaceWith;
                        replaceWith.parent = currentNode.parent;
                    }
                    else {
                        currentNode.parent.right = replaceWith;
                        replaceWith.parent = currentNode.parent;
                    }
                }
                else {
                    throw new Error("Cannot delete root Node, cannot have child with null parent.");
                }
                return this.rebalanceAlongPath(deletePath);
            }
        }
        // Node with two children
        // Use the in-order predecessor (no need to randomize since we actively rebalance)
        deletePath.push(currentNode);
        replaceWith = currentNode.left;
        // Special case: the in-order predecessor is right below the basic-node to delete
        if (!replaceWith.right) {
            currentNode.key = replaceWith.key;
            currentNode.value = replaceWith.value;
            currentNode.left = replaceWith.left;
            if (replaceWith.left) {
                replaceWith.left.parent = currentNode;
            }
            return this.rebalanceAlongPath(deletePath);
        }
        // After this loop, replaceWith is the right-most leaf in the left subtree
        // and deletePath the path from the root (inclusive) to replaceWith (exclusive)
        while (true) {
            if (replaceWith.right) {
                deletePath.push(replaceWith);
                replaceWith = replaceWith.right;
            }
            else {
                break;
            }
        }
        currentNode.key = replaceWith.key;
        currentNode.value = replaceWith.value;
        // With upgrade to TS new check needed because parent
        // could be null
        if (replaceWith.parent) {
            replaceWith.parent.right = replaceWith.left;
        }
        else {
            throw new Error("Cannot have a child with a null parent.");
        }
        if (replaceWith.left) {
            replaceWith.left.parent = replaceWith.parent;
        }
        return this.rebalanceAlongPath(deletePath);
    };
    return AVLNode;
}(basic_node_1.Node));
exports.AVLNode = AVLNode;
