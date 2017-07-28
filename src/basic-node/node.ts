/**
 * Basic utilities used for comparison and validity
 */
import * as bTreeUtils from "../utils/bTreeUtils";

/** Type used for Node value. */
export type SNDBSA = Array<{}|any[]|string|number|Date|boolean|null>;
/** Type used for Node key. You cannot use objects as keys or symbols */
export type ASNDBS = Array<any[]|string|number|Date|boolean|null>|string|number|Date|boolean|null;

/** Function type used for generic key and boolean return */
export type getBoolFromKey = (key?: ASNDBS) => boolean;
/** Function type used to compare keys with error throw */
export type getCompareKeys = (key: ASNDBS) => void;
/** Function type to return boolean  */
export type getLowerBoundsFn = (query: IGreatQuery) => boolean;
/** Function type to return boolean  */
export type getUpperBoundsFn = (query: ILessQueary) => boolean;
/** Function type to return boolean */
export type getEqualityBoundsFn = (geuery: INEQuery) => boolean;
/** Function type taking in(recommended keys) */
export type compareKeys = (a: any, b: any ) => number;
/** Function type taking in(recommended values) */
export type compareValues = (a: any, b: any) => number;
/** Function type taking in(recommended keys) */
export type checkKeyEquality = (a: ASNDBS, b: ASNDBS ) => boolean;
/** Function type taking in(recommended values) */
export type checkValueEquality = (a: any, b: any ) => boolean;

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
/** Interface for $ne query */
export interface INEQuery {
    $ne?: any;
}
/** Interface for $gt/$lt/$gte/$lte range */
export interface IAllQueary {
    $gt?: ASNDBS;
    $gte?: ASNDBS;
    $lt?: ASNDBS;
    $lte?: ASNDBS;
    $ne?: any;
}

/** Interface for Node constructor options */
export interface INodeConstructor<T> {
    parent?: T|null;
    key?: ASNDBS;
    value?: SNDBSA;
    unique?: boolean;
    compareKeys?: any;
    compareValues?: any;
    checkKeyEquality?: any;
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
    compareValues: compareValues;
    checkKeyEquality: checkKeyEquality;
    checkValueEquality: checkValueEquality;

    returnThisNode(): this;
    getMaxKeyDescendant<T>(): Node<T>;
    getMinKeyDescendant<T>(): Node<T>;
    getMaxKey<T>(): ASNDBS;
    getMinKey<T>(): ASNDBS;
    checkIsNode(): void;
    getNumberOfKeys(): number;
    checkAllNodesFullfillCondition<T>(test: any): void;
    checkNodeOrdering(): void;
    checkInternalPointers(): void;
    getLowerBoundMatcher(query: IGreatQuery): boolean;
    getUpperBoundMatcher(query: ILessQueary): boolean;
    getEqualityBounds(query: INEQuery): boolean;
    query(query: IAllQueary): SNDBSA;
    search(key: ASNDBS): SNDBSA;
    getTreeHeight<T>(tree: Node<T>): number;
    getTreeAsArrayOfArrays<T>(): any;
    toJSON<T>(): Promise<any>;
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
     * Default function compares only number and string other wise
     * the user will need to supply a custom key comparison function to
     * use this Node Tree model properly.
     */
    public compareKeys: compareKeys;
    /**
     * Default function compares only number and string otherwise
     * the use will need to supply a custom value comparison function to
     * use this Node Tree model properly.
     */
    public compareValues: compareValues;
    /**
     * Default function only checks key validity of number, string, and Date.
     * This function also only uses '===' for the comparison. Supply a
     * custom function in the constructor to use properly with your data
     * types.
     */
    public checkKeyEquality: checkKeyEquality;
    /**
     * Default function only checks value equality of number, string, and Date.
     * THis function also only uses '===' for the comparison. Supply a
     * custom function in the constructor to use properly with your data
     * types.
     */
    public checkValueEquality: checkValueEquality;

    /**
     * Constructor can be built upon on classes that extend this abstract class.
     * @param options
     */
    protected constructor( public options: INodeConstructor<Node<T>> ) {
        if (options.hasOwnProperty("key") && options.key !== undefined) {
            this.key = options.key;
        } else {
            this.key = null;
        }
        if (options.hasOwnProperty("value") && options.value !== undefined) {
            this.value = options.value;
        } else {
            this.value = [null];
        }
        this.parent = options.parent || null;
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
    public getLowerBoundMatcher(query: IGreatQuery): boolean {
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
            } else {
                // true: key > $gt, false: key < $gt
                return this.compareKeys(this.key, query.$gt) > 0;
            }
        }

