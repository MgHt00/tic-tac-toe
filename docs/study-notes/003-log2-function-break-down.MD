Ref: https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/

https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/

[G] You're very observant! Yes, the `log2` function provided in the code is indeed implemented recursively. It's a neat way to calculate logarithms in base 2 without using `Math.log2()` or `Math.log(n) / Math.log(2)`.

Let's break down its recursive logic:

```javascript
function log2(n)
{
return (n==1)? 0 : 1 + log2(n/2);
}
```

**1. Purpose of `log2(n)`:**

Mathematically, $\log_2(n)$ asks: "To what power must we raise 2 to get $n$?"
* $\log_2(8) = 3$ (because $2^3 = 8$)
* $\log_2(4) = 2$ (because $2^2 = 4$)
* $\log_2(2) = 1$ (because $2^1 = 2$)
* $\log_2(1) = 0$ (because $2^0 = 1$)

**2. The Base Case: `(n == 1) ? 0`**

* This is the stopping condition for the recursion.
* If `n` is `1`, the function immediately returns `0`.
* **Why?** Because $2^0 = 1$. So, the logarithm base 2 of 1 is 0. This is the simplest case that can be directly solved without further recursion.

**3. The Recursive Step: `1 + log2(n / 2)`**

* This part handles all `n` values greater than 1.
* It says: "The base-2 logarithm of `n` is equal to 1 plus the base-2 logarithm of `n` divided by 2."

* **Intuition:**
    * Every time you divide `n` by 2, you are effectively removing one factor of 2 from its prime factorization.
    * Each time you remove a factor of 2, you are reducing the power to which 2 was originally raised by one.
    * So, by adding `1` to the result of `log2(n/2)`, you are accounting for that "removed" factor of 2.

**Let's trace an example: `log2(8)`**

1.  **`log2(8)`:**
    * `n` is 8 (not 1).
    * It calls `1 + log2(8 / 2)`, which is `1 + log2(4)`.

2.  **`log2(4)`:**
    * `n` is 4 (not 1).
    * It calls `1 + log2(4 / 2)`, which is `1 + log2(2)`.

3.  **`log2(2)`:**
    * `n` is 2 (not 1).
    * It calls `1 + log2(2 / 2)`, which is `1 + log2(1)`.

4.  **`log2(1)`:**
    * `n` is 1.
    * **BASE CASE HIT!** It returns `0`.

**Now, the results propagate back up the call stack:**

* From step 3: `log2(2)` becomes `1 + 0` = `1`.
* From step 2: `log2(4)` becomes `1 + 1` = `2`.
* From step 1: `log2(8)` becomes `1 + 2` = `3`.

So, `log2(8)` correctly returns `3`.

This recursive function elegantly calculates the height of the perfect binary tree (given the number of leaf nodes) by repeatedly halving the number of leaf nodes until it reaches 1, adding 1 for each division.
