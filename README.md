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

## Creating an AVL Tree
 
Before you create a tree you will want to consider how your keys and values will be structured. All values
are stored as an array even only one element. The key can be many different types but cannot be an `object`. 
There are three functions provided by default in `lib/bTreeUtils.ts`, that compare equality and validity 
that can be replaced by custom functions. These are very important when it comes to `$gt, $lt, $ne` comparisons
made for the `query` method. The implementation of the `query` is on the root Node<T> at `lib/basic-node/node.ts`. During the constructor you can choose to initialize your AVL tree with several starters or none.

* key - If you would like a key on the initial Node. Inserting a new key/value pair will balance.
* value - If you would like a value on the initial Node.
* unique - Set your keys to be unique or not
* compareKeys - A function to compare keys, mostly used in the comparison during `$gt, $lt, $gte, $lte`. Takes two arguments `{ a: this.key, b: $queryValue }`, 
the query value is of $gt/$lt/$gte/$lte. The Default takes only a `number|string`. If you supply an fn you must adhere to these rules.
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
TestUTree.insert(123,"abc"); // this is a unique tree
TestUTree.insert(123,"abc"); // Throws error
TestUTree.insert(456,"efg"); // no error

TestUTree.delete(456,"efg"); // true.
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
// I want all the values greater than or equal 90
let nintyUp: BTT.SNDBSA = avlTree.tree.query({$gte: 90});
// nintyUp will have an array of values [10..0] 
// If I want to get values greather then 50 but less than 60 but not 55
let fullQuery: BTT.SNDBSA = avlTree.tree.query({$gte: 50, $lte: 60, $ne: 55});
// fullQuery = [50,51,52,53,54,56,57,58,59,60]; 
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

# AVL tree extra functionality 
 
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
