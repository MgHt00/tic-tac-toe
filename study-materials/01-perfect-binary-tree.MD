[G] A "perfect binary tree" is a specific type of binary tree that has two main characteristics:

1.  **Every internal (non-leaf) node has exactly two children.**
2.  **All leaf nodes are at the same depth (or level).**

Think of it like this:

* It's perfectly symmetrical and completely filled.
* Every level of the tree is completely filled with nodes.

**Visual Example:**

* **Height 0:**
    ```
    (Root)
    ```
    (1 node, which is also a leaf)

* **Height 1:**
    ```
        (Root)
       /    \
      O      O
    ```
    (1 root, 2 internal nodes, 2 leaves - wait, this isn't right. Height 1 means leaves are at depth 1. Corrected below.)

    ```
        (Root)
       /    \
      O      O  <-- These are leaves
    ```
    (Total nodes: 3. Leaf nodes: 2. Height: 1.)

* **Height 2:**
    ```
            (Root)
           /      \
          O        O   (Internal nodes)
         / \      / \
        O   O    O   O   (Leaves)
    ```
    (Total nodes: 7. Leaf nodes: 4. Height: 2.)

* **Height 3:**
    ```
                (Root)
               /      \
              O        O
             / \      / \
            O   O    O   O
           / \ / \  / \ / \
          O O O O O O O O    (Leaves)
    ```
    (Total nodes: 15. Leaf nodes: 8. Height: 3.)

**Key Properties of a Perfect Binary Tree:**

* **Number of Nodes:** If the height of a perfect binary tree is $h$ (where the root is at depth 0), then the total number of nodes is $2^{h+1} - 1$.
    * For height 0: $2^{0+1} - 1 = 2^1 - 1 = 1$ node.
    * For height 1: $2^{1+1} - 1 = 2^2 - 1 = 3$ nodes.
    * For height 2: $2^{2+1} - 1 = 2^3 - 1 = 7$ nodes.
    * For height 3: $2^{3+1} - 1 = 2^4 - 1 = 15$ nodes.

* **Number of Leaf Nodes:** The number of leaf nodes is $2^h$.
    * For height 0: $2^0 = 1$ leaf.
    * For height 1: $2^1 = 2$ leaves.
    * For height 2: $2^2 = 4$ leaves.
    * For height 3: $2^3 = 8$ leaves.

* **Efficiency:** Because of its balanced and full nature, perfect binary trees are often used when discussing theoretical properties of binary trees or when implementing structures like heaps based on arrays, as their structure maps very well to array indices.

**Distinction from Other Binary Tree Types (Briefly):**

* **Full Binary Tree:** Every internal node has exactly two children. (A perfect binary tree is always a full binary tree).
* **Complete Binary Tree:** All levels are completely filled except possibly the last level, which is filled from left to right. (A perfect binary tree is always a complete binary tree).
* **Balanced Binary Tree:** The height difference between the left and right subtrees of any node is never more than a certain value (often 1). (A perfect binary tree is inherently balanced).

In the GeeksforGeeks Minimax code, the use of `log2(n)` to determine the height and the `nodeIndex*2` and `nodeIndex*2 + 1` to find children implies that the `scores` array represents the leaves of a **perfect binary tree**. This simplifies the navigation and indexing of the game tree for the conceptual example.
