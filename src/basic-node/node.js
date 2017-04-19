"use strict";
exports.__esModule = true;
/**
 * Basic utilites used for comparison and validity
 */
var bTreeUtils = require("../bTreeUtils");
/**
 * Abstract class used as template for high level classes.
 */
var Node = (function () {
    /**
     *
     * @param options
     */
    function Node(options) {
        this.options = options;
        this.left = null;
        this.right = null;
        this.key = options.key;
        this.parent = options.parent !== undefined ? options.parent : null;
        this.value = [options.value];
        this.unique = options.unique || false;
        this.compareKeys = bTreeUtils.defaultCompareKeysFunction;
        this.checkValueEquality = bTreeUtils.defaultCheckValueEquality;
    }
    Node.prototype.returnThisNode = function () {
        return this;
    };
    Node.prototype.getMaxKeyDescendant = function () {
        if (this.right) {
            return this.right.getMaxKeyDescendant();
        }
        else {
            return this;
        }
    };
    Node.prototype.getMinKeyDescendant = function () {
        if (this.left) {
            return this.left.getMinKeyDescendant();
        }
        else {
            return this;
        }
    };
    Node.prototype.getMaxKey = function () {
        return this.getMaxKeyDescendant().key;
    };
    Node.prototype.getMinKey = function () {
        return this.getMinKeyDescendant().key;
    };
    Node.prototype.checkIsNode = function () {
        this.checkNodeOrdering();
        this.checkInternalPointers();
        if (this.parent) {
            throw new Error("The root shouldn't have a parent");
        }
    };
    Node.prototype.getNumberOfKeys = function () {
        var res;
        if (!this.hasOwnProperty("key")) {
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
    Node.prototype.checkAllNodesFullfillCondition = function (test) {
        test(this.key, this.value);
        if (!this.hasOwnProperty("key")) {
            return;
        }
        if (this.left) {
            this.left.checkAllNodesFullfillCondition(test);
        }
        if (this.right) {
            this.right.checkAllNodesFullfillCondition(test);
        }
    };
    Node.prototype.checkNodeOrdering = function () {
        var _this = this;
        if (!this.hasOwnProperty("key")) {
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
    Node.prototype.getLowerBoundMatcher = function (query) {
        var _this = this;
        // No lower bound
        if (!query.hasOwnProperty("$gt") && !query.hasOwnProperty("$gte")) {
            return function () { return true; };
        }
        if (query.hasOwnProperty("$gt") && query.hasOwnProperty("$gte")) {
            if (this.compareKeys(query.$gte, query.$gt) === 0) {
                return function (key) { return _this.compareKeys(key, query.$gt) > 0; };
            }
            if (this.compareKeys(query.$gte, query.$gt) > 0) {
                return function (key) { return _this.compareKeys(key, query.$gte) >= 0; };
            }
            else {
                return function (key) { return _this.compareKeys(key, query.$gt) > 0; };
            }
        }
        if (query.hasOwnProperty("$gt")) {
            return function (key) { return _this.compareKeys(key, query.$gt) > 0; };
        }
        else {
            return function (key) { return _this.compareKeys(key, query.$gte) >= 0; };
        }
    };
    Node.prototype.getUpperBoundMatcher = function (query) {
        var _this = this;
        // No lower bound
        if (!query.hasOwnProperty("$lt") && !query.hasOwnProperty("$lte")) {
            return function () { return true; };
        }
        if (query.hasOwnProperty("$lt") && query.hasOwnProperty("$lte")) {
            if (this.compareKeys(query.$lte, query.$lt) === 0) {
                return function (key) { return _this.compareKeys(key, query.$lt) < 0; };
            }
            if (this.compareKeys(query.$lte, query.$lt) < 0) {
                return function (key) { return _this.compareKeys(key, query.$lte) <= 0; };
            }
            else {
                return function (key) { return _this.compareKeys(key, query.$lt) < 0; };
            }
        }
        if (query.hasOwnProperty("$lt")) {
            return function (key) { return _this.compareKeys(key, query.$lt) < 0; };
        }
        else {
            return function (key) { return _this.compareKeys(key, query.$lte) <= 0; };
        }
    };
    Node.prototype.betweenBounds = function (query, lbm, ubm) {
        var res = [];
        if (!this.hasOwnProperty("key")) {
            return [];
        }
        lbm = lbm || this.getLowerBoundMatcher(query);
        ubm = ubm || this.getUpperBoundMatcher(query);
        if (lbm(this.key) && this.left) {
            res = res.concat(this.left.betweenBounds(query, lbm, ubm));
        }
        if (lbm(this.key) && ubm(this.key)) {
            res = res.concat(this.value);
        }
        if (ubm(this.key) && this.right) {
            res = res.concat(this.right.betweenBounds(query, lbm, ubm));
        }
        return res;
    };
    Node.prototype.deleteIfLeaf = function () {
        if (this.left || this.right) {
            return false;
        }
        // The leaf is itself a root
        if (!this.parent) {
            delete this.key;
            this.value = [];
            return true;
        }
        if (this.parent.left === this) {
            this.parent.left = null;
        }
        else {
            this.parent.right = null;
        }
        return true;
    };
    Node.prototype.deleteIfOnlyOneChild = function () {
        var child = null;
        if (this.left && !this.right) {
            child = this.left;
        }
        if (!this.left && this.right) {
            child = this.right;
        }
        if (!child) {
            return false;
        }
        // Root
        if (!this.parent) {
            this.key = child.key;
            this.value = child.value;
            this.left = null;
            if (child.left) {
                this.left = child.left;
                child.left.parent = this;
            }
            this.right = null;
            if (child.right) {
                this.right = child.right;
                child.right.parent = this;
            }
            return true;
        }
        if (this.parent.left === this) {
            this.parent.left = child;
            child.parent = this.parent;
        }
        else {
            this.parent.right = child;
            child.parent = this.parent;
        }
        return true;
    };
    Node.prototype.search = function (key) {
        if (!this.hasOwnProperty("key")) {
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
