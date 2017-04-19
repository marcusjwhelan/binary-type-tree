import * as bTreeUtils from "../bTreeUtils";
// Alias types
export type SNDBA = Array<(string|number|Date|boolean)>;
export type SNDB = string|number|Date|boolean;

// Function types
export type getBoolFromKey = (key?: SNDB) => boolean;
export type getLowerBoundsFn = (query: IGreatQuery) => getBoolFromKey;
export type getUpperBoundsFn = (query: ILessQueary) => getBoolFromKey;
export type compareKeys = (a: any, b: any ) => number;
export type checkValueEquality = (a: SNDB, b: SNDB ) => boolean;

// Interfaces
export interface IGreaterThan {
    $gt: any;
}
export interface ILessThan {
    $lt: any;
}
export interface IGreaterThanEqual {
    $gte: any;
}
export interface ILessThanEqual {
    $lte: any;
}
export interface IGreatQuery {
    $gt?: IGreaterThan;
    $gte?: IGreaterThanEqual;
}
export interface ILessQueary {
    $lt?: ILessThan;
    $lte?: ILessThanEqual;
}
export interface IAllQueary {
    $gt?: IGreaterThan;
    $gte?: IGreaterThanEqual;
    $lt?: ILessThan;
    $lte?: ILessThanEqual;
}

export interface INodeConstructor<T> {
    parent?: T|null;
    key: SNDB;
    value: SNDB;
    unique?: boolean;
    compareKeys?: any;
    checkValueEquality?: any;
}

export interface INode<T> {
    left: Node<T>|null;
    right: Node<T>|null;
    parent: Node<T>|null;
    key: SNDB;
    value: SNDBA;
    unique: boolean;
    compareKeys: compareKeys;
    checkValueEquality: checkValueEquality;

    returnThisNode(): this;
    getMaxKeyDescendant<T>(): T;
    getMinKeyDescendant<T>(): T;
    getMaxKey<T>(): SNDB;
    getMinKey<T>(): SNDB;
    checkIsNode(): void;
    getNumberOfKeys(): number;
    checkAllNodesFullfillCondition<T>(test: any): void;
    checkNodeOrdering(): void;
    checkInternalPointers(): void;
    getLowerBoundMatcher(query: IGreatQuery): getBoolFromKey;
    getUpperBoundMatcher(query: ILessQueary): getBoolFromKey;
    betweenBounds(query: IAllQueary, lbm: getLowerBoundsFn, ubm: getUpperBoundsFn): SNDBA;
    deleteIfLeaf(): boolean;
    deleteIfOnlyOneChild<T>(): boolean;
    search(key: SNDB): SNDBA;
    executeOnEveryNode(fn: any): any;
}

export abstract class Node<T> implements INode<T> {
    public left: Node<T>|null = null;
    public right: Node<T>|null = null;
    public parent: Node<T>|null;
    public key: SNDB;
    public value: SNDBA;
    public unique: boolean;
    public compareKeys: compareKeys;
    public checkValueEquality: checkValueEquality;

    /**
     * Constructor of Node, an abstract class
     * @param options Init object: required
     * @param options.key Key of Node: required
     * @param options.value Value of Node: required
     * @param options.parent
     */
    protected constructor( public options: INodeConstructor<Node<T>> ) {
        this.key = options.key;
        this.parent = options.parent !== undefined ? options.parent : null;
        this.value = [options.value];
        this.unique = options.unique || false;
        this.compareKeys = bTreeUtils.defaultCompareKeysFunction;
        this.checkValueEquality = bTreeUtils.defaultCheckValueEquality;
    }

