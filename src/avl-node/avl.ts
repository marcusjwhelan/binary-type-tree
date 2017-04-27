import { ASNDBS, SNDBSA, INodeConstructor, Node  } from "../basic-node";
import * as bTreeUtils from "../bTreeUtils";

export interface IAVLNode {
    height: number;
    right: AVLNode|null;
    left: AVLNode|null;
    parent: AVLNode|null;

    returnThisAVL(): this;
    createSimilar(options: INodeConstructor<AVLNode>): AVLNode;
    createLeftChild(options: INodeConstructor<AVLNode>): AVLNode;
    createRightChild(options: INodeConstructor<AVLNode>): AVLNode;
    checkisAVLT(): void;
    getAVLNodeFromKey(key: ASNDBS): AVLNode|null;
    _insert(key: ASNDBS, value: SNDBSA): void;
    _delete(key: ASNDBS, value: SNDBSA): AVLNode;
    _updateKey(key: ASNDBS, newKey: ASNDBS): AVLNode;
}

/**
 * Used to create an AVL tree with a binary search tree as the root of each Node
 */
export class AVLNode extends Node<AVLNode> implements IAVLNode {
    /**
     * Used to hold the depth of the tree at this point.
     * @type {number}
     */
    public height: number = 0;
    /**
     * Holds a child of this type Node as a Node in this type tree.
     */
    public right: AVLNode|null;
    /**
     * Holds a child of this type Node as a Node in this type tree.
     */
    public left: AVLNode|null;
    /**
     * Holds the parent of this type Node as a Node in this type tree.
     */
    public parent: AVLNode|null;
    /**
     * Uses abstract class as base to build off of for this class.
     * @param options
     */
    constructor(public options: INodeConstructor<AVLNode>) {
        super(options);
    }

    /**
     * To return this class if this class were to be extended.
     * @returns {AVLNode}
     */
    public returnThisAVL(): this {
        return this;
    }

    /**
     * Create a new AVL Node similar to this one except without the key and value
     * @param options
     * @returns {AVLNode}
     */
    public createSimilar(options: INodeConstructor<AVLNode>): AVLNode {
        options.unique = this.unique;
        this.compareKeys = options.compareKeys || bTreeUtils.defaultCompareKeysFunction;
        this.checkKeyEquality = options.checkKeyEquality || bTreeUtils.defaultCheckKeyEquality;
        this.checkValueEquality = options.checkValueEquality || bTreeUtils.defaultCheckValueEquality;

        return new AVLNode(options);
    }

    /**
     * Create a left child AVL Node with a reference to this parent AVL Node
     * @param options
     * @returns {AVLNode}
     */
    public createLeftChild(options: INodeConstructor<AVLNode>): AVLNode {
        const leftChild = this.createSimilar(options);
        leftChild.parent = this;
        this.left = leftChild;

        return leftChild;
    }

    /**
     * Create a right child AVL Node with a reference to this parent AVL Node
     * @param options
     * @returns {AVLNode}
     */
    public createRightChild(options: INodeConstructor<AVLNode>): AVLNode {
        const rightChild = this.createSimilar(options);
        rightChild.parent = this;
        this.right = rightChild;

        return rightChild;
    }

    /**
     * Calls upon super to check that all basic Node validation is met, along
     * with also checking the balance and height correctness of the AVL Node.
     */
    public checkisAVLT(): void {
        super.checkIsNode();
        this.checkHeightCorrect();
        this.checkBalanceFactors();
    }

