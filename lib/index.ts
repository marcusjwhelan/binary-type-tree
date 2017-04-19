export { IAVLNode , AVLNode } from "./avl-node";
export { AVLTree, IAVLTree } from "./avl-tree";
export { SNDB, SNDBA, getBoolFromKey, getLowerBoundsFn, getUpperBoundsFn,
    compareKeys, checkValueEquality, IGreaterThan, ILessThan,
    IGreaterThanEqual, ILessThanEqual, IGreatQuery, ILessQueary,
    IAllQueary, INodeConstructor, INode, Node } from "./basic-node";
export { getRandomArray, defaultCompareKeysFunction, defaultCheckValueEquality } from "./bTreeUtils";

export const sum = (...a: number[]) => a.reduce((acc, val) => acc + val, 0);
