# Journal

## 2026-04-28
- In NFA to DFA transformation, epsilon transitions can be taken both before and after consuming a character. (from exercise session)
- The analyses `empty`, `first` and `last` can be computed via post-order DFS.
  - This corresponds to e.g. `first() { return child.first(); }`
  - If implemented like this, every call to `first()` will return a correct result, even if the tree structure has changed.
- The analysis `next` requires context, that is, we can only determine the value of the child by looking at its parent. It is also calculated via pre-order DFS, because the value of the parent must be known beforehand. 
  - Trying to implement this like `next(ctx) { ... }` turned out to be inconvenient, because the orientation of the parent (if the parent is a left or right child) needs to be known (and maintained if the stucture changes). This inconvenience still applies if `next()` receives a lambda.
  - The easiest implementation is imperative with side-effects.
  - Therefore I also decided to compute the remaining analyses with side-effects.
  - This requires computing `empty`, `first` and `last` first, and then computing `next`. If these two computation phases are not applied in the correct order, the result is unsound.


