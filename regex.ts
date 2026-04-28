type RegexTree = Epsilon | Letter | Concat | Or | Star;

namespace Sets {
  export function empty<T>() {
    return new Set<T>();
  }
  export function make<T>(a: T) {
    return new Set([a]);
  }
  export function copy<T>(a: Set<T>) {
    return new Set([...a]);
  }
  export function union<T>(a: Set<T>, b: Set<T>) {
    return new Set([...a, ...b]);
  }
}

class Counter {
  private i: number = 0;
  next() { return this.i++; }
}


class Epsilon {
  empty: boolean = true;
  first: Set<number> = Sets.empty();
  next: Set<number> = Sets.empty();
  last: Set<number> = Sets.empty();
  computeSelf(): void { }
  computeChild(): void { }
}

class Letter {
  id: number;
  letter: string;

  empty: boolean = false;
  first: Set<number> = Sets.empty();
  next: Set<number> = Sets.empty();
  last: Set<number> = Sets.empty();

  constructor(letter: string, id: number) {
    this.id = id;
    this.letter = letter;
  }

  computeSelf(): void {
    this.empty = false;
    this.first = Sets.make(this.id);
    this.last = Sets.make(this.id);
  }
  
  computeChild(): void { }
}

class Concat {
  left: RegexTree;
  right: RegexTree;

  empty: boolean = false;
  first: Set<number> = Sets.empty();
  next: Set<number> = Sets.empty();
  last: Set<number> = Sets.empty();
  
  constructor(left: RegexTree, right: RegexTree) {
    this.left = left;
    this.right = right;
  }

  computeSelf(): void {
    this.left.computeSelf();
    this.right.computeSelf();

    this.empty = this.left.empty && this.right.empty;
    this.first = this.left.empty
      ? Sets.union(this.left.first, this.right.first)
      : Sets.copy(this.left.first);
    this.last = this.right.empty
      ? Sets.union(this.right.last, this.left.last)
      : Sets.copy(this.right.last);
  }

    computeChild(): void {
      if (this.right.empty) {
        this.left.next = Sets.union(this.right.first, this.next);
      } else {
        this.left.next = Sets.copy(this.right.first);
      }
      this.right.next = Sets.copy(this.next);
      
      this.left.computeChild();
      this.right.computeChild();
  }
}

class Or {
  left: RegexTree;
  right: RegexTree;

  empty: boolean = false;
  first: Set<number> = Sets.empty();
  next: Set<number> = Sets.empty();
  last: Set<number> = Sets.empty();

  constructor(left: RegexTree, right: RegexTree) {
    this.left = left;
    this.right = right;
  }

  computeSelf(): void {
    this.left.computeSelf();
    this.right.computeSelf();

    this.empty = this.left.empty || this.right.empty;
    this.first = Sets.union(this.left.first, this.right.first);
    this.last = Sets.union(this.left.last, this.right.last);
  }

  computeChild(): void {
    this.left.next = Sets.copy(this.next);
    this.right.next = Sets.copy(this.next);
    this.left.computeChild();
    this.right.computeChild();
  }
}
class Star {
  child: RegexTree;

  empty: boolean = true;
  first: Set<number> = Sets.empty();
  next: Set<number> = Sets.empty();
  last: Set<number> = Sets.empty();

  constructor(child: RegexTree) {
    this.child = child;
  }

  computeSelf(): void {
    this.child.computeSelf();
    this.empty = true;
    this.first = Sets.copy(this.child.first);
    this.last = Sets.copy(this.child.last);
  }

  computeChild(): void {
    this.child.next = Sets.union(this.next, this.child.first);
    this.child.computeChild();
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

regex.computeSelf();
regex.computeChild();
console.log(regex);