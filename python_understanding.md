Question
---
Explain the difference between `0 ** 0` and `{**{0: 0}}` in the Python language. Write some comments.

Answer
---
Though both expressions have `**` in common, the operators used among them are totally different.
 `**` in the first expression takes 2 operands, on the left and on the right. It is the mathematical exponential
 operator that can be denoted as `n ** k`, equivalent to $n^k$ in mathematics. The result will be the product of $n$
 multiplying itself $k$ times. Note that $n^1 = n$, $n^0 = 1$ for all real $n$ which $n \neq 0, and $n^k = 1/n^k$ for
 all real $n, k$ which $n \neq 0$ and $k \leq 0$. However, Python allows `0 ** 0` giving the result of `1` though it is
 mathematically indeterminate.

On the other hand, `**` in the second expression takes only one expression on the right. `**` extracts a dictionary or
similar ones containing map-based data, to an acceptable place. `{0: 0}` itself is a dictionary. Then we use `**` to
move out all the pairs within `{0: 0}` onto the outer container which is also a dictionary. So the expression
`{**{0: 0}}` gives `{0: 0}`.

Such the operator is also applicable to actual parameters as well, just like how `*` does. However, `*` is used with a
container with lone elements such as a list or a tuple. Important note to mention, if using `**` or `*` within places it
is not supposed to be, this will raise “invalid syntax” error. For example, extracting a dictionary onto a list like
`[**my _dict]`. However, extracting a list in between a pair of brackets gives a new set instead, not a dictionary.
For example, `{**[1, 2, 3]}` gives `{1, 2, 3}`.

