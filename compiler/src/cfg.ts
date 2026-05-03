/**
 * Context Free Grammars
 *
 */

import { UniqueSet } from "./unique-set.ts";

export namespace CFG {
  export type Symbol = Terminal | NonTerminal;

  export class Terminal {
    readonly value: string;

    constructor(value: string) {
      this.value = value;
    }

    equals(o: Symbol) {
      return this.value == o.value;
    }

    toString() {
      return this.value;
    }
  }

  export class NonTerminal {
    readonly value: string;

    constructor(value: string) {
      this.value = value;
    }

    equals(o: Symbol) {
      return this.value === o.value;
    }

    toString() {
      return this.value;
    }
  }

  export class Rule {
    readonly idx: number;
    readonly producer: NonTerminal;
    readonly pattern: Symbol[] = [];
    readonly uniqueNonTerminals: UniqueSet<NonTerminal>;

    constructor(producer: NonTerminal, idx: number, pattern: Symbol[]) {
      this.idx = idx;
      this.producer = producer;
      this.pattern = pattern;
      this.uniqueNonTerminals = UniqueSet.from(
        pattern.filter((s) => s instanceof NonTerminal),
      );
    }

    equals(o: Rule) {
      return (
        this.idx === o.idx &&
        this.producer.equals(o.producer) &&
        this.pattern.length == o.pattern.length &&
        this.pattern.every((s, i) => s.equals(o.pattern[i]))
      );
    }

    toString() {
      const pattern = this.pattern.map((s) => s.value).join("");
      return `[${this.producer.value} --> ${pattern}]`;
    }
  }

  export class Grammar {
    symbols: UniqueSet<Symbol> = new UniqueSet();
    rules: UniqueSet<Rule> = new UniqueSet();

    private makeSymbol(symbol: string) {
      return symbol === symbol.toUpperCase()
        ? new NonTerminal(symbol)
        : new Terminal(symbol);
    }

    private addSymbol(symbol: Symbol) {
      return this.symbols.add(symbol);
    }

    getRulesFor(symbol: Symbol) {
      return this.rules.filter((rule) => rule.producer.equals(symbol));
    }

    get terminals(): Terminal[] {
      return this.symbols.filter((a) => a instanceof CFG.Terminal);
    }

    get nonTerminals(): NonTerminal[] {
      return this.symbols.filter((a) => a instanceof CFG.NonTerminal);
    }

    addRules(symbol: string, patterns: string[]) {
      let _producer = this.symbols.add(new NonTerminal(symbol));

      for (const pattern of patterns) {
        const _idx = this.getRulesFor(_producer).length;
        const _pattern = [...pattern].map((c) =>
          this.addSymbol(this.makeSymbol(c)),
        );
        const _rule = new Rule(_producer, _idx, _pattern);
        this.rules.add(_rule);
      }
    }
  }
}

function computeProductive(grammar: CFG.Grammar) {
  // Set of productive non-terminals
  let result = new UniqueSet<CFG.NonTerminal>();
  // Maps a nonterminal to rules using it
  let usersOf = new Map<CFG.NonTerminal, UniqueSet<CFG.Rule>>();
  // Maps a rule to number of unique non-terminals that needs to be productive
  let count = new Map<CFG.Rule, number>();

  // initialize
  for (const nonTerminal of grammar.nonTerminals) {
    usersOf.set(nonTerminal, new UniqueSet<CFG.Rule>());
  }
  for (const rule of grammar.rules) {
    count.set(rule, 0);
    for (const nonTerminal of rule.uniqueNonTerminals) {
      count.set(rule, count.get(rule)! + 1);
      usersOf.get(nonTerminal)!.add(rule);
    }
  }

  let workset = grammar.rules.filter((rule) => count.get(rule) == 0);

  while (workset.length) {
    console.debug(
      `Workset is: {${workset.map((e) => e.toString()).join(", ")}}`,
    );
    const rule = workset.pop()!;

    if (!result.has(rule.producer)) {
      console.debug(rule.toString(), " was not in the result, so adding it.");
      result.add(rule.producer);

      const users = usersOf.get(rule.producer)?.elements ?? [];
      for (const user of users) {
        const value = count.get(user)! - 1;
        count.set(user, value);
        console.debug(
          `Decreasing count of ${user.toString()} because it uses ${rule.producer.value}`,
        );
        if (value == 0) {
          workset.push(user);
          console.debug(
            `Value of ${user.producer.value} became 0 so adding it to workset.`,
          );
        }
      }
    }
  }

  return { result, usersOf, count };
}

function computeReachable(grammar: CFG.Grammar) {
  let depends = new Map<CFG.NonTerminal, UniqueSet<CFG.NonTerminal>>();
  let reaches = new Map<CFG.NonTerminal, UniqueSet<CFG.NonTerminal>>();

  for (const rule of grammar.rules) {
    for (const nonTerminal of rule.uniqueNonTerminals) {
      if (!depends.get(nonTerminal)) {
        depends.set(nonTerminal, new UniqueSet());
      }
      if (!reaches.get(rule.producer)) {
        reaches.set(rule.producer, new UniqueSet());
      }
      depends.get(nonTerminal)!.add(rule.producer);
      reaches.get(rule.producer)!.add(nonTerminal);
    }
  }

  let reachable = new UniqueSet<CFG.NonTerminal>();
  const start = grammar.nonTerminals.find((s) => s.value === "S")!;
  dfs(start);

  function dfs(node: CFG.NonTerminal) {
    reachable.add(node);
    const children = reaches.get(node) ?? [];
    for (const child of children) {
      if (reachable.has(child)) {
        continue;
      }
      dfs(child);
    }
  }

  return reachable;
}

let example = new CFG.Grammar();
example.addRules("S", ["aBB", "bD"]);
example.addRules("A", ["Bc"]);
example.addRules("B", ["Sd", "C"]);
example.addRules("C", ["a"]);
example.addRules("D", ["BD"]);

const productive = computeProductive(example).result;
const reachable = computeReachable(example);
const productiveAndReachable = UniqueSet.intersect(productive, reachable);
console.log("Productive non-terminals:", productive);
console.log("Reachable non-terminals:", reachable);
console.log("Produtive and reachable non-terminals:", productiveAndReachable);
