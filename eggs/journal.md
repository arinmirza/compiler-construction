# Journal

## 2026-05-04
### Attribute Grammars
- I realized that implementing the analyses for a regex was substantially more convenient in egglog in comparison to implementing them in Typescript. 
  - In Typescript (or in any imperative language), I have to focus on the order of the computation, initialization, and propagation.
  - In egglog however, I simply declared some algebraic types, and *declared* how the values are supposed to be determined, very close to their mathematical definitions. It is like saying *"This is how these things stand in relation to each other; now compute it"*.
  - The curious part is, I did not use any rewrites or equality-classes at all, which is supposed to be the core feature of egglog.
  - It turns out that the thing I am actually interested in is called **[attribute grammars](1)**, which supplement a formal grammar with semantic information.
    - Attributes computed the values of attributes of their children are called *synthesized attributes*. This corresponds to a bottom-up propagation.

[1]: https://en.wikipedia.org/wiki/Attribute_grammar

### Exact Analyses with Case Distinctions
- To keep an analysis as an exact approximation (i.e. `:no-merge`) in contrast to a monotone under/over-approximation (lattice/merge analysis) the analysis value of a term must be determined by a single rule application.
  - Multiple rules might exist for determining its value, but exactly one (or none) of them must set the analysis value.
  - I ran into this problem with the "empty, first, last, next" analyses for regexes. Specifically, with the concatenation operator.
  - The `first` analysis of a concatenation operator is determined by the following case distinction:
    $$
      \text{first}[r_1 \cdot r_2] = 
        \begin{cases}
          \text{first}[r_1] 
            &\text{if }\text{empty}[r_1] = t \\
          \text{first}[r_1] \cup \text{first}[r_2] 
            &\text{if }\text{empty}[r_1] = f
        \end{cases}
    $$
  - The cases are *exclusive*, that is, exactly one of them can and must hold.
  - If our `empty` analysis in egglog is defined as a `relation`, its value might be a unit or undefined. If its value exists, then we know the empty analysis for a given node is `true`. If its value is undefined, then it might be the case that (1) the `empty` analysis is false, or (2) the `empty` analysis is not computed yet.
  - Assume the following signatures for the analyses.
    ```
    (relation empty (RegexTree))
    (function first (RegexTree) IntegerSet :no-merge)
    ```
  - With `empty` defined as a relation, we cannot represent the case distinction above in egglog using multiple rules which are applicable mutually exclusively.
    ```
    (rule 
      (
        (= regex (Concat r1 r2))
        (= value (first r1))
      )
      ((set (first regex) value))
    )

    (rule 
      (
        (= regex (Concat r1 r2))
        (empty r1)
        (= value (set-union (first r1) (first r2)))
      )
      ((set (first regex) value))
    )
    ```
  - For the two rules above, it might be the case that only the first one is applicable, or both of them are applicable. In the latter case, since we cannot guarantee that the second rule will fire first, the `first` analysis is forced to become a monotone underapproximation and declared with `:merge (set-union old new)`. 
  - Consequently, any rule that depends on the correctness of the value of the `first`'s value will be unsound if it fires before the `first` analysis has reached its true value.
  - In order to keep the analysis exact, we need to make the rules mutually exclusive in their applicability. So, we use proper boolean types for `empty` analysis.
    ```
    (datatype Bool (True) (False))
    (function empty (RegexTree) Bool :no-merge)
    (function first (RegexTree) IntSet :no-merge)
    ```
  - Now we can write the rules for `first` in a way such that exactly one of them will be applicable in any given scenario.
    ```
    (rule 
      (
        (= regex (Concat r1 r2))
        (= (False) (empty r1))
        (= value (first r1))
      )
      (
        (set (first regex) value)
      )
    )

    (rule 
      (
        (= regex (Concat r1 r2))
        (= (True) (empty r1))
        (= value (set-union (first r1) (first r2)))
      )
      (
        (set (first regex) value)
      )
    )
    ```