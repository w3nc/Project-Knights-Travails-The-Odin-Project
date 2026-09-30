# Project-Binary-Search-Trees-The-Odin-Project

Balanced binary search tree project for The Odin Project: a Tree class that sorts
an array, drops the duplicates and balances it into a tree of Node objects, plus
the insert, delete, traversal, height, depth, balance and rebalance methods on
top of it.

## Modules

The source files use ES module syntax (`import` / `export default`).

## Scripts

`npm test`

`npm run test:watch`

`npm run lint`

`npm run lint:fix`

`npm run format`

`npm run format:check`

`npm run demo`

## API

`Node`

Holds the `data` it stores as well as the `left` and `right` children.

`Tree`

Starts from an array of numbers; `buildTree(array)` sorts it, removes the
duplicates and returns the level-0 root node, so `new Tree([1, 7, 4, 23])` is
already balanced.

`root` = the level-0 node, null when the array is empty.

`includes(value)` = true when the value is in the tree, false otherwise.

`insert(value)` = adds a node while preserving the binary search property: lower values to the left, greater values to the right, and nothing at all when the value already exists.

`deleteItem(value)` = removes the node, handling the leaf, one-child and two-child cases, and does nothing when the value is missing.

`levelOrderForEach(callback)` = visits every value in breadth-first level order.

`inOrderForEach(callback)` = visits every value from lowest to highest.

`preOrderForEach(callback)` = visits every value root first.

`postOrderForEach(callback)` = visits every value leaves first.

`height(value)` = number of edges in the longest path from that node down to a leaf, undefined when the value is missing.

`depth(value)` = number of edges in the path from that node up to the root, undefined when the value is missing.

`isBalanced()` = true when the left and right subtrees of every single node differ in height by no more than 1.

`rebalance()` = feeds an in-order traversal back into `buildTree`, so an unbalanced tree becomes balanced again.

Every traversal throws an Error when it is called without a callback.

`buildTree(array)` stays private to the module and runs once for `root`.

`prettyPrint(node)` is a named export that `console.log`s a tree in a structured format.
