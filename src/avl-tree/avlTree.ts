import { AVLNode } from "../avl-node";
import { ASNDBS, INodeConstructor } from "../basic-node";

export interface IAVLTree {
    tree: AVLNode;

    insert(key: ASNDBS, value: ASNDBS): void;
    delete(key: ASNDBS, value: ASNDBS): void;
}

export class AVLTree extends AVLNode implements IAVLTree {
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
     *
     * @param key
     * @param value
     */
    public insert(key: ASNDBS, value: ASNDBS): void {
        const newTree = this.tree._insert(key, value);

        // If newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    }

    /**
     *
     * @param key
     * @param value
     */
    public delete(key: ASNDBS, value: ASNDBS): void {
        const newTree = this.tree._delete(key, value);

        // if newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    }
}
