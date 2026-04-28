import { Sets } from "./utils.ts";
 
export type RegexTree = Epsilon | Letter | Concat | Or | Star;

export class IndexCounter {
  private i: number = 0;
  next() {
    return this.i++;
  }
}

export class Epsilon {
  empty: boolean = true;
  first: Set<number> = Sets.empty();
  next: Set<number> = Sets.empty();
  last: Set<number> = Sets.empty();
  computeSelf(): void {}
  computeChild(): void {}
}

export class Letter {
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

  computeChild(): void {}
}

export class Concat {
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
    this.left.next = this.right.empty
      ? Sets.union(this.right.first, this.next)
      : this.left.next = Sets.copy(this.right.first);
    this.right.next = Sets.copy(this.next);

    this.left.computeChild();
    this.right.computeChild();
  }
}

export class Or {
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

export class Star {
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

export function epsilon() {
  return new Epsilon();
}

export function letter(letter: string, id: number) {
  return new Letter(letter, id);
}

export function star(child: RegexTree) {
  return new Star(child);
}

export function concat(left: RegexTree, right: RegexTree) {
  return new Concat(left, right);
}

export function or(left: RegexTree, right: RegexTree) {
  return new Or(left, right);
}