    public returnThisNode(): this {
        return this;
    }
    public getMaxKeyDescendant<T>(): Node<T> {
        if (this.right) {
            return this.right.getMaxKeyDescendant<T>();
        } else {
            return this;
        }
    }
    public getMinKeyDescendant<T>(): Node<T> {
        if (this.left) {
            return this.left.getMinKeyDescendant<T>();
        } else {
            return this;
        }
    }
    public getMaxKey(): SNDB {
        return this.getMaxKeyDescendant<Node<T>>().key;
    }
    public getMinKey(): SNDB {
        return this.getMinKeyDescendant<Node<T>>().key;
    }
    public checkIsNode(): void {
        this.checkNodeOrdering();
        this.checkInternalPointers();
        if (this.parent) {
            throw new Error("The root shouldn't have a parent");
        }
    }
    public getNumberOfKeys(): number {
        let res: number;

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
    }
    public checkAllNodesFullfillCondition(test: any): void {
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
    }
    public checkNodeOrdering(): void {
        if (!this.hasOwnProperty("key")) {
            return;
        }

        if (this.left) {
            this.left.checkAllNodesFullfillCondition((k: SNDB) => {
                if (this.compareKeys(k, this.key) >= 0) {
                    throw new Error(`Tree with root ${this.key} is not a binary search tree`);
                }
            });
            this.left.checkNodeOrdering();
        }

        if (this.right) {
            this.right.checkAllNodesFullfillCondition((k: SNDB) => {
                if (this.compareKeys(k, this.key) <= 0) {
                    throw new Error(`Tree with root ${this.key} is not a binary search tree`);
                }
            });
            this.right.checkNodeOrdering();
        }
    }
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
    public getLowerBoundMatcher(query: IGreatQuery): getBoolFromKey {
        // No lower bound
        if (!query.hasOwnProperty("$gt") && !query.hasOwnProperty("$gte")) {
            return () => true;
        }

        if (query.hasOwnProperty("$gt") && query.hasOwnProperty("$gte")) {
            if (this.compareKeys(query.$gte, query.$gt) === 0) {
                return (key: SNDB): boolean => this.compareKeys(key, query.$gt) > 0;
            }

            if (this.compareKeys(query.$gte, query.$gt) > 0) {
                return (key: SNDB): boolean => this.compareKeys(key, query.$gte) >= 0;
            } else {
                return (key: SNDB): boolean => this.compareKeys(key, query.$gt) > 0;
            }
        }

        if (query.hasOwnProperty("$gt")) {
            return (key: SNDB): boolean => this.compareKeys(key, query.$gt) > 0;
        } else {
            return (key: SNDB): boolean => this.compareKeys(key, query.$gte) >= 0;
        }
    }
    public getUpperBoundMatcher(query: ILessQueary): getBoolFromKey {
        // No lower bound
        if (!query.hasOwnProperty("$lt") && !query.hasOwnProperty("$lte")) {
            return (): boolean => true;
        }

        if (query.hasOwnProperty("$lt") && query.hasOwnProperty("$lte")) {
            if (this.compareKeys(query.$lte, query.$lt) === 0) {
                return (key: SNDB): boolean => this.compareKeys(key, query.$lt) < 0;
            }

            if (this.compareKeys(query.$lte, query.$lt) < 0) {
                return (key: SNDB): boolean => this.compareKeys(key, query.$lte) <= 0;
            } else {
                return (key: SNDB): boolean => this.compareKeys(key, query.$lt) < 0;
            }
        }

        if (query.hasOwnProperty("$lt")) {
            return (key: SNDB): boolean => this.compareKeys(key, query.$lt) < 0;
        } else {
            return (key: SNDB): boolean => this.compareKeys(key, query.$lte) <= 0;
        }
    }
    public betweenBounds<T>(query: IAllQueary, lbm: getLowerBoundsFn, ubm: getUpperBoundsFn): SNDBA {
        let res: SNDBA = [];

        if (!this.hasOwnProperty("key")) {
            return [];
        }

        lbm = lbm || this.getLowerBoundMatcher(query);
        ubm = ubm || this.getUpperBoundMatcher(query);

        if (lbm(this.key) && this.left) {
            res = res.concat(this.left.betweenBounds<T>(query, lbm, ubm));
        }
        if (lbm(this.key) && ubm(this.key)) {
            res = res.concat(this.value);
        }
        if (ubm(this.key) && this.right) {
            res = res.concat(this.right.betweenBounds<T>(query, lbm, ubm));
        }

        return res;
    }
    public deleteIfLeaf(): boolean {
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
        } else {
            this.parent.right = null;
        }

        return true;
    }
    public deleteIfOnlyOneChild<T>(): boolean {
        let child: Node<T>|null = null;

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
        } else {
            this.parent.right = child;
            child.parent = this.parent;
        }

        return true;
    }
    public search(key: SNDB): SNDBA {
        if (!this.hasOwnProperty("key")) {
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
