import { ASNDBS, SNDBSA, INodeConstructor, Node  } from "../basic-node";

export interface IAVLNode {
    height: number;
    right: AVLNode|null;
    left: AVLNode|null;
    parent: AVLNode|null;

    returnThisAVL(): this;
    createSimilar(options: INodeConstructor<AVLNode>): AVLNode;
    createLeftChild(options: INodeConstructor<AVLNode>): AVLNode;
    createRightChild(options: INodeConstructor<AVLNode>): AVLNode;
    checkHeightCorrect(): void;
    balanceFactor(): number;
    checkBalanceFactors(): void;
    checkisAVLT(): void;
    rightRotation(): AVLNode;
    leftRotation(): AVLNode;
    rightTooSmall(): AVLNode;
    leftTooSmall(): AVLNode;
    rebalanceAlongPath(path: AVLNode[]): AVLNode;
    _insert(key: ASNDBS, value: ASNDBS): void;
    _delete(key: ASNDBS, value: ASNDBS): AVLNode;
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
     * Create a new AVL Node inside of the parent Node.
     * @param options
     * @returns {AVLNode}
     */
    public createSimilar(options: INodeConstructor<AVLNode>): AVLNode {
        options.unique = this.unique;

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
     * Check the recorded height for this AVL Node and all children.
     * Throws an error if one height does not match.
     */
    public checkHeightCorrect(): void {
        let leftH: number;
        let rightH: number;

        if (this.key === null) {
            return;
        }

        if (this.left && this.left.height === undefined) {
            throw new Error(`Undefined height for basic-node ${this.left.key}`);
        }
        if (this.right && this.right.height === undefined) {
            throw new Error(`Undefined height for basic-node ${this.right.key}`);
        }
        if (this.height === undefined) {
            throw new Error(`Undefined height for basic-node ${this.key}`);
        }

        leftH = this.left ? this.left.height : 0;
        rightH = this.right ? this.right.height : 0;

        if (this.height !== 1 + Math.max(leftH, rightH)) {
            throw new Error(`Height constraint failed for basic-node ${this.key}`);
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
    public balanceFactor(): number {
        const leftH: number = this.left ? this.left.height : 0;
        const rightH: number = this.right ? this.right.height : 0;

        return leftH - rightH;
    }

    /**
     * Check that the balance factors are between -1 and 1. Otherwise throw an error.
     */
    public checkBalanceFactors(): void {
        if (Math.abs(this.balanceFactor()) > 1) {
            throw new Error(`Tree is unbalanced at basic-node ${this.key}`);
        }

        if (this.left) {
            this.left.checkBalanceFactors();
        }
        if (this.right) {
            this.right.checkBalanceFactors();
        }
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
     * Perform a right rotation of the tree if possible
     * and return the root of the resulting tree
     * The resulting tree's nodes' heights are also updated
     * @returns {AVLNode}
     */
    public rightRotation(): AVLNode {
        const p = this.left;
        let b;
        let ah;
        let bh;
        let ch;

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
            } else {
                this.parent.right = p;
            }
        } else {
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
    }

    /**
     * Perform a left rotation of the tree if possible
     * and return the root of the resulting tree
     * The resulting tree's nodes' heights are also updated
     * @returns {AVLNode}
     */
    public leftRotation(): AVLNode {
        const q = this.right;
        let b;
        let ah;
        let bh;
        let ch;

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
            } else {
                this.parent.right = q;
            }
        } else {
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
    }

    /**
     * Modify the tree if its right subtree is too small compared to the left.
     * Return the new root if any.
     * @returns {AVLNode}
     */
    public rightTooSmall(): AVLNode {
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
    public leftTooSmall(): AVLNode {
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

    /**
     * Re-balance the tree along the given path. The path is given reversed (as he was calculated
     * in the insert and delete functions).
     * Returns the new root of the tree
     * Of course, the first element of the path must be the root of the tree
     * @param path
     * @returns {AVLNode}
     */
    public rebalanceAlongPath(path: AVLNode[]): AVLNode {
        let newRoot: AVLNode = this;
        let rotated;

        if (this.key === null) {
            delete this.height;
            return this;
        }

        // Re-balance the tree and update all heights
        for (let i = path.length - 1; i >= 0; i -= 1) {
            const selfOfLoop = path[i];
            const arg1 = selfOfLoop.left ? selfOfLoop.left.height : 0;
            const arg2 = selfOfLoop.right ? selfOfLoop.right.height : 0;
            const hHeight = Math.max(arg1, arg2);
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
    }

    /**
     * Insert a key, value pair in the tree while maintaining the AVL tree height constraint
     * Return a pointer to the root node, which may have changed
     * @param key
     * @param value
     * @returns {AVLNode}
     * @private
     */
    public _insert(key: ASNDBS, value: ASNDBS): AVLNode {
        const insertPath: AVLNode[] = [];
        let currentNode: AVLNode = this;

        // Empty tree, insert as root
        if (this.key === null) {
             this.key = key;
             this.value = [value];
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
                    currentNode.value.push(value);
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
     * @param value
     * @returns {any}
     * @private
     */
    public _delete(key: ASNDBS, value: ASNDBS): AVLNode {
        const deletePath: AVLNode[] = [];
        const newData: SNDBSA = [];
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

            if (currentNode.compareKeys(key, currentNode.key) < 0) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                } else {
                    return this;   // Key not found, no modification
                }
            } else {
                // currentNode.compareKeys(key, currentNode.key) is > 0
                if (currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    return this;   // Key not found, no modification
                }
            }
        }

        // Delete only a value (no tree modification)
        if (currentNode.value.length > 1 && value !== undefined) {
            currentNode.value.forEach((d: ASNDBS) => {
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
}
