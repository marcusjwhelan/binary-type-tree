/**
 * Basic utilities used for comparison and validity
 */
import * as bTreeUtils from "../bTreeUtils";

/** Type used for Node value. */
export type SNDBSA = Array<{}|any[]|string|number|Date|boolean|symbol|null>;
/** Type used for Node key. You cannot use objects as keys */
export type ASNDBS = Array<any[]|string|number|Date|boolean|symbol|null>|string|number|Date|boolean|symbol|null;

/** Function type used for generic key and boolean return */
export type getBoolFromKey = (key?: ASNDBS) => boolean;
/** Function type used to compare keys with error throw */
export type getCompareKeys = (key: ASNDBS) => void;
/** Function type to return function type getBoolFromKey  */
export type getLowerBoundsFn = (query: IGreatQuery) => getBoolFromKey;
/** Function type to return function type getBoolFromKey  */
export type getUpperBoundsFn = (query: ILessQueary) => getBoolFromKey;
/** Function type taking in(recommended keys) */
export type compareKeys = (a: any, b: any ) => number;
/** Function type taking in(recommended keys) */
export type checkValueEquality = (a: ASNDBS, b: ASNDBS ) => boolean;

/** Interface for $gt/$gte range */
export interface IGreatQuery {
    $gt?: ASNDBS;
    $gte?: ASNDBS;
}
/** Interface for $lt/$lte range */
export interface ILessQueary {
    $lt?: ASNDBS;
    $lte?: ASNDBS;
}
/** Interface for $gt/$lt/$gte/$lte range */
export interface IAllQueary {
    $gt?: ASNDBS;
    $gte?: ASNDBS;
    $lt?: ASNDBS;
    $lte?: ASNDBS;
}

/** Interface for Node constructor options */
export interface INodeConstructor<T> {
    parent?: T|null;
    key?: ASNDBS;
    value?: ASNDBS;
    unique?: boolean;
    compareKeys?: any;
    checkValueEquality?: any;
}

export interface INode<T> {
    left: Node<T>|null;
    right: Node<T>|null;
    parent: Node<T>|null;
    key: ASNDBS;
    value: SNDBSA;
    unique: boolean;
    compareKeys: compareKeys;
    checkValueEquality: checkValueEquality;

    returnThisNode(): this;
    getMaxKeyDescendant<T>(): T;
    getMinKeyDescendant<T>(): T;
    getMaxKey<T>(): ASNDBS;
    getMinKey<T>(): ASNDBS;
    checkIsNode(): void;
    getNumberOfKeys(): number;
    checkAllNodesFullfillCondition<T>(test: any): void;
    checkNodeOrdering(): void;
    checkInternalPointers(): void;
    getLowerBoundMatcher(query: IGreatQuery): getBoolFromKey;
    getUpperBoundMatcher(query: ILessQueary): getBoolFromKey;
    betweenBounds(query: IAllQueary, lbm: getLowerBoundsFn, ubm: getUpperBoundsFn): SNDBSA;
    search(key: ASNDBS): SNDBSA;
    executeOnEveryNode(fn: any): any;
}

/**
 * Abstract class used as template for high level tree classes.
 */
export abstract class Node<T> implements INode<T> {
    /**
     * Holds a child of this Node type if given
     * @type {any}
     */
    public left: Node<T>|null = null;
    /**
     * Holds a child of this Node type if given
     * @type {any}
     */
    public right: Node<T>|null = null;
    /**
     * Holds the parent of this Node type if it exists
     */
    public parent: Node<T>|null;
    /**
     * The key used to find this Node
     */
    public key: ASNDBS;
    /**
     * The value this Node holds
     */
    public value: SNDBSA;
    /**
     * set in the constructor to have only unique keys
     */
    public unique: boolean;
    /**
     * Default function compares only number, string and Date other wise
     * the user will need to supply a custom key comparison function to
     * use this Node Tree model properly.
     */
    public compareKeys: compareKeys;
    /**
     * Default function only checks validity of number, string, and Date.
     * This function also only uses '===' for the comparison. Supply a
     * custom function in the constructor to use properly with your data
     * types.
     */
    public checkValueEquality: checkValueEquality;

