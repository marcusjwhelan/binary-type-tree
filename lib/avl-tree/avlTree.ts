import { AVLNode } from "../avl-node";
import { SNDB, INodeConstructor } from "../basic-node";

export interface IAVLTree {
    tree: AVLNode;

    insert(key: SNDB, value: SNDB): void;
    delete(key: SNDB, value: SNDB): void;
}

export class AVLTree extends AVLNode implements IAVLTree{
    public tree: AVLNode;

    constructor(public options: INodeConstructor<AVLNode>) {
        super(options);
        this.tree = new AVLNode(options);
    }

    public insert(key: SNDB, value: SNDB): void {
        const newTree = this.tree._insert(key, value);

        // If newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    }
    public delete(key: SNDB, value: SNDB): void {
        const newTree = this.tree._delete(key, value);

        // if newTree is undefined, that means its structure was not modified
        if (newTree) {
            this.tree = newTree;
        }
    }
}
