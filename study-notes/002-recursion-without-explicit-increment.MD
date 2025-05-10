Ref: https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/

[G] You've hit upon a very important distinction about how recursion works! You are absolutely right that there isn't a line like `nodeIndex++` inside the `minimax` function.

The `nodeIndex` doesn't get incremented in a loop. Instead, its value for the *next* level of recursion is **calculated** and passed as a new argument in the recursive call.

Let's re-examine how `nodeIndex` values are generated and passed down through the recursion for a perfect binary tree:

When you call `minimax`, it makes two *new* recursive calls for its children. These calls are distinct, and each receives its own calculated `nodeIndex`:

* **`nodeIndex * 2`**: This calculates the `nodeIndex` for the **left child** in the next level of the tree.
* **`nodeIndex * 2 + 1`**: This calculates the `nodeIndex` for the **right child** in the next level of the tree.

Let's trace the values of `nodeIndex` as the recursion unfolds:

**1. Initial Call (Depth 0):**
* `minimax(0, 0, true, scores, h)`
    * Here, `depth = 0`, `nodeIndex = 0`.

**2. First Level of Recursion (Depth 1):**
The call `minimax(0, 0, true, ...)` then calls:
* `minimax(1, 0 * 2, false, ...)` which becomes `minimax(1, 0, false, ...)`
    * This is the **left child** of the root.
* `minimax(1, 0 * 2 + 1, false, ...)` which becomes `minimax(1, 1, false, ...)`
    * This is the **right child** of the root.

Notice that at `depth = 1`, we now have two different recursive calls, one with `nodeIndex = 0` and one with `nodeIndex = 1`.

**3. Second Level of Recursion (Depth 2):**

Now, each of those calls at `depth = 1` will make two more calls:

* **From `minimax(1, 0, false, ...)`:**
    * `minimax(2, 0 * 2, true, ...)` which becomes `minimax(2, 0, true, ...)`
    * `minimax(2, 0 * 2 + 1, true, ...)` which becomes `minimax(2, 1, true, ...)`

* **From `minimax(1, 1, false, ...)`:**
    * `minimax(2, 1 * 2, true, ...)` which becomes `minimax(2, 2, true, ...)`
    * `minimax(2, 1 * 2 + 1, true, ...)` which becomes `minimax(2, 3, true, ...)`

So, while there's no single `nodeIndex++` line, when we reach `depth = 2`, the `nodeIndex` argument that gets passed around in different concurrent branches of the recursion will indeed be `0, 1, 2,` and `3`. Each of these represents a unique node at that specific level in the conceptual tree.

It's the nature of the recursive calls, where new arguments are calculated and passed, that causes the `nodeIndex` to take on these different values as the algorithm explores different paths down the tree.