        // if the query made it this far it either has $gt or $gte
        if (query.hasOwnProperty("$gt")) {
            return this.compareKeys(this.key, query.$gt) > 0;
        } else  {
            return this.compareKeys(this.key, query.$gte) >= 0;
        }
    }

    /**
     * Base method used in high method to compare keys of two Nodes.
     * @param query Example usage: { $lt: 3 } or { $lte: 4 }
     * @returns {any}
     */
    public getUpperBoundMatcher(query: ILessQueary): boolean {
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
            } else {
                // true: key < $lt, false: key > $lt
                return this.compareKeys(this.key, query.$lt) < 0;
            }
        }

        // if the query made it this far it either has $lt or $lte
        if (query.hasOwnProperty("$lt")) {
            return this.compareKeys(this.key, query.$lt) < 0;
        } else  {
            return this.compareKeys(this.key, query.$lte) <= 0;
        }
    }

    /**
     * Check if this.key passes the equality check. A positive match will return false
     * and a negative match will return true.
     * @param query
     * @returns {boolean}
     */
    public getEqualityBounds(query: INEQuery): boolean {
        // No equality bounds, means it matches
        if (!query.hasOwnProperty("$ne")) {
            return true;
        } else {
            // true: key != $ne, false: key = $ne
            return this.checkKeyEquality(this.key, query.$ne) === false;
        }
    }

    /**
     * Method for retrieving values based on key comparison of gt & lt & ne
     * @param query Example: { $gt: 1 , $lte: 3, $ne: 2 }
     * @returns {any}
     */
    public query(query: IAllQueary): SNDBSA {
        let res: SNDBSA = [];

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
            } else {
                // If this Node has a left and the lower and equal bounds are met
                if ( this.getLowerBoundMatcher(query) && this.left) {
                    res = res.concat(this.left.query(query));
                }
                // If this key matches the lower bounds, the upper bounds, and the not equal bounds
                if ( this.getLowerBoundMatcher(query) && this.getUpperBoundMatcher(query) && this.getEqualityBounds(query)) {
                    res = res.concat(this.value);
                }
                // If this Node has a right and the  upper, and equal bounds are met.
                if ( this.getUpperBoundMatcher(query) && this.right) {
                    res = res.concat(this.right.query(query));
                }
            }
        }

        return res;
    }

    /**
     * Search for the key and return the value;
     * @param key
     * @returns {any} - they value
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
     * Retrieve the height at this current Node location
     * @param tree
     * @returns {number}
     */
    public getTreeHeight<T>(tree: Node<T>): number {
        let leftHeight: number;
        let rightHeight: number;
        // if you send an empty tree
        if ( tree === null ) {
            return -1;
        }
        leftHeight = tree.left ? this.getTreeHeight<T>(tree.left) : -1;
        rightHeight = tree.right ? this.getTreeHeight<T>(tree.right) : -1;

        if ( leftHeight > rightHeight) {
            return leftHeight + 1;
        } else {
            return rightHeight + 1;
        }
    }

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
    public getTreeAsArrayOfArrays<T>(): any[] {
        const tree: Node<T> = this;
        const height: number = this.getTreeHeight(tree);
        // Used as a checker for number of elements that should be inserted per row
        const rows: number[] = bTreeUtils.getRowsArrayFromHeight(height);
        // The array of arrays holding at the end all the binary elements
        const all: any[] = bTreeUtils.createRefArrayFromTreeHeight(height);
        // recursive inner method needed to work on referenced constants.
        const traverse = (node: Node<T>|null, h: number) => {
            if (node) {
                // subtract 1 from current height to check next row after this node insertion
                const thisHeight = h - 1;
                // set root
                if (height === h) {
                    all[0].unshift({ key: node.key, value: node.value });
                    rows[0] = rows[0] - 1;
                }
                // add at this height level
                if (rows[height - h] > 0) {
                    all[height - h].unshift({key: node.key, value: node.value});
                    // subtract 1 from the index at rows.
                    rows[height - h] = rows[height - h] - 1;
                }
                if (node.right) {
                    // insert node info in next row
                    traverse(node.right, thisHeight);
                } else {
                    // no node check if still another row
                    traverse(null, h);
                }
                if (node.left) {
                    // insert node info in next row
                    traverse(node.left, thisHeight);
                } else {
                    // no node check if still another row
                    traverse(null, h);
                }
            } else if (h) {
                // If there is a next row just no left/right node info insert null in its place to keep structure of binary tree in arrays.
                if (rows[height - h + 1] !== undefined) {
                    all[height - h + 1].unshift(null);
                    rows[height - h + 1] = rows[height - h + 1] - 1;
                }
            }
        };

        traverse(tree, height);
        return all;
    }

    /**
     * Turn tree into JSON with an array of objects holding the key and value
     * Requires that key and value can be turned into JSON
     * @returns {any}
     */
    public toJSON<T>(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const allArray: any[] = this.getTreeAsArrayOfArrays<T>();
            let indexArray: any[];
            // const indexArray: any[] = bTreeUtils.createRandomSortedIndex(allArray);
            bTreeUtils.createRandomSortedIndex(allArray)
                .then((res) => {
                    indexArray = res;
                    let finalJSON: any = [];
                    allArray.forEach((value: any, x: number) => {
                        allArray[x].forEach((v: any, y: number) => {
                            finalJSON.push(allArray[x][indexArray[x][y]]);
                        });
                    });
                    finalJSON = finalJSON.filter((val: any) => {
                        return (Object.prototype.toString.call(val) === "[object Object]");
                    });
                    return JSON.stringify(finalJSON);
                })
                .then(resolve)
                .catch(reject);
        });
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