    /**
     * Constructor can be built upon on classes that extend this abstract class.
     * @param options
     */
    protected constructor( public options: INodeConstructor<Node<T>> ) {
        this.key = options.key || null;
        this.parent = options.parent || null;
        this.value = options.value ? [options.value] : [null];
        this.unique = options.unique || false;
        this.compareKeys = options.compareKeys || bTreeUtils.defaultCompareKeysFunction;
        this.checkValueEquality = options.checkValueEquality || bTreeUtils.defaultCheckValueEquality;
    }

    /**
     * To return this class and not the extended version use this method.
     * @returns {Node}
     */
    public returnThisNode(): this {
        return this;
    }

    /**
     * Recursively call for right child till there is none then return
     * this.
     * @returns {any}
     */
    public getMaxKeyDescendant<T>(): Node<T> {
        if (this.right) {
            return this.right.getMaxKeyDescendant<T>();
        } else {
            return this;
        }
    }

    /**
     * Recursively call for left child till there is none then return this.
     * @returns {any}
     */
    public getMinKeyDescendant<T>(): Node<T> {
        if (this.left) {
            return this.left.getMinKeyDescendant<T>();
        } else {
            return this;
        }
    }

    /**
     * Returns the key of the max descendant
     * @returns {ASNDBS}
     */
    public getMaxKey(): ASNDBS {
        return this.getMaxKeyDescendant<Node<T>>().key;
    }

    /**
     * Returns the key of the min descendant
     * @returns {ASNDBS}
     */
    public getMinKey(): ASNDBS {
        return this.getMinKeyDescendant<Node<T>>().key;
    }

    /**
     * Used to check entire tree structure and individual branches
     * to validate pointers.
     */
    public checkIsNode(): void {
        this.checkNodeOrdering();
        this.checkInternalPointers();
        if (this.parent) {
            throw new Error("The root shouldn't have a parent");
        }
    }

    /**
     * Count every key in branch or entire tree.
     * @returns {number}
     */
    public getNumberOfKeys(): number {
        let res: number;

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
    }

    /**
     * Compare all keys, if there is no key then node fails then tree
     * fails validation check. keys have to be of the same type.
     * @param test
     */
    public checkAllNodesFullfillCondition(test: getCompareKeys): void {
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
    }

    /**
     * Check all nodes and use compare keys function to validate Node
     * and children of this Node.
     */
    public checkNodeOrdering(): void {
        if (this.key === null) {
            return;
        }

        if (this.left) {
            this.left.checkAllNodesFullfillCondition((k: ASNDBS) => {
                if (this.compareKeys(k, this.key) >= 0) {
                    throw new Error(`Tree with root ${this.key} is not a binary search tree`);
                }
            });
            this.left.checkNodeOrdering();
        }

        if (this.right) {
            this.right.checkAllNodesFullfillCondition((k: ASNDBS) => {
                if (this.compareKeys(k, this.key) <= 0) {
                    throw new Error(`Tree with root ${this.key} is not a binary search tree`);
                }
            });
            this.right.checkNodeOrdering();
        }
    }

    /**
     * Make sure this Node is referenced in children correctly and check
     * all sub Nodes.
     */
    public checkInternalPointers(): void {
        if (this.left) {
            if (this.left.parent !== this) {
                throw new Error(`Parent pointer broken for key ${this.key}`);
            }
            this.left.checkInternalPointers();
        }

        if (this.right) {
            if (this.right.parent !== this) {
                throw new Error(`Parent pointer broken for key ${this.key}`);
            }
            this.right.checkInternalPointers();
        }
    }

