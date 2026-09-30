import Node from "./node.js";

const sortedUnique = (values) => [...new Set(values)].sort((a, b) => a - b);


const buildTree = (values) => {
  const sorted = sortedUnique(values);

  const build = (start, end) => {
    if (start > end) return null;

    const middle = Math.floor((start + end) / 2);
    const node = new Node(sorted[middle]);

    node.left = build(start, middle - 1);
    node.right = build(middle + 1, end);

    return node;
  };

  return build(0, sorted.length - 1);
};

export const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) return;

  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

const assertNumber = (value) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Value must be a finite number, got ${value}.`);
  }
};

const assertCallback = (callback) => {
  if (typeof callback !== "function") {
    throw new Error("A callback function is required.");
  }
};

class Tree {
  constructor(values) {
    if (!Array.isArray(values)) {
      throw new TypeError(
        `Tree expects an array of numbers, got ${typeof values}.`,
      );
    }

    values.forEach((value) => assertNumber(value));

    this.root = buildTree(values);
  }

  includes(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.data) return true;

      current = value < current.data ? current.left : current.right;
    }

    return false;
  }

  insert(value) {
    assertNumber(value);

    const node = new Node(value);

    if (this.root === null) {
      this.root = node;

      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.data) return;

      if (value < current.data) {
        if (current.left === null) {
          current.left = node;

          return;
        }

        current = current.left;
      } else {
        if (current.right === null) {
          current.right = node;

          return;
        }

        current = current.right;
      }
    }
  }
  deleteItem(value) {
    this.root = this.#remove(this.root, value);
  }

  levelOrderForEach(callback) {
    assertCallback(callback);

    const queue = this.root === null ? [] : [this.root];

    for (let index = 0; index < queue.length; index += 1) {
      callback(queue[index].data);

      if (queue[index].left !== null) queue.push(queue[index].left);
      if (queue[index].right !== null) queue.push(queue[index].right);
    }
  }

  inOrderForEach(callback) {
    assertCallback(callback);

    const visit = (node) => {
      if (node === null) return;

      visit(node.left);
      callback(node.data);
      visit(node.right);
    };

    visit(this.root);
  }

  preOrderForEach(callback) {
    assertCallback(callback);

    const visit = (node) => {
      if (node === null) return;

      callback(node.data);
      visit(node.left);
      visit(node.right);
    };

    visit(this.root);
  }

  postOrderForEach(callback) {
    assertCallback(callback);

    const visit = (node) => {
      if (node === null) return;

      visit(node.left);
      visit(node.right);
      callback(node.data);
    };

    visit(this.root);
  }

  height(value) {
    const node = this.#find(value);

    if (node === undefined) return undefined;

    return this.#heightOf(node);
  }

  depth(value) {
    let current = this.root;
    let edges = 0;

    while (current !== null) {
      if (value === current.data) return edges;

      current = value < current.data ? current.left : current.right;
      edges += 1;
    }

    return undefined;
  }

  isBalanced() {
    return this.#balancedHeight(this.root) !== null;
  }

  rebalance() {
    const values = [];

    this.inOrderForEach((value) => values.push(value));

    this.root = buildTree(values);
  }
  #remove(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.#remove(node.left, value);

      return node;
    }

    if (value > node.data) {
      node.right = this.#remove(node.right, value);

      return node;
    }

  
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

   
    const successor = this.#leftmost(node.right);

    node.data = successor.data;
    node.right = this.#remove(node.right, successor.data);

    return node;
  }

  #leftmost(node) {
    let current = node;

    while (current.left !== null) current = current.left;

    return current;
  }

  #find(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.data) return current;

      current = value < current.data ? current.left : current.right;
    }

    return undefined;
  }

  #heightOf(node) {
    if (node === null) return -1;

    return 1 + Math.max(this.#heightOf(node.left), this.#heightOf(node.right));
  }

  
  #balancedHeight(node) {
    if (node === null) return -1;

    const leftHeight = this.#balancedHeight(node.left);

    if (leftHeight === null) return null;

    const rightHeight = this.#balancedHeight(node.right);

    if (rightHeight === null) return null;

    if (Math.abs(leftHeight - rightHeight) > 1) return null;

    return 1 + Math.max(leftHeight, rightHeight);
  }
}

export default Tree;
