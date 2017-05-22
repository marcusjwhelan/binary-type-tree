[![Build Status](https://travis-ci.org/marcusjwhelan/binary-type-tree.svg?branch=master)](https://travis-ci.org/marcusjwhelan/binary-type-tree)

# binary-type-tree
A binary search tree with AVL balancing.

I will be working to add different balancing techniques such as red black trees, scapegoat, and splay. Uses ES6 module system and can be used on the front end and for Node. It's 2017 why not write the module system in ES6. Every utility function, type, interface, and class are able to be imported from the module or as one object.


## Install

```bash
npm install --save binary-type-tree
```

## Usage
The library for now uses only an AVL balanced binary tree. The basic structure is 

```
AVLTree - AVLNode - Node<T>
```
The node is a generic abstract class which can be extended. AVLNode class extends this generic Node.
Finally the AVLTree extends the AVLNode, which simply is a parent class that holds the entire tree 
of AVLNodes. AVLNode is simply an extension of the base Node class which I hope to build on for more
self balancing trees. AVL is simply the first choice. 

## Table of Contents

* <a href="#creating-an-avl-tree">Creating an AVL Tree</a>
* <a href="#inserting-and-deleting-into-the-avl-tree">Inserting and deleting into the AVL Tree</a>
* <a href="#querying-the-avl-tree">Querying the AVL Tree</a>
* <a href="#key-update-on-avl-tree">Key update on AVL Tree</a>
* <a href="#avl-tree-extra-functionality">AVL tree extra functionality</a>
* <a href="#tojson">toJSON</a>

## Creating an AVL Tree
 
Before you create a tree you will want to consider how your keys and values will be structured. All values
are stored as an array even when just one element. The key can be many different types but cannot be an `object`. 
There are three functions provided by default in `src/bTreeUtils.ts`, that compare equality and validity 
that can be replaced by custom functions. These are very important when it comes to `$gt, $lt, $ne` comparisons
made for the `query` method. The implementation of the `query` is on the root Node<T> at `lib/basic-node/node.ts`. During the constructor you can choose to initialize your AVL tree with several starters or none.

* key - If you would like a key on the initial Node. Inserting a new key/value pair will balance.
* value - If you would like a value on the initial Node.
* unique - Set your keys to be unique or not
* compareKeys - A function to compare keys, mostly used in the comparison during `$gt, $lt, $gte, $lte`. Takes two arguments `{ a: this.key, b: $queryValue }`, 
the query value is of $gt/$lt/$gte/$lte. The Default takes only a `number|string`. If you supply an fn you must adhere to these rules. `this.key` is supplied by the inner workings of this library as the the tree is traversed. 
    * a < b - returns -1
    * a > b - returns 1
    * a === b - returns 0
    * else throws new Error();
* checkKeyEquality - Checks the equality of the key and the query from $ne. Default only uses `===` as a comparison and returns that boolean. The two arguments are `{a: this.key, b: $queryValue }`, the query value is the value of $ne. 
The default takes only `number|string|Date`. If you supply a fn you only need to return boolean of the comparison of the two with your own logic. 
* checkValueEquality - Checks the equality of the value just like the key equality, however it is only used in one spot currently in the avl.ts file. It does loop over the array. 

```typescript
import { AVLTree } from "binary-type-tree";

// This will create a tree with unique false, key/value null and default fns
let TestTree: AVLTree = new AVLTree({}); 

// I think this would be the best use of the tree.
let TestUTree: AVLTree = new AVLTree({unique: true});
```

## Inserting and deleting into the AVL Tree

Inserting and deleting is very easy and re-balances after during both and returns the re-balanced tree. 

```typescript
TestUTree.insert(123, ["abc"]); // this is a unique tree
TestUTree.insert(123, ["abc"]); // Throws error
TestUTree.insert(456, ["efg"]); // no error

TestUTree.delete(456, ["efg"]); // true.
// if there is not key that matches it will simply return the unchanged tree.

```

## Querying the AVL Tree

Query is very simple and easy to use and returns an array of the values found. There are also some other methods to query information from the tree.

```typescript
import * as BTT from "binary-type-tree";
// BTT.ASNDBS is a type which is almost any. Used for Keys 
// Array,string,number,Date,boolean,symbol,null
// the full type declaration is
//
// Array<any[]|string|number|Date|boolean|symbol|null>|string|number|Date|boolean|symbol|null 
//
// BTT.SNDBSA is a type which is almost any in array for Values
// full type
//
// Array<{}|any[]|string|number|Date|boolean|symbol|null>
//
let numEight: BTT.SNDBSA = avlTree.tree.search(8);
//
let avlTree: BTT.AVLTree = new BTT.AVLTree({unique: true}); 
// Lets avlTree tree has keys 0-100 with values 100-0
//
// I want all the keys greater than or equal 90
let nintyUp: BTT.SNDBSA = avlTree.tree.query({$gte: 90});
// nintyUp will have an array of values from [10..0] 
//
// If I want to get values greater then 50 but less than 60 but not 55
let fullQuery: BTT.SNDBSA = avlTree.tree.query({$gte: 50, $lte: 60, $ne: 55});
// fullQuery = [50,51,52,53,54,56,57,58,59,60]; 
//
// You could supply a new checkKeyEquality to check for arrays
// so you could possibly have 
let exampleQ: BTT.SNDBSA = avlTree.tree.query({$ne: [...90]});
//
//
//
// You could also find yourself needing more information
let max: BTT.ASNDBS = avlTree.tree.getMaxKey();
let min: BTT.ASNDBS = avlTree.tree.getMinKey();
let totalKeys: number = avlTree.tree.getNumberOfKeys();
let maxAVLNode: BTT.AVLNode = avlTree.tree.getMaxKeyDescendant();
let minAVLNode: BTT.AVLNode = avlTree.tree.getMinKeyDescendant();
//
//
// If you would like to check the AVLTree for validity
avlTree.tree.checkisAVLT(); // throw error if pointers fail, wrong ordering. and AVL height restrictions. or if not root node.
```

## Key update on AVL Tree

If you would like to update a key you can with this new method. With unique trees the
method will throw an error if the attempt to update a key to an existing key is
made. Updates do not upsert, the method will simply return a non modified tree if
the key to be update is not found. For non unique trees if the values are simply 
moved from one node to the node matching the `newKey` argument. If the `newKey` does 
not match anykeys on the tree then a new one is created and the old node is removed.
For unique keys this also happens when there is no match for the `newKey`. 

```typescript
const AVL = new AVLTree({});
const AVLU = new AVLTree({unique: true});

AVLU.insert(123, [45]);
AVLU.insert(13, [56]);
AVLU.updateKey(123, 133); // node 123 will be removed and 133 will be created
AVLU.updateKey(13, 133); // no change, newKey exists. Error is thrown. 

AVL.insert(1, [1]);
AVL.insert(1, [2]); // node with key 1 now has value [1,2];
AVL.insert(2, [3]);
AVL.updateKey(1, 2); // node with key 2 now has value [1,2,3];
```

## AVL tree extra functionality 
 
If you would like to write a custom function to execute on every AVLNode then you can use the `executeOnEveryNode` method, it takes a type of `any` but and returns. Best used by supplying a reference to a function.

```typescript
const keys: BTT.ASNDBS = [];
let executed: number = 0;
avlTree.tree.executeOnEveryNode((node) => {
    keys.push(node.key);
    executed += 1;
});
```

If you would like to create a AVLNode with similar options to another tree without a key or value there is a method to do so.

```typescript
const similarNode: BTT.AVLNode = avlTree.tree.createSimilar({});
```

There is also a method available to retrieve the node holding a key. 

```typescript
// returns null if node is not found.
const queryNode: BTT.AVLNode|null = avlTree.tree.getAVLNodeFromKey(123); 
```

## toJSON

toJSON has been added to convert a any tree into an array in JSON of objects holding the key and value of
every node. The order of the nodes in the array are sorted in a way that a re-balance will not occur if you
were to loop over the array and insert into any tree. 

```typescript
// for now there is only one tree type so AVLTree is used for the type.
const JSONTree = AVLTree.tree.toJSON<AVLTree>(); // retrieve tree as JSON
```

#### How it works

lets say given this btree
```
                    __________ 40 ___________
                   /                         \
             ____ 20 ____               ____ 60 ___
            /            \             /           \
           10           30           50           _70 _
         /    \       /    \       /    \        /     \
        5     15     25    35     45    55      65     75
       / \   /  \   / \    / \   /  \   /  \   /  \   /  \
      3  7  12  17 23  27 33 37 43  47 52  57 62  67 72  77
```
The master array would hold 
```typescript
const input = [ [40], [20,60], [10,30,50,70], [5,15,25,35,45,55,65,75],
  [3,7,12,17,23,27,33,37,43,47,52,57,62,67,72,77]];
//
// This would then be formatted into this
const result = [ [40], [60,20], [70,30,50,10], [75,35,55,15,65,25,45,5],
  [77,37,67,17,57,27,47,7,72,33,62,23,52,12,43,3]];
//
// This is done by breaking up each array as it comes in by their indices
// 
// Previous: [0,1], Current: [0,1,2,3]
// get evens/odds and sub Previous from Current, Current odds [3], Previous odds [1], Current evens [2], Prev Evens [0];
// creates
const row3 = [3,1,2,0]; // 70,30,50,10
// Now for the next level
//
// Previous: [3,1,2,0], Current: [0,1,2,3,4,5,6,7]
// same step
// Current odds: [7,5], Previous odds: [3,1], Current evens: [6,4], Previous evens: [2,0]
// creates
const row4 = [7,3,5,1,6,2,4,0]; // 75,35,55,15,65,25,45,5
```

All of these arrays are then put together into one array to reference the master array of objects to then create
a JSON array. Since this method only looks at the index of the arrays and not the contents of the keys or values
no comparisons are needed.
