import Node from "./node.js";
import Tree, { prettyPrint } from "./tree.js";

const LESSON_VALUES = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const LESSON_SORTED = [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345];
const SEVEN = [1, 2, 3, 4, 5, 6, 7];

const valuesOf = (tree, traversal) => {
  const values = [];

  tree[traversal]((value) => values.push(value));

  return values;
};

const inOrderOf = (tree) => valuesOf(tree, "inOrderForEach");
const levelOrderOf = (tree) => valuesOf(tree, "levelOrderForEach");
const preOrderOf = (tree) => valuesOf(tree, "preOrderForEach");
const postOrderOf = (tree) => valuesOf(tree, "postOrderForEach");

const chainOf = (tree, values) => {
  values.forEach((value) => tree.insert(value));

  return tree;
};

describe("Tree", () => {
  describe("buildTree", () => {
    test("turns the lesson's array into the level-0 root node", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(tree.root).toBeInstanceOf(Node);
      expect(tree.root.data).toBe(8);
      expect(inOrderOf(tree)).toEqual(LESSON_SORTED);
    });

    test("sorts the values and drops the duplicates", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(inOrderOf(tree)).toHaveLength(11);
      expect(levelOrderOf(tree)).toHaveLength(11);
      expect(preOrderOf(tree)).toHaveLength(11);
      expect(postOrderOf(tree)).toHaveLength(11);
    });

    test("balances the tree by taking the middle of every slice", () => {
      const tree = new Tree([...Array(31).keys()]);

      expect(tree.root.data).toBe(15);
      expect(tree.isBalanced()).toBe(true);
      expect(tree.height(tree.root.data)).toBe(4);
    });

    test("keeps a single value as the root of its own tree", () => {
      const tree = new Tree([5]);

      expect(tree.root.data).toBe(5);
      expect(tree.root.left).toBeNull();
      expect(tree.root.right).toBeNull();
    });

    test("leaves an empty array with a null root", () => {
      const tree = new Tree([]);

      expect(tree.root).toBeNull();
      expect(inOrderOf(tree)).toEqual([]);
    });

    test("refuses anything that is not an array", () => {
      expect(() => new Tree()).toThrow(TypeError);
      expect(() => new Tree(5)).toThrow(TypeError);
      expect(() => new Tree("1, 2, 3")).toThrow(TypeError);
    });

    test("refuses values that are not finite numbers", () => {
      expect(() => new Tree([1, "2"])).toThrow(TypeError);
      expect(() => new Tree([1, NaN])).toThrow(TypeError);
      expect(() => new Tree([Infinity])).toThrow(TypeError);
    });

    test("ignores later mutations of the original input array", () => {
      const values = [3, 1, 2];
      const tree = new Tree(values);

      values.push(99);

      expect(tree.includes(99)).toBe(false);
      expect(inOrderOf(tree)).toEqual([1, 2, 3]);
    });
  });

  describe("includes", () => {
    test("finds every value that went into the tree", () => {
      const tree = new Tree(LESSON_VALUES);

      LESSON_SORTED.forEach((value) => {
        expect(tree.includes(value)).toBe(true);
      });
    });

    test("finds the deepest leaves as well as the root", () => {
      const tree = new Tree(LESSON_VALUES);

      [3, 7, 23, 6345].forEach((value) => {
        expect(tree.depth(value)).toBeGreaterThan(1);
        expect(tree.includes(value)).toBe(true);
      });
    });

    test("says false for values that are not stored", () => {
      const tree = new Tree(LESSON_VALUES);

      [0, -1, 2, 6346, 999].forEach((value) => {
        expect(tree.includes(value)).toBe(false);
      });
    });

    test("says false on an empty tree", () => {
      expect(new Tree([]).includes(1)).toBe(false);
    });
  });

  describe("insert", () => {
    test("sends lower values left and greater values right", () => {
      const tree = new Tree(SEVEN);

      tree.insert(8);

      expect(tree.includes(8)).toBe(true);
      expect(inOrderOf(tree)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(levelOrderOf(tree).at(-1)).toBe(8);
      expect(tree.depth(8)).toBe(3);
    });

    test("does nothing when the value already exists", () => {
      const tree = new Tree([1, 2, 3]);
      const before = preOrderOf(tree);

      tree.insert(2);
      tree.insert(2);

      expect(preOrderOf(tree)).toEqual(before);
      expect(inOrderOf(tree)).toEqual([1, 2, 3]);
      expect(levelOrderOf(tree)).toHaveLength(3);
    });

    test("takes over as the root of an empty tree", () => {
      const tree = new Tree([]);

      tree.insert(5);

      expect(tree.root.data).toBe(5);
      expect(tree.includes(5)).toBe(true);
      expect(inOrderOf(tree)).toEqual([5]);
    });

    test("keeps the binary search property over many inserts", () => {
      const tree = new Tree([]);
      const values = [50, 25, 75, 10, 40, 60, 90, 1, 99];

      chainOf(tree, values);

      expect(inOrderOf(tree)).toEqual([...values].sort((a, b) => a - b));
      expect(tree.root.data).toBe(50);
      expect(tree.root.left.data).toBe(25);
      expect(tree.root.right.data).toBe(75);
    });

    test("refuses values that are not finite numbers", () => {
      const tree = new Tree(SEVEN);

      expect(() => tree.insert("8")).toThrow(TypeError);
      expect(() => tree.insert(NaN)).toThrow(TypeError);
      expect(() => tree.insert(undefined)).toThrow(TypeError);
    });
  });

  describe("deleteItem", () => {
    test("removes a leaf and leaves the rest alone", () => {
      const tree = new Tree(SEVEN);

      tree.deleteItem(1);

      expect(tree.includes(1)).toBe(false);
      expect(inOrderOf(tree)).toEqual([2, 3, 4, 5, 6, 7]);
      expect(levelOrderOf(tree)).toEqual([4, 2, 6, 3, 5, 7]);
    });

    test("removes a node that only has one child", () => {
      const tree = new Tree([1, 2, 3, 4]);

      tree.deleteItem(3);

      expect(tree.includes(3)).toBe(false);
      expect(inOrderOf(tree)).toEqual([1, 2, 4]);
      expect(tree.depth(4)).toBe(1);
    });

    test("promotes the only child when the root has a single child", () => {
      const tree = new Tree([2, 3]);

      tree.deleteItem(2);

      expect(tree.root.data).toBe(3);
      expect(tree.root.right).toBeNull();
      expect(inOrderOf(tree)).toEqual([3]);
    });

    test("replaces a two-child node with its in-order successor", () => {
      const tree = new Tree(SEVEN);

      tree.deleteItem(4);

      expect(tree.root.data).toBe(5);
      expect(inOrderOf(tree)).toEqual([1, 2, 3, 5, 6, 7]);
      expect(preOrderOf(tree)).toEqual([5, 2, 1, 3, 6, 7]);
      expect(tree.height(5)).toBe(2);
    });

    test("removes the root of the lesson's tree and stays balanced", () => {
      const tree = new Tree(LESSON_VALUES);

      tree.deleteItem(8);

      expect(tree.root.data).toBe(9);
      expect(tree.includes(8)).toBe(false);
      expect(inOrderOf(tree)).toEqual([1, 3, 4, 5, 7, 9, 23, 67, 324, 6345]);
      expect(tree.isBalanced()).toBe(true);
    });

    test("removes a value that sits deep in the tree", () => {
      const tree = new Tree(LESSON_VALUES);

      tree.deleteItem(3);

      expect(tree.includes(3)).toBe(false);
      expect(inOrderOf(tree)).toEqual([1, 4, 5, 7, 8, 9, 23, 67, 324, 6345]);
    });

    test("does nothing when the value is missing", () => {
      const tree = new Tree(SEVEN);

      tree.deleteItem(0);
      tree.deleteItem(999);

      expect(inOrderOf(tree)).toEqual(SEVEN);
    });

    test("does nothing on an empty tree", () => {
      const tree = new Tree([]);

      expect(() => tree.deleteItem(1)).not.toThrow();
      expect(tree.root).toBeNull();
    });

    test("empties the tree when the last node is removed", () => {
      const tree = new Tree([7]);

      tree.deleteItem(7);

      expect(tree.root).toBeNull();
      expect(inOrderOf(tree)).toEqual([]);
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("traversals", () => {
    test("visits every value in breadth-first level order", () => {
      expect(levelOrderOf(new Tree(LESSON_VALUES))).toEqual([
        8, 4, 67, 1, 5, 9, 324, 3, 7, 23, 6345,
      ]);
      expect(levelOrderOf(new Tree(SEVEN))).toEqual([4, 2, 6, 1, 3, 5, 7]);
    });

    test("visits every value in pre order", () => {
      expect(preOrderOf(new Tree(LESSON_VALUES))).toEqual([
        8, 4, 1, 3, 5, 7, 67, 9, 23, 324, 6345,
      ]);
    });

    test("visits every value in post order", () => {
      expect(postOrderOf(new Tree(LESSON_VALUES))).toEqual([
        3, 1, 7, 5, 4, 23, 9, 6345, 324, 67, 8,
      ]);
    });

    test("visits every value in order, from lowest to highest", () => {
      expect(inOrderOf(new Tree(LESSON_VALUES))).toEqual(LESSON_SORTED);
      expect(inOrderOf(new Tree(SEVEN))).toEqual(SEVEN);
    });

    test("passes the values rather than the nodes", () => {
      const tree = new Tree(SEVEN);
      const seen = [];

      tree.preOrderForEach((value) => seen.push(value));

      seen.forEach((value) => {
        expect(typeof value).toBe("number");
        expect(value).not.toBeInstanceOf(Node);
      });
    });

    test("returns undefined, like Array.prototype.forEach", () => {
      const tree = new Tree(SEVEN);

      expect(tree.levelOrderForEach(() => {})).toBeUndefined();
      expect(tree.inOrderForEach(() => {})).toBeUndefined();
      expect(tree.preOrderForEach(() => {})).toBeUndefined();
      expect(tree.postOrderForEach(() => {})).toBeUndefined();
    });

    test("visits nothing on an empty tree", () => {
      const tree = new Tree([]);

      expect(levelOrderOf(tree)).toEqual([]);
      expect(inOrderOf(tree)).toEqual([]);
      expect(preOrderOf(tree)).toEqual([]);
      expect(postOrderOf(tree)).toEqual([]);
    });

    test("throws when it is called without a callback", () => {
      const tree = new Tree(SEVEN);
      const traversals = [
        "levelOrderForEach",
        "inOrderForEach",
        "preOrderForEach",
        "postOrderForEach",
      ];

      traversals.forEach((traversal) => {
        expect(() => tree[traversal]()).toThrow(Error);
        expect(() => tree[traversal]()).toThrow(/callback/i);
        expect(() => tree[traversal]("not a function")).toThrow(/callback/i);
      });
    });

    test("still asks for a callback on an empty tree", () => {
      expect(() => new Tree([]).levelOrderForEach()).toThrow(/callback/i);
    });
  });

  describe("height", () => {
    test("counts the edges from a node down to its deepest leaf", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(tree.height(8)).toBe(3);
      expect(tree.height(4)).toBe(2);
      expect(tree.height(1)).toBe(1);
      expect(tree.height(3)).toBe(0);
      expect(tree.height(5)).toBe(1);
      expect(tree.height(7)).toBe(0);
      expect(tree.height(67)).toBe(2);
      expect(tree.height(9)).toBe(1);
      expect(tree.height(23)).toBe(0);
      expect(tree.height(324)).toBe(1);
      expect(tree.height(6345)).toBe(0);
    });

    test("gives a leaf 0 and the root of a three level tree 2", () => {
      const tree = new Tree(SEVEN);

      expect(tree.height(1)).toBe(0);
      expect(tree.height(2)).toBe(1);
      expect(tree.height(4)).toBe(2);
    });

    test("grows by one for every level added to a chain", () => {
      const tree = chainOf(new Tree(SEVEN), [8, 9, 10]);

      expect(tree.height(10)).toBe(0);
      expect(tree.height(7)).toBe(3);
      expect(tree.height(6)).toBe(4);
    });

    test("returns undefined for a value that is not in the tree", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(tree.height(2)).toBeUndefined();
      expect(tree.height(999)).toBeUndefined();
    });

    test("returns undefined on an empty tree", () => {
      expect(new Tree([]).height(1)).toBeUndefined();
    });
  });

  describe("depth", () => {
    test("counts the edges from the root down to a node", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(tree.depth(8)).toBe(0);
      expect(tree.depth(4)).toBe(1);
      expect(tree.depth(67)).toBe(1);
      expect(tree.depth(1)).toBe(2);
      expect(tree.depth(5)).toBe(2);
      expect(tree.depth(9)).toBe(2);
      expect(tree.depth(324)).toBe(2);
      expect(tree.depth(3)).toBe(3);
      expect(tree.depth(7)).toBe(3);
      expect(tree.depth(23)).toBe(3);
      expect(tree.depth(6345)).toBe(3);
    });

    test("grows by one for every level down a chain", () => {
      const tree = chainOf(new Tree(SEVEN), [8, 9, 10]);

      expect(tree.depth(8)).toBe(3);
      expect(tree.depth(10)).toBe(5);
      expect(tree.height(10)).toBe(0);
    });

    test("returns undefined for a value that is not in the tree", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(tree.depth(2)).toBeUndefined();
      expect(tree.depth(999)).toBeUndefined();
      expect(new Tree([]).depth(1)).toBeUndefined();
    });
  });

  describe("isBalanced", () => {
    test("says true for the balanced trees that buildTree makes", () => {
      expect(new Tree(LESSON_VALUES).isBalanced()).toBe(true);
      expect(new Tree(SEVEN).isBalanced()).toBe(true);
      expect(new Tree([...Array(31).keys()]).isBalanced()).toBe(true);
    });

    test("says true for an empty tree and a single node", () => {
      expect(new Tree([]).isBalanced()).toBe(true);
      expect(new Tree([7]).isBalanced()).toBe(true);
    });

    test("says false once a chain of greater values is inserted", () => {
      const tree = chainOf(new Tree(SEVEN), [8, 9, 10, 11, 12]);

      expect(tree.isBalanced()).toBe(false);
    });

    test("says false once a chain of lower values is inserted", () => {
      const tree = chainOf(new Tree(SEVEN), [0, -1, -2, -3]);

      expect(tree.isBalanced()).toBe(false);
    });

    test("checks every node, not just the children of the root", () => {
      const tree = new Tree(SEVEN);

      // The root keeps a height difference of 1 ...
      tree.root.left = new Node(2);
      tree.root.left.left = new Node(1);
      tree.root.left.left.left = new Node(0);

      expect(tree.height(2)).toBe(2);
      expect(tree.height(6)).toBe(1);
      expect(Math.abs(tree.height(2) - tree.height(6))).toBe(1);

      // ... while the node holding 2 is out of balance by 2.
      expect(tree.isBalanced()).toBe(false);
    });

    test("says true again after rebalancing", () => {
      const tree = chainOf(new Tree(SEVEN), [8, 9, 10, 11, 12]);

      tree.rebalance();

      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("rebalance", () => {
    test("rebuilds an unbalanced tree into a balanced one", () => {
      const tree = chainOf(new Tree(SEVEN), [8, 9, 10, 11, 12]);

      expect(tree.isBalanced()).toBe(false);

      tree.rebalance();

      expect(tree.isBalanced()).toBe(true);
      expect(tree.root.data).toBe(6);
      expect(tree.height(6)).toBe(3);
      expect(levelOrderOf(tree)).toHaveLength(12);
    });

    test("keeps every value and nothing else", () => {
      const tree = chainOf(new Tree(SEVEN), [8, 9, 10, 11, 12]);

      tree.rebalance();

      expect(inOrderOf(tree)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(inOrderOf(tree)).toEqual(
        [...SEVEN, 8, 9, 10, 11, 12].sort((a, b) => a - b),
      );
    });

    test("sorts a left leaning chain back into place", () => {
      const tree = chainOf(new Tree(SEVEN), [0, -1, -2, -3]);

      tree.rebalance();

      expect(inOrderOf(tree)).toEqual([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
      expect(tree.isBalanced()).toBe(true);
    });

    test("leaves an already balanced tree balanced", () => {
      const tree = new Tree(LESSON_VALUES);

      expect(tree.rebalance()).toBeUndefined();
      expect(tree.isBalanced()).toBe(true);
      expect(inOrderOf(tree)).toEqual(LESSON_SORTED);
    });

    test("copes with an empty tree", () => {
      const tree = new Tree([]);

      tree.rebalance();

      expect(tree.root).toBeNull();
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("prettyPrint", () => {
    let logs;

    beforeEach(() => {
      logs = [];

      jest.spyOn(console, "log").mockImplementation((line) => {
        logs.push(line);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("prints the tree in a structured format", () => {
      prettyPrint(new Tree([2, 1, 3]).root);

      expect(logs).toEqual(["│   ┌── 3", "└── 2", "    └── 1"]);
    });

    test("prints a single node", () => {
      prettyPrint(new Tree([7]).root);

      expect(logs).toEqual(["└── 7"]);
    });

    test("prints nothing for an empty tree", () => {
      prettyPrint(new Tree([]).root);

      expect(logs).toEqual([]);
    });

    test("prints nothing when it is handed nothing", () => {
      prettyPrint(null);
      prettyPrint(undefined);

      expect(logs).toEqual([]);
    });
  });
});
