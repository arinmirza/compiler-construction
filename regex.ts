// type Epsilon = { type: 'epsilon' }
// type Letter = { type: 'letter'; id: number; char: string; };
// type Concat = { type: 'concat'; left: RegexTree; right: RegexTree };
// type Or = { type: 'or'; left: RegexTree; right: RegexTree };
// type Star = { type: 'star'; child: RegexTree };
type RegexTree = Epsilon | Letter | Concat | Or | Star;

namespace Sets {
  
}

class Counter {
  private i: number = 0;
  next() { return this.i++; }
}


class Epsilon {
  _next: Set<number>;
  empty(): boolean { return true; }
  first(): Set<number> { return new Set(); }
  last():  Set<number> { return new Set(); }
  next(): Set<number> { return this._next; }
  computeNext(): void {}
  constructor() {
    this._next = new Set();
  }
}

class Letter {
  id: number;
  letter: string;
  _next: Set<number>;
  constructor(letter: string, id: number) {
    this.id = id;
    this.letter = letter;
    this._next = new Set();
  }
  empty(): boolean { return false; }
  first(): Set<number> { return new Set([this.id]); }
  last():  Set<number> { return new Set([this.id]); }
  next(): Set<number> { return this._next; }
  computeNext(): void {}
}

class Concat {
  left: RegexTree;
  right: RegexTree;
  _next: Set<number>;
  constructor(left: RegexTree, right: RegexTree) {
    this.left = left;
    this.right = right;
    this._next = new Set();
  }
  empty(): boolean { return this.left.empty() && this.right.empty(); }
  first(): Set<number> {
    return this.left.empty()
      ? new Set([...this.left.first(), ...this.right.first()])
      : new Set([...this.left.first()]);
  }
  last():  Set<number> { 
    return this.right.empty()
      ? new Set([...this.right.last(), ...this.left.last()])
      : new Set([...this.right.last()]);
  }
  next(): Set<number> { return this._next; }
  computeNext(): void {
    if (this.right.empty()) {
      this.left._next = new Set([...this.right.first(), ...this._next])
    } else {
      this.left._next = new Set([...this.right.first()]);
    }
    this.right._next = new Set([...this._next]);
    this.left.computeNext();
    this.right.computeNext();
  }
}

class Or {
  left: RegexTree;
  right: RegexTree;
  _next: Set<number>;
  constructor(left: RegexTree, right: RegexTree) {
    this.left = left;
    this.right = right;
    this._next = new Set();

  }
  empty(): boolean { return this.left.empty() || this.right.empty(); }
  first(): Set<number> {
    return new Set([...this.left.first(), ...this.right.first()]);
  }
  last(): Set<number> {
    return new Set([...this.left.last(), ...this.right.last()]);
  }
  next(): Set<number> { return this._next; }
  computeNext(): void {
    this.right._next = new Set([...this._next]);
    this.left._next = new Set([...this._next]);
    this.left.computeNext();
    this.right.computeNext();
  }
}
class Star {
  child: RegexTree;
  _next: Set<number>;
  constructor(child: RegexTree) {
    this.child = child;
    this._next = new Set();
  }
  empty(): boolean { return true; }
  first(): Set<number> {
    return new Set([...this.child.first()]);
  }
  last(): Set<number> {
    return new Set([...this.child.last()]);
  }
  next(): Set<number> { return this._next; }
  computeNext(): void {
    this.child._next = new Set([...this._next, ...this.child.first()]);
    this.child.computeNext();
  }
}

function epsilon() { 
  return new Epsilon();
}
function letter(l: string, id: number) {
  return new Letter(l, id); 
}
function star(child: RegexTree) { 
  return new Star(child); 
}
function concat(left: RegexTree, right: RegexTree) { 
  return new Concat(left, right);
}
function or(left: RegexTree, right: RegexTree) { 
  return new Or(left, right);
}

function serialize(tree: RegexTree) {

}

let counter = new Counter();
let regex = 
  concat(
    star(
      or(
        letter("a", counter.next()), 
        letter("b", counter.next())
      )
    ),
    concat(
      letter("a", counter.next()), 
        or(
          letter("a", counter.next()), 
          letter("b", counter.next())
        )
    )
  )

regex.computeNext();
console.log(regex);