    /**
     * Base method used in high method to compare keys of two Nodes.
     * @param query Example query: { $gt: 3 } or { $gte: 5 }
     * @returns {any}
     */
    public getLowerBoundMatcher(query: IGreatQuery): getBoolFromKey {
        // No lower bound
        if (!query.hasOwnProperty("$gt") && !query.hasOwnProperty("$gte")) {
            return () => true;
        }

        if (query.hasOwnProperty("$gt") && query.hasOwnProperty("$gte")) {
            if (this.compareKeys(query.$gte, query.$gt) === 0) {
                return (key: ASNDBS): boolean => this.compareKeys(key, query.$gt) > 0;
            }

            if (this.compareKeys(query.$gte, query.$gt) > 0) {
                return (key: ASNDBS): boolean => this.compareKeys(key, query.$gte) >= 0;
            } else {
                return (key: ASNDBS): boolean => this.compareKeys(key, query.$gt) > 0;
            }
        }

        if (query.hasOwnProperty("$gt")) {
            return (key: ASNDBS): boolean => this.compareKeys(key, query.$gt) > 0;
        } else {
            return (key: ASNDBS): boolean => this.compareKeys(key, query.$gte) >= 0;
        }
    }

    /**
     * Base method used in high method to compare keys of two Nodes.
     * @param query Example usage: { $lt: 3 } or { $lte: 4 }
     * @returns {any}
     */
    public getUpperBoundMatcher(query: ILessQueary): getBoolFromKey {
        // No lower bound
        if (!query.hasOwnProperty("$lt") && !query.hasOwnProperty("$lte")) {
            return (): boolean => true;
        }

        if (query.hasOwnProperty("$lt") && query.hasOwnProperty("$lte")) {
            if (this.compareKeys(query.$lte, query.$lt) === 0) {
                return (key: ASNDBS): boolean => this.compareKeys(key, query.$lt) < 0;
            }

            if (this.compareKeys(query.$lte, query.$lt) < 0) {
                return (key: ASNDBS): boolean => this.compareKeys(key, query.$lte) <= 0;
            } else {
                return (key: ASNDBS): boolean => this.compareKeys(key, query.$lt) < 0;
            }
        }

        if (query.hasOwnProperty("$lt")) {
            return (key: ASNDBS): boolean => this.compareKeys(key, query.$lt) < 0;
        } else {
            return (key: ASNDBS): boolean => this.compareKeys(key, query.$lte) <= 0;
        }
    }

    /**
     * Method for retrieving values based on key comparison of gt & lt
     * @param query Example: { $gt: 1 , $lte: 3 }
     * @param lbm Defaults to getLowerBounds but can be used with custom
     * @param ubm Defaults to getUpperBounds but can be used with custom
     * @returns {any}
     */
    public betweenBounds<T>(query: IAllQueary, lbm: getLowerBoundsFn, ubm: getUpperBoundsFn): SNDBSA {
        let res: SNDBSA = [];

        if (this.key === null) {
            return [];
        }

        lbm = lbm || this.getLowerBoundMatcher(query);
        ubm = ubm || this.getUpperBoundMatcher(query);

        if (this.key) {
            if (lbm(this.key) && this.left) {
                res = res.concat(this.left.betweenBounds<T>(query, lbm, ubm));
            }
            if (lbm(this.key) && ubm(this.key)) {
                res = res.concat(this.value);
            }
            if (ubm(this.key) && this.right) {
                res = res.concat(this.right.betweenBounds<T>(query, lbm, ubm));
            }
        }

        return res;
    }

    /**
     * Search for the key and return the value;
     * @param key
     * @returns {any}
     */
    public search(key: ASNDBS): SNDBSA {
        if (this.key === null) {
            return [];
        }

        if (this.compareKeys(this.key, key) === 0) {
            return this.value;
        }

        if (this.compareKeys(key, this.key) < 0) {
            if (this.left) {
                return this.left.search(key);
            } else {
                return [];
            }
        } else {
            if (this.right) {
                return this.right.search(key);
            } else {
                return [];
            }
        }
    }

    /**
     * Execute a function on every node of the tree, in key order
     * @param fn
     */
    public executeOnEveryNode(fn: any): any {
        if (this.left) {
            this.left.executeOnEveryNode(fn);
        }
        fn(this);
        if (this.right) {
            this.right.executeOnEveryNode(fn);
        }
    }
}
