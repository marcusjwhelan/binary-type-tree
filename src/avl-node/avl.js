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
Object.defineProperty(exports, "__esModule", { value: true });
var basic_node_1 = require("../basic-node");
var bTreeUtils = require("../bTreeUtils");
/**
 * Used to create an AVL tree with a binary search tree as the root of each Node
 */
var AVLNode = (function (_super) {
    __extends(AVLNode, _super);
    /**
     * Uses abstract class as base to build off of for this class.
     * @param options
     */
    function AVLNode(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        /**
         * Used to hold the depth of the tree at this point.
         * @type {number}
         */
        _this.height = 0;
        return _this;
    }
    /**
     * To return this class if this class were to be extended.
     * @returns {AVLNode}
     */
    AVLNode.prototype.returnThisAVL = function () {
        return this;
    };
    /**
     * Create a new AVL Node similar to this one except without the key and value
     * @param options
     * @returns {AVLNode}
     */
    AVLNode.prototype.createSimilar = function (options) {
        options.unique = this.unique;
        this.compareKeys = options.compareKeys || bTreeUtils.defaultCompareKeysFunction;
        this.checkKeyEquality = options.checkKeyEquality || bTreeUtils.defaultCheckKeyEquality;
        this.checkValueEquality = options.checkValueEquality || bTreeUtils.defaultCheckValueEquality;
        return new AVLNode(options);
    };
    /**
     * Create a left child AVL Node with a reference to this parent AVL Node
     * @param options
     * @returns {AVLNode}
     */
    AVLNode.prototype.createLeftChild = function (options) {
        var leftChild = this.createSimilar(options);
        leftChild.parent = this;
        this.left = leftChild;
        return leftChild;
    };
    /**
     * Create a right child AVL Node with a reference to this parent AVL Node
     * @param options
     * @returns {AVLNode}
     */
    AVLNode.prototype.createRightChild = function (options) {
        var rightChild = this.createSimilar(options);
        rightChild.parent = this;
        this.right = rightChild;
        return rightChild;
    };
    /**
     * Calls upon super to check that all basic Node validation is met, along
     * with also checking the balance and height correctness of the AVL Node.
     */
    AVLNode.prototype.checkisAVLT = function () {
        _super.prototype.checkIsNode.call(this);
        this.checkHeightCorrect();
        this.checkBalanceFactors();
    };
    /**
     * Retrieve a specific Node.
     * @param key
     * @returns {any}
     */
    AVLNode.prototype.getAVLNodeFromKey = function (key) {
        var currentNode = this;
        while (true) {
            if (currentNode.compareKeys(key, currentNode.key) === 0) {
                return currentNode;
            }
            else if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                }
                else {
                    return null;
                }
            }
            else {
                if (currentNode.right) {
                    currentNode = currentNode.right;
                }
                else {
                    return null;
                }
            }
        }
    };
    /**
     * Insert a key, value pair in the tree while maintaining the AVL tree height constraint
     * Return a pointer to the root node, which may have changed
     * @param key
     * @param value
     * @returns {AVLNode}
     * @private
     */
    AVLNode.prototype._insert = function (key, value) {
        var insertPath = [];
        var currentNode = this;
        // Empty tree, insert as root
        if (this.key === null) {
            this.key = key;
            this.value = value;
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
                    currentNode.value = currentNode.value.concat(value);
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
    /**
     * Delete a key or just a value and return the new root of the tree
     * @param key
     * @param value - Need to send the value as an array for comparison.
     * @returns {any}
     * @private
     */
    AVLNode.prototype._delete = function (key, value) {
        var deletePath = [];
        var newData = [];
        var replaceWith;
        var currentNode = this;
        // Empty tree
        if (this.key === null) {
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
            // Is less go left
            if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                }
                else {
                    return this; // node not found, no modification
                }
            }
            else {
                if (currentNode.right) {
                    currentNode = currentNode.right;
                }
                else {
                    return this; // node not found, no modification
                }
            }
        }
        // Delete only values (no tree modification)
        if (currentNode.value.length > 1 && value.length > 0) {
            currentNode.value.forEach(function (cV) {
                value.forEach(function (v) {
                    if (!currentNode.checkValueEquality(cV, v)) {
                        if (newData.indexOf(cV) === -1) {
                            newData.push(cV);
                        }
                    }
                });
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
    AVLNode.prototype._updateKey = function (key, newKey) {
        var currentNode = this;
        // Empty tree
        if (this.key === null) {
            return this;
        }
        // Cannot insert newKey that matches a another on a unique tree.
        if (currentNode.compareKeys(currentNode.key, newKey) === 0) {
            if (currentNode.unique) {
                throw new Error("Can't insert key " + newKey + ", it violates the unique constraint: TYPE: uniqueViolated");
            }
        }
        // Either no match is found and the function will return from
        // within the loop. Or a match is found and updatePath will
        // contain the path from the root to the AVLNode to be updated
        // after the loop
        while (true) {
            // keys match. this is the key to update
            if (currentNode.compareKeys(key, currentNode.key) === 0) {
                break;
            }
            // Is less go left. given key < this.key
            if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                }
                else {
                    return this; // node not found, no modification
                }
            }
            else {
                if (currentNode.right) {
                    currentNode = currentNode.right;
                }
                else {
                    return this; // node not found, no modification
                }
            }
        }
        // update only the key
        if (currentNode.checkKeyEquality(key, currentNode.key)) {
            // If unique simply update the key
            if (currentNode.unique) {
                var matchedNode = this.getAVLNodeFromKey(newKey);
                if (matchedNode) {
                    throw new Error("Cannot update key:" + key + " with newKey:" + newKey + ", it violates the unique constraint.");
                }
                else {
                    var currentValue = currentNode.value;
                    this._delete(currentNode.key, currentNode.value);
                    return this._insert(newKey, currentValue);
                }
            }
            else {
                var matchedNode = this.getAVLNodeFromKey(newKey);
                // node was found
                if (matchedNode) {
                    matchedNode.value = matchedNode.value.concat(currentNode.value);
                    return this._delete(currentNode.key, currentNode.value);
                }
                else {
                    var currentValue = currentNode.value;
                    this._delete(currentNode.key, currentNode.value);
                    return this._insert(newKey, currentValue);
                }
            }
        }
        return this; // node not found no modification
    };
    /**
     * Re-balance the tree along the given path. The path is given reversed
     * Returns the new root of the tree
     * Of course, the first element of the path must be the root of the tree
     * @param path
     * @returns {AVLNode}
     */
    AVLNode.prototype.rebalanceAlongPath = function (path) {
        var newRoot = this;
        var rotated;
        if (this.key === null) {
            delete this.height;
            return this;
        }
        // Re-balance the tree and update all heights
        for (var i = path.length - 1; i >= 0; i--) {
            var selfOfLoop = path[i];
            var arg1 = selfOfLoop.left ? selfOfLoop.left.height : 0;
            var arg2 = selfOfLoop.right ? selfOfLoop.right.height : 0;
            selfOfLoop.height = 1 + Math.max(arg1, arg2);
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
    /**
     * Check the recorded height for this AVL Node and all children.
     * Throws an error if one height does not match.
     */
    AVLNode.prototype.checkHeightCorrect = function () {
        var leftH;
        var rightH;
        if (this.key === null) {
            return;
        }
        if (this.left && this.left.height === undefined) {
            throw new Error("Undefined height for AVLNode " + this.left.key);
        }
        if (this.right && this.right.height === undefined) {
            throw new Error("Undefined height for AVLNode " + this.right.key);
        }
        if (this.height === undefined) {
            throw new Error("Undefined height for AVLNode " + this.key);
        }
        leftH = this.left ? this.left.height : 0;
        rightH = this.right ? this.right.height : 0;
        if (this.height !== 1 + Math.max(leftH, rightH)) {
            throw new Error("Height constraint failed for AVLNode " + this.key);
        }
        if (this.left) {
            this.left.checkHeightCorrect();
        }
        if (this.right) {
            this.right.checkHeightCorrect();
        }
    };
    /**
     * Returns the balance factor.
     * @returns {number}
     */
    AVLNode.prototype.balanceFactor = function () {
        var leftH = this.left ? this.left.height : 0;
        var rightH = this.right ? this.right.height : 0;
        return leftH - rightH;
    };
    /**
     * Check that the balance factors are between -1 and 1. Otherwise throw an error.
     */
    AVLNode.prototype.checkBalanceFactors = function () {
        if (Math.abs(this.balanceFactor()) > 1) {
            throw new Error("Tree is unbalanced at AVLNode " + this.key);
        }
        if (this.left) {
            this.left.checkBalanceFactors();
        }
        if (this.right) {
            this.right.checkBalanceFactors();
        }
    };
    /**
     * Perform a right rotation of the tree if possible
     * and return the root of the resulting tree
     * The resulting tree's nodes' heights are also updated
     * @returns {AVLNode}
     */
    AVLNode.prototype.rightRotation = function () {
        var thisLeft = this.left;
        var currentNode = this;
        var thisLeftsRight;
        var thisLeftLeftH;
        var thisLeftRightH;
        var currentNodeRightH;
        // No change
        if (!thisLeft) {
            return this;
        }
        thisLeftsRight = thisLeft.right;
        // Alter tree structure, actual right rotation
        if (currentNode.parent) {
            thisLeft.parent = currentNode.parent;
            if (currentNode.parent.left === currentNode) {
                currentNode.parent.left = thisLeft;
            }
            else {
                currentNode.parent.right = thisLeft;
            }
        }
        else {
            thisLeft.parent = null;
        }
        thisLeft.right = currentNode;
        currentNode.parent = thisLeft;
        currentNode.left = thisLeftsRight;
        if (thisLeftsRight) {
            thisLeftsRight.parent = currentNode;
        }
        // Update heights
        thisLeftLeftH = thisLeft.left ? thisLeft.left.height : 0;
        thisLeftRightH = thisLeftsRight ? thisLeftsRight.height : 0;
        currentNodeRightH = currentNode.right ? currentNode.right.height : 0;
        currentNode.height = Math.max(thisLeftRightH, currentNodeRightH) + 1;
        thisLeft.height = Math.max(thisLeftLeftH, currentNode.height) + 1;
        return thisLeft;
    };
    /**
     * Perform a left rotation of the tree if possible
     * and return the root of the resulting tree
     * The resulting tree's nodes' heights are also updated
     * @returns {AVLNode}
     */
    AVLNode.prototype.leftRotation = function () {
        var thisRight = this.right;
        var currentNode = this;
        var thisRightsLeft;
        var currentNodeLeftH;
        var thisRightsLeftH;
        var thisRightRightH;
        // No Change
        if (!thisRight) {
            return this;
        }
        thisRightsLeft = thisRight.left; // save this Rights left
        // Alter tree structure, actual left rotation
        if (currentNode.parent) {
            thisRight.parent = currentNode.parent;
            if (currentNode.parent.left === currentNode) {
                currentNode.parent.left = thisRight;
            }
            else {
                currentNode.parent.right = thisRight;
            }
        }
        else {
            thisRight.parent = null;
        }
        thisRight.left = currentNode;
        currentNode.parent = thisRight;
        currentNode.right = thisRightsLeft;
        if (thisRightsLeft) {
            thisRightsLeft.parent = currentNode;
        }
        // Update heights
        currentNodeLeftH = currentNode.left ? currentNode.left.height : 0;
        thisRightsLeftH = thisRightsLeft ? thisRightsLeft.height : 0;
        thisRightRightH = thisRight.right ? thisRight.right.height : 0;
        currentNode.height = Math.max(currentNodeLeftH, thisRightsLeftH) + 1;
        thisRight.height = Math.max(thisRightRightH, currentNode.height) + 1;
        return thisRight;
    };
    /**
     * Modify the tree if its right subtree is too small compared to the left.
     * Return the new root if any.
     * @returns {AVLNode}
     */
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
    /**
     * Modify the tree if its left subtree is too small compared to the right.
     * Return the new root if any.
     * @returns {AVLNode}
     */
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
    return AVLNode;
}(basic_node_1.Node));
exports.AVLNode = AVLNode;
