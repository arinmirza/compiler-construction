# Journal

## 2026-05-02
- Grammars are *term rewriting systems*.
  - The rules offer feasible rewriting steps.
  - A sequence of such rewriting steps $\alpha_a\to\ldots\to\alpha_m$ is a *derivation*.
  - The reflexive and transitive closure of the rewriting relation $\to$ is denoted as $\to^*$.
    - A context free grammar is specified by $G=(N, T, \to, S)$; non-terminals, terminals, productions (i.e. the set of rewrite rules), and the starting symbol. 
    - The language specified by G is $L(G) = \set{w \in T^* \mid S \to^* w}$
  - In each step of a derivation, we may choose 
    - a spot, determining *where* we will rewrite
    - a rule, determining *how* we will rewrite
  - The order, in which disjunct fragments are rewritten is not relevant.
- The leftmost and rightmost derivations are special.
  - These correspond to left-to-right preorder DFS traversal, or right-to-left, respectively.
  - A reverse rightmost derivation corresponds to a left-to-right postorder DFS traversal of the derivation tree.
    - [ ] How does a reverse derivation work?
  - Leftmost derivations correspond to a top-down reconstruction of the syntax tree.
  - Rightmost derivations correspond to a bottom-up reconstruction of the syntax tree.
- Uniqueness of context free grammars is undecidable.
- A nonterminal $A$ is called to be
  - productive, if $A\to^*w$ for some word $w \in T^*$
  - reachable, if $S\to^*\alpha A \beta$ for suitable $a, b \in (T \cup N)^*$.

## 2026-04-30
- [ ] Todo: Add handwritten notes from the exercise session here. 

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


