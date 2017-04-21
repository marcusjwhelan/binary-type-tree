import { AVLNode } from "../avl-node";
import { ASNDBS, INodeConstructor } from "../basic-node";

export interface IAVLTree {
    tree: AVLNode;

    insert(key: ASNDBS, value: ASNDBS): void;
    delete(key: ASNDBS, value: ASNDBS): void;
}

/**
 * Tree class for the AVL Nodes
 */
export class AVLTree extends AVLNode implements IAVLTree {
    /**
     * The AVL Tree, accumulation of AVL Nodes.
     */
    public tree: AVLNode;

    /**
     * Constructor of the AVLTree class
     * @param options
     */
    constructor(public options: INodeConstructor<AVLNode>) {
        super(options);
        this.tree = new AVLNode(options);
    }

    /**
     * Insert a new AVL Node into the tree an maintain AVL balance.
     * @param key
     * @param value
     */
    public insert(key: ASNDBS, value: ASNDBS): void {
        const newTree: AVLNode = this.tree._insert(key, value);

        // If newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    }

    /**
     * Delete a key or value and maintain AVL balance.
     * @param key
     * @param value
     */
    public delete(key: ASNDBS, value: ASNDBS): void {
        const newTree: AVLNode = this.tree._delete(key, value);

        // if newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    }
}
