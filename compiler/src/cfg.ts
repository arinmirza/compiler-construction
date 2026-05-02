/**
 * Context Free Grammars
 * 
 * The implementation is incorrect.
 * 
 */

import { Sets } from "./utils.ts";

export namespace CFG {
  //export type Terminal = { terminal: true, value: string };
  //export type NonTerminal = { terminal: false, value: string };
  export type Symbol = Terminal | NonTerminal;
  //export type Pattern = Symbol[];
  export type Ruleset = Map<Symbol, Pattern[]>;

  export class Terminal {
    readonly value: string;
    consumedBy = new UniqueSet<Pattern>(); 
    
    constructor(value: string) {
      this.value = value;
    }

    equals(o: Symbol) {
      return this.value == o.value;
    }
  }

  export class NonTerminal {
    readonly value: string;
    consumedBy = new UniqueSet<Pattern>(); 

    constructor(value: string) {
      this.value = value;
    }

    equals (o: Symbol) {
      return this.value === o.value;
    }
  }

  export class Pattern {
    readonly symbols: Symbol[] = [];
    consumes: UniqueSet<NonTerminal> = new UniqueSet();

    constructor(symbols: Symbol[]) {
      this.symbols = symbols;
      symbols.forEach(symbol => {
        symbol.consumedBy.add(this);
        if(symbol instanceof NonTerminal) {
          this.consumes.add(symbol);
        }
      }
      )
    }

    equals (o: Pattern) {
      return this.symbols.length == o.symbols.length && this.symbols.every((s, i) => s.equals(o.symbols[i]));
    }
  }

  type EqualityFn<T> = (a: T) => boolean;
  type Comparable<T> = { equals: EqualityFn<T> };

  export class UniqueSet<T extends Comparable<T>> {
    elements: T[] = [];

    get(a: T) {
      return this.elements.find(e => a.equals(e));
    }

    has(a: T) {
      return !!this.elements.find(e => a.equals(e));
    }

    filter(predicate: (a: T) => boolean) {
      return this.elements.filter(predicate);
    }

    empty() {
      return this.elements.length == 0;
    }

    add(a: T) {
      const existing = this.elements.find(e => a.equals(e));
      if (existing) {
        return existing;
      }
      this.elements.push(a);
      return a;
    }
    
  }

  export class Rule {
    readonly idx: number;
    readonly producer: NonTerminal;
    readonly pattern: Pattern;

    constructor(producer: NonTerminal, idx: number, pattern: Pattern) {
      this.idx = idx;
      this.producer = producer;
      this.pattern = pattern;
    }

    get consumes() {
      return this.pattern.consumes;
    }

    productive(grammar: CFG.Grammar) {
      return this.pattern.consumes.empty() ||
      this.pattern.consumes.elements.every(nonTerminal => grammar.getRulesFor(nonTerminal).some(rule => rule.productive));
    }


    equals(o: Rule) {
      return this.idx === o.idx && this.producer.equals(o.producer) && this.pattern.equals(o.pattern);
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

    getRulesFor(symbol: Symbol) {
      return this.rules.filter(rule => rule.producer.equals(symbol));
    }

    get terminals() {
      return this.symbols.filter(a => a instanceof CFG.Terminal);
    }

    get nonTerminals() {
      return this.symbols.filter(a => a instanceof CFG.NonTerminal);
    }

    addRule(symbol: string, patterns: string[]) {

      let _producer = this.symbols.add(new NonTerminal(symbol));

      
      
      for (const pattern of patterns) {
        const _idx = this.getRulesFor(_producer).length;
        const _pattern = new Pattern(
          [...pattern].map((c) => this.makeSymbol(c)),
        );
        const _rule = new Rule(_producer, _idx, _pattern);
        this.rules.add(_rule);

        
      }
    }

  }
}

let count;
let rhs;

function computeProductive(grammar: CFG.Grammar) {
  let result = new CFG.UniqueSet<CFG.NonTerminal>();
  let produces = new Map<CFG.NonTerminal, CFG.UniqueSet<CFG.Pattern>>();

  let analysis = {
    productive: new Set<CFG.Rule>
  }

}

function makeTerminal(value: string) {
  return { terminal: true, value };
}
function makeNonTerminal(value: string) {
  return { terminal: true, value };
}

let example = new CFG.Grammar();
example.addRule("S", ["aBB", "bD", "a"]);
example.addRule("A", ["Bc"]);
example.addRule("B", ["Sd", "C"]);
example.addRule("C", ["a"]);
example.addRule("D", ["BD"]);

//const result = computeProductive(example);

const x = example.getRulesFor(new CFG.NonTerminal("D"))[0];
console.log(x.productive(example))

console.log(example);