    /**
     * Retrieve a specific Node.
     * @param key
     * @returns {any}
     */
    public getAVLNodeFromKey(key: ASNDBS): AVLNode|null {
        let currentNode: AVLNode = this;
        while (true) {
            if (currentNode.compareKeys(key, currentNode.key) === 0) {
                return currentNode;
            } else if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                } else {
                    return null;
                }
            } else {
                if (currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    return null;
                }
            }
        }
    }

    /**
     * Insert a key, value pair in the tree while maintaining the AVL tree height constraint
     * Return a pointer to the root node, which may have changed
     * @param key
     * @param value
     * @returns {AVLNode}
     * @private
     */
    public _insert(key: ASNDBS, value: SNDBSA): AVLNode {
        const insertPath: AVLNode[] = [];
        let currentNode: AVLNode = this;

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
                    throw new Error(`Can't insert key ${key}, it violates the unique constraint: TYPE: uniqueViolated`);
                } else {
                    // currentNode.value = currentNode.value.concat(value);
                    currentNode.value = bTreeUtils.append(currentNode.value, value);
                }
                return this;
            }

            insertPath.push(currentNode);

            if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (!currentNode.left) {
                    insertPath.push(currentNode.createLeftChild({ key, value }));
                    break;
                } else {
                    currentNode = currentNode.left;
                }
            } else {
                if (!currentNode.right) {
                    insertPath.push(currentNode.createRightChild({ key, value }));
                    break;
                } else {
                    currentNode = currentNode.right;
                }
            }
        }

        return this.rebalanceAlongPath(insertPath);
    }

    /**
     * Delete a key or just a value and return the new root of the tree
     * @param key
     * @param value - Need to send the value as an array for comparison.
     * @returns {any}
     * @private
     */
    public _delete(key: ASNDBS, value: SNDBSA): AVLNode {
        const deletePath: AVLNode[] = [];
        let newData: SNDBSA = [];
        let replaceWith: AVLNode|null;
        let currentNode: AVLNode = this;

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
                } else {
                    return this;   // node not found, no modification
                }
            } else { // Is greater go right
                if (currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    return this;   // node not found, no modification
                }
            }
        }

        // Delete only values (no tree modification)
        if (currentNode.value.length > 1 && value.length > 0) {
            for (const cv of currentNode.value) {
                for (const v of value) {
                    if (!currentNode.checkValueEquality(cv, v)) {
                        newData = bTreeUtils.append(newData, [cv]);
                    }
                }
            }
            /*currentNode.value.forEach((cV) => {
                value.forEach((v) => {
                    if (!currentNode.checkValueEquality(cV, v)) {
                        if (newData.indexOf(cV) === -1) {
                            newData.push(cV);
                        }
                    }
                });
            });*/
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
            } else {
                if (currentNode.parent) {
                    if (currentNode.parent.left === currentNode) {
                        currentNode.parent.left = null;
                    } else {
                        currentNode.parent.right = null;
                    }
                } else {
                    throw new Error(" Cannot Delete Root Node, cannot have node with null parent.");
                }
                return this.rebalanceAlongPath(deletePath);
            }
        }

        // Node with only one child
        if (!currentNode.left || !currentNode.right) {
            replaceWith = currentNode.left ? currentNode.left : currentNode.right;

            if (currentNode === this) {   // This basic-node is also the root
                if (replaceWith) {
                    replaceWith.parent = null;
                    return replaceWith;
                } else {
                    throw new Error("Cannot have Node with only one Child and one Null.");
                }

                // height of replaceWith is necessarily 1 because the tree was balanced before deletion
            } else {
                // With TS upgrade these objects must exist.
                if (replaceWith && currentNode && currentNode.parent) {
                    if (currentNode.parent.left === currentNode) {
                        currentNode.parent.left = replaceWith;
                        replaceWith.parent = currentNode.parent;
                    } else {
                        currentNode.parent.right = replaceWith;
                        replaceWith.parent = currentNode.parent;
                    }
                } else {
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
            if (replaceWith.left) { replaceWith.left.parent = currentNode; }
            return this.rebalanceAlongPath(deletePath);
        }

        // After this loop, replaceWith is the right-most leaf in the left subtree
        // and deletePath the path from the root (inclusive) to replaceWith (exclusive)
        while (true) {
            if (replaceWith.right) {
                deletePath.push(replaceWith);
                replaceWith = replaceWith.right;
            } else {
                break;
            }
        }

        currentNode.key = replaceWith.key;
        currentNode.value = replaceWith.value;

        // With upgrade to TS new check needed because parent
        // could be null
        if (replaceWith.parent) {
            replaceWith.parent.right = replaceWith.left;
        } else {
            throw new Error("Cannot have a child with a null parent.");
        }
        if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }

        return this.rebalanceAlongPath(deletePath);
    }

    public _updateKey(key: ASNDBS, newKey: ASNDBS): AVLNode {
        let currentNode: AVLNode = this;

        // Empty tree
        if (this.key === null) {
            return this;
        }

        // Cannot insert newKey that matches a another on a unique tree.
        if (currentNode.compareKeys(currentNode.key, newKey) === 0) {
            if (currentNode.unique) {
                throw new Error(`Can't insert key ${newKey}, it violates the unique constraint: TYPE: uniqueViolated`);
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
            if ( currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                } else {
                    return this; // node not found, no modification
                }
            } else { // Is greater go right. given key > this.key
                if (currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    return this; // node not found, no modification
                }
            }
        }

        // update only the key
        if (currentNode.checkKeyEquality(key, currentNode.key)) {
            // If unique simply update the key
            if (currentNode.unique) {
                const matchedNode: AVLNode|null = this.getAVLNodeFromKey(newKey);
                if (matchedNode) {
                    throw new Error(`Cannot update key:${key} with newKey:${newKey}, it violates the unique constraint.`);
                } else {
                    const currentValue: SNDBSA = currentNode.value;
                    this._delete(currentNode.key, currentNode.value);
                    return this._insert(newKey, currentValue);
                }
            } else {
                const matchedNode: AVLNode|null = this.getAVLNodeFromKey(newKey);
                // node was found
                if (matchedNode) {
                    // matchedNode.value = matchedNode.value.concat(currentNode.value);
                    matchedNode.value = bTreeUtils.append(matchedNode.value, currentNode.value);
                    return this._delete(currentNode.key, currentNode.value);
                } else { // no node matching new key was found.
                    const currentValue: SNDBSA = currentNode.value;
                    this._delete(currentNode.key, currentNode.value);
                    return this._insert(newKey, currentValue);
                }
            }
        }
        return this; // node not found no modification
    }

    /**
     * Re-balance the tree along the given path. The path is given reversed
     * Returns the new root of the tree
     * Of course, the first element of the path must be the root of the tree
     * @param path
     * @returns {AVLNode}
     */
    protected rebalanceAlongPath(path: AVLNode[]): AVLNode {
        let newRoot: AVLNode = this;
        let rotated;

        if (this.key === null) {
            delete this.height;
            return this;
        }

        // Re-balance the tree and update all heights
        for (let i = path.length - 1; i >= 0; i--) {
            const selfOfLoop = path[i];
            const arg1 = selfOfLoop.left ? selfOfLoop.left.height : 0;
            const arg2 = selfOfLoop.right ? selfOfLoop.right.height : 0;
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
    }

    /**
     * Check the recorded height for this AVL Node and all children.
     * Throws an error if one height does not match.
     */
    protected checkHeightCorrect(): void {
        let leftH: number;
        let rightH: number;

        if (this.key === null) {
            return;
        }

        if (this.left && this.left.height === undefined) {
            throw new Error(`Undefined height for AVLNode ${this.left.key}`);
        }
        if (this.right && this.right.height === undefined) {
            throw new Error(`Undefined height for AVLNode ${this.right.key}`);
        }
        if (this.height === undefined) {
            throw new Error(`Undefined height for AVLNode ${this.key}`);
        }

        leftH = this.left ? this.left.height : 0;
        rightH = this.right ? this.right.height : 0;

        if (this.height !== 1 + Math.max(leftH, rightH)) {
            throw new Error(`Height constraint failed for AVLNode ${this.key}`);
        }
        if (this.left) {
            this.left.checkHeightCorrect();
        }
        if (this.right) {
            this.right.checkHeightCorrect();
        }
    }

    /**
     * Returns the balance factor.
     * @returns {number}
     */
    protected balanceFactor(): number {
        const leftH: number = this.left ? this.left.height : 0;
        const rightH: number = this.right ? this.right.height : 0;

        return leftH - rightH;
    }

    /**
     * Check that the balance factors are between -1 and 1. Otherwise throw an error.
     */
    protected checkBalanceFactors(): void {
        if (Math.abs(this.balanceFactor()) > 1) {
            throw new Error(`Tree is unbalanced at AVLNode ${this.key}`);
        }

        if (this.left) {
            this.left.checkBalanceFactors();
        }
        if (this.right) {
            this.right.checkBalanceFactors();
        }
    }

    /**
     * Perform a right rotation of the tree if possible
     * and return the root of the resulting tree
     * The resulting tree's nodes' heights are also updated
     * @returns {AVLNode}
     */
    protected rightRotation(): AVLNode {
        const thisLeft = this.left;
        const currentNode = this;
        let thisLeftsRight;
        let thisLeftLeftH;
        let thisLeftRightH;
        let currentNodeRightH;

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
            } else {
                currentNode.parent.right = thisLeft;
            }
        } else {
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
    }

    /**
     * Perform a left rotation of the tree if possible
     * and return the root of the resulting tree
     * The resulting tree's nodes' heights are also updated
     * @returns {AVLNode}
     */
    protected leftRotation(): AVLNode {
        const thisRight = this.right;
        const currentNode = this;
        let thisRightsLeft;
        let currentNodeLeftH;
        let thisRightsLeftH;
        let thisRightRightH;

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
            } else {
                currentNode.parent.right = thisRight;
            }
        } else {
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
    }

    /**
     * Modify the tree if its right subtree is too small compared to the left.
     * Return the new root if any.
     * @returns {AVLNode}
     */
    protected rightTooSmall(): AVLNode {
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
    }

    /**
     * Modify the tree if its left subtree is too small compared to the right.
     * Return the new root if any.
     * @returns {AVLNode}
     */
    protected leftTooSmall(): AVLNode {
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
    }
}
