import { fileURLToPath } from "node:url";
import Tree, { prettyPrint } from "./modules/tree.js";

const randomValues = (count) =>
  Array.from({ length: count }, () => Math.floor(Math.random() * 100));

const valuesOf = (tree, traversal) => {
  const values = [];

  tree[traversal]((value) => values.push(value));

  return values;
};

const printAllOrders = (tree) => {
  console.log("level order:", valuesOf(tree, "levelOrderForEach").join(" "));
  console.log("pre order:  ", valuesOf(tree, "preOrderForEach").join(" "));
  console.log("post order: ", valuesOf(tree, "postOrderForEach").join(" "));
  console.log("in order:   ", valuesOf(tree, "inOrderForEach").join(" "));
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const values = randomValues(15);
  const tree = new Tree(values);

  console.log("random values:", values.join(" "));
  prettyPrint(tree.root);

  console.log("isBalanced():", tree.isBalanced());
  printAllOrders(tree);

  console.log("\nunbalancing the tree with values over 100");
  [101, 102, 103, 104, 105, 106].forEach((value) => tree.insert(value));

  prettyPrint(tree.root);
  console.log("isBalanced():", tree.isBalanced());

  console.log("\nrebalancing the tree");
  tree.rebalance();

  prettyPrint(tree.root);
  console.log("isBalanced():", tree.isBalanced());
  printAllOrders(tree);

  console.log("\nthe rest of the API");
  console.log("includes(101):", tree.includes(101));
  console.log("includes(999):", tree.includes(999));
  console.log("height(root):", tree.height(tree.root.data));
  console.log("depth(101):", tree.depth(101));

  tree.deleteItem(101);

  console.log("after deleteItem(101), includes(101):", tree.includes(101));
  console.log("in order:", valuesOf(tree, "inOrderForEach").join(" "));
}
