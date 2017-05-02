"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Basic utilities used for comparison and validity
 */
var bTreeUtils = require("../bTreeUtils");
/**
 * Abstract class used as template for high level tree classes.
 */
var Node = (function () {
    /**
     * Constructor can be built upon on classes that extend this abstract class.
     * @param options
     */
    function Node(options) {
        this.options = options;
        /**
         * Holds a child of this Node type if given
         * @type {any}
         */
        this.left = null;
        /**
         * Holds a child of this Node type if given
         * @type {any}
         */
        this.right = null;
        this.key = options.key || null;
        this.parent = options.parent || null;
        this.value = options.value ? options.value : [null];
        this.unique = options.unique || false;
        this.compareKeys = options.compareKeys || bTreeUtils.defaultCompareKeysFunction;
        this.compareValues = options.compareValues || bTreeUtils.defaultCompareValues;
        this.checkKeyEquality = options.checkKeyEquality || bTreeUtils.defaultCheckKeyEquality;
        this.checkValueEquality = options.checkValueEquality || bTreeUtils.defaultCheckValueEquality;
    }
    /**
     * To return this class and not the extended version use this method.
     * @returns {Node}
     */
    Node.prototype.returnThisNode = function () {
        return this;
    };
    /**
     * Recursively call for right child till there is none then return
     * this.
     * @returns {any}
     */
    Node.prototype.getMaxKeyDescendant = function () {
        if (this.right) {
            return this.right.getMaxKeyDescendant();
        }
        else {
            return this;
        }
    };
    /**
     * Recursively call for left child till there is none then return this.
     * @returns {any}
     */
    Node.prototype.getMinKeyDescendant = function () {
        if (this.left) {
            return this.left.getMinKeyDescendant();
        }
        else {
            return this;
        }
    };
    /**
     * Returns the key of the max descendant
     * @returns {ASNDBS}
     */
    Node.prototype.getMaxKey = function () {
        return this.getMaxKeyDescendant().key;
    };
    /**
     * Returns the key of the min descendant
     * @returns {ASNDBS}
     */
    Node.prototype.getMinKey = function () {
        return this.getMinKeyDescendant().key;
    };
    /**
     * Used to check entire tree structure and individual branches
     * to validate pointers.
     */
    Node.prototype.checkIsNode = function () {
        this.checkNodeOrdering();
        this.checkInternalPointers();
        if (this.parent) {
            throw new Error("The root shouldn't have a parent");
        }
    };
    /**
     * Count every key in branch or entire tree.
     * @returns {number}
     */
    Node.prototype.getNumberOfKeys = function () {
        var res;
        if (this.key === null) {
            return 0;
        }
        res = 1;
        if (this.left) {
            res += this.left.getNumberOfKeys();
        }
        if (this.right) {
            res += this.right.getNumberOfKeys();
        }
        return res;
    };
    /**
     * Compare all keys, if there is no key then node fails then tree
     * fails validation check. keys have to be of the same type.
     * @param test
     */
    Node.prototype.checkAllNodesFullfillCondition = function (test) {
        test(this.key);
        if (this.key === null) {
            return;
        }
        if (this.left) {
            this.left.checkAllNodesFullfillCondition(test);
        }
        if (this.right) {
            this.right.checkAllNodesFullfillCondition(test);
        }
    };
    /**
     * Check all nodes and use compare keys function to validate Node
     * and children of this Node.
     */
    Node.prototype.checkNodeOrdering = function () {
        var _this = this;
        if (this.key === null) {
            return;
        }
        if (this.left) {
            this.left.checkAllNodesFullfillCondition(function (k) {
                if (_this.compareKeys(k, _this.key) >= 0) {
                    throw new Error("Tree with root " + _this.key + " is not a binary search tree");
                }
            });
            this.left.checkNodeOrdering();
        }
        if (this.right) {
            this.right.checkAllNodesFullfillCondition(function (k) {
                if (_this.compareKeys(k, _this.key) <= 0) {
                    throw new Error("Tree with root " + _this.key + " is not a binary search tree");
                }
            });
            this.right.checkNodeOrdering();
        }
    };
    /**
     * Make sure this Node is referenced in children correctly and check
     * all sub Nodes.
     */
    Node.prototype.checkInternalPointers = function () {
        if (this.left) {
            if (this.left.parent !== this) {
                throw new Error("Parent pointer broken for key " + this.key);
            }
            this.left.checkInternalPointers();
        }
        if (this.right) {
            if (this.right.parent !== this) {
                throw new Error("Parent pointer broken for key " + this.key);
            }
            this.right.checkInternalPointers();
        }
    };
    /**
     * Base method used in high method to compare keys of two Nodes.
     * @param query Example query: { $gt: 3 } or { $gte: 5 }
     * @returns {any}
     */
    Node.prototype.getLowerBoundMatcher = function (query) {
        // No lower bound, which means it matches the query
        if (!query.hasOwnProperty("$gt") && !query.hasOwnProperty("$gte")) {
            return true;
        }
        // don't crash just because user sent both options.
        // Choose the highest number for the largest constraint.
        if (query.hasOwnProperty("$gt") && query.hasOwnProperty("$gte")) {
            // $gte === $gt
            if (this.compareKeys(query.$gte, query.$gt) === 0) {
                // true: key > $gt, false: key < $gt
                return this.compareKeys(this.key, query.$gt) > 0;
            }
            // if $gte > $gt else $gte < $gt, Return the greater $gt
            if (this.compareKeys(query.$gte, query.$gt) > 0) {
                // true: key > $gte, false: key < $gte
                return this.compareKeys(this.key, query.$gte) >= 0;
            }
            else {
                // true: key > $gt, false: key < $gt
                return this.compareKeys(this.key, query.$gt) > 0;
            }
        }
        // if the query made it this far it either has $gt or $gte
        if (query.hasOwnProperty("$gt")) {
            return this.compareKeys(this.key, query.$gt) > 0;
        }
        else {
            return this.compareKeys(this.key, query.$gte) >= 0;
        }
    };
    /**
     * Base method used in high method to compare keys of two Nodes.
     * @param query Example usage: { $lt: 3 } or { $lte: 4 }
     * @returns {any}
     */
    Node.prototype.getUpperBoundMatcher = function (query) {
        // No lower bound, which means it matches the query
        if (!query.hasOwnProperty("$lt") && !query.hasOwnProperty("$lte")) {
            return true;
        }
        // don't crash just because user sent both options.
        // Choose the highest number for the largest constraint
        if (query.hasOwnProperty("$lt") && query.hasOwnProperty("$lte")) {
            // $lte === $lt
            if (this.compareKeys(query.$lte, query.$lt) === 0) {
                // true: key < $lt, false: key > $lt
                return this.compareKeys(this.key, query.$lt) < 0;
            }
            // if $lte < $lt else $lte > $lt, Return the greater $lt
            if (this.compareKeys(query.$lte, query.$lt) < 0) {
                // true: key <= $lte, false: key > $lte
                return this.compareKeys(this.key, query.$lte) <= 0;
            }
            else {
                // true: key < $lt, false: key > $lt
                return this.compareKeys(this.key, query.$lt) < 0;
            }
        }
        // if the query made it this far it either has $lt or $lte
        if (query.hasOwnProperty("$lt")) {
            return this.compareKeys(this.key, query.$lt) < 0;
        }
        else {
            return this.compareKeys(this.key, query.$lte) <= 0;
        }
    };
    /**
     * Check if this.key passes the equality check. A positive match will return false
     * and a negative match will return true.
     * @param query
     * @returns {boolean}
     */
    Node.prototype.getEqualityBounds = function (query) {
        // No equality bounds, means it matches
        if (!query.hasOwnProperty("$ne")) {
            return true;
        }
        else {
            // true: key != $ne, false: key = $ne
            return this.checkKeyEquality(this.key, query.$ne) === false;
        }
    };
    /**
     * Method for retrieving values based on key comparison of gt & lt & ne
     * @param query Example: { $gt: 1 , $lte: 3, $ne: 2 }
     * @returns {any}
     */
    Node.prototype.query = function (query) {
        var res = [];
        if (this.key === null) {
            return [];
        }
        if (this.key) {
            if (!query.hasOwnProperty("$ne")) {
                // If this Node has a left and the lbm was met check left child as well
                if (this.getLowerBoundMatcher(query) && this.left) {
                    res = res.concat(this.left.query(query));
                }
                // if this key matches the lbm and ubm then add the value
                if (this.getLowerBoundMatcher(query) && this.getUpperBoundMatcher(query)) {
                    res = res.concat(this.value);
                }
                // if this Node has a right and the lbm was meet check the right child as well
                if (this.getUpperBoundMatcher(query) && this.right) {
                    res = res.concat(this.right.query(query));
                }
            }
            else {
                // If this Node has a left and the lower and equal bounds are met
                if (this.getLowerBoundMatcher(query) && this.left) {
                    res = res.concat(this.left.query(query));
                }
                // If this key matches the lower bounds, the upper bounds, and the not equal bounds
                if (this.getLowerBoundMatcher(query) && this.getUpperBoundMatcher(query) && this.getEqualityBounds(query)) {
                    res = res.concat(this.value);
                }
                // If this Node has a right and the  upper, and equal bounds are met.
                if (this.getUpperBoundMatcher(query) && this.right) {
                    res = res.concat(this.right.query(query));
                }
            }
        }
        return res;
    };
    /**
     * Search for the key and return the value;
     * @param key
     * @returns {any} - they value
     */
    Node.prototype.search = function (key) {
        if (this.key === null) {
            return [];
        }
        if (this.compareKeys(this.key, key) === 0) {
            return this.value;
        }
        if (this.compareKeys(key, this.key) < 0) {
            if (this.left) {
                return this.left.search(key);
            }
            else {
                return [];
            }
        }
        else {
            if (this.right) {
                return this.right.search(key);
            }
            else {
                return [];
            }
        }
    };
    /**
     * Retrieve the height at this current Node location
     * @param tree
     * @returns {number}
     */
    Node.prototype.getTreeHeight = function (tree) {
        var leftHeight;
        var rightHeight;
        // if you send an empty tree
        if (tree === null) {
            return -1;
        }
        leftHeight = tree.left ? this.getTreeHeight(tree.left) : -1;
        rightHeight = tree.right ? this.getTreeHeight(tree.right) : -1;
        if (leftHeight > rightHeight) {
            return leftHeight + 1;
        }
        else {
            return rightHeight + 1;
        }
    };
    /**
     * Returns binary tree as an array of arrays.
     * Example: Inserting 0 - 4 keys in AVL tree would return
     * this example with this method. inserts them as they would
     * be seen in the binary tree
     *          __ 1 __
     *         /       \
     *        0         3
     *      /   \     /   \
     *    null  null 2     4
     *
     * [  [ { key: 1, value: [Object] }],
     *    [{key: 0, value: [Object]},{key: 3, value: [Object]}],
     *    [ null, null, {key: 2, value: [Object]},
     *    {key: 4, value: [Object]}]
     *  ]
     * @returns {any[]}
     */
    Node.prototype.getTreeAsArrayOfArrays = function () {
        var tree = this;
        var height = this.getTreeHeight(tree);
        // Used as a checker for number of elements that should be inserted per row
        var rows = bTreeUtils.getRowsArrayFromHeight(height);
        // The array of arrays holding at the end all the binary elements
        var all = bTreeUtils.createRefArrayFromTreeHeight(height);
        // recursive inner method needed to work on referenced constants.
        var traverse = function (node, h) {
            if (node) {
                // subtract 1 from current height to check next row after this node insertion
                var thisHeight = h - 1;
                // set root
                if (height === h) {
                    all[0].unshift({ key: node.key, value: node.value });
                    rows[0] = rows[0] - 1;
                }
                // add at this height level
                if (rows[height - h] > 0) {
                    all[height - h].unshift({ key: node.key, value: node.value });
                    // subtract 1 from the index at rows.
                    rows[height - h] = rows[height - h] - 1;
                }
                if (node.right) {
                    // insert node info in next row
                    traverse(node.right, thisHeight);
                }
                else {
                    // no node check if still another row
                    traverse(null, h);
                }
                if (node.left) {
                    // insert node info in next row
                    traverse(node.left, thisHeight);
                }
                else {
                    // no node check if still another row
                    traverse(null, h);
                }
            }
            else if (h) {
                // If there is a next row just no left/right node info insert null in its place to keep structure of binary tree in arrays.
                if (rows[height - h + 1] !== undefined) {
                    all[height - h + 1].unshift(null);
                    rows[height - h + 1] = rows[height - h + 1] - 1;
                }
            }
        };
        traverse(tree, height);
        return all;
    };
    /**
     * Turn tree into a JSON with an array of objects holding the key and value
     * Requires that key and value can be turned into JSON
     * @returns {any}
     */
    Node.prototype.toJSON = function () {
        var allArray = this.getTreeAsArrayOfArrays();
        var indexArray = bTreeUtils.createRandomSortedIndex(allArray);
        var finalJSON = [];
        for (var x = 0; x < allArray.length; x++) {
            for (var y = 0; y < allArray[x].length; y++) {
                finalJSON.push(allArray[x][indexArray[x][y]]);
            }
        }
        finalJSON = finalJSON.filter(function (val) { return val !== null; });
        finalJSON = JSON.stringify(finalJSON);
        return finalJSON;
    };
    /**
     * Execute a function on every node of the tree, in key order
     * @param fn
     */
    Node.prototype.executeOnEveryNode = function (fn) {
        if (this.left) {
            this.left.executeOnEveryNode(fn);
        }
        fn(this);
        if (this.right) {
            this.right.executeOnEveryNode(fn);
        }
    };
    return Node;
}());
exports.Node = Node;
