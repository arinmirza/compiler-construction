type EqualityFn<T> = (a: T) => boolean;
type Comparable<T> = { equals: EqualityFn<T> };

export class UniqueSet<T extends Comparable<T>> {
  elements: T[] = [];

  get(a: T) {
    return this.elements.find((e) => a.equals(e));
  }

  has(a: T) {
    return !!this.elements.find((e) => a.equals(e));
  }

  filter(predicate: (a: T) => boolean) {
    return this.elements.filter(predicate);
  }

  empty() {
    return this.elements.length == 0;
  }

  add(a: T) {
    const existing = this.elements.find((e) => a.equals(e));
    if (existing) {
      return existing;
    }
    this.elements.push(a);
    return a;
  }

  [Symbol.iterator](): Iterator<T> {
    let index = 0;
    return {
      next: (): IteratorResult<T> => {
        if (index < this.elements.length) {
          return { value: this.elements[index++], done: false };
        } else {
          return { value: undefined, done: true } as IteratorResult<T>;
        }
      },
    };
  }

  static from<T extends Comparable<T>>(array: T[]) {
    let set = new UniqueSet<T>();
    array.forEach((elem) => set.add(elem));
    return set;
  }

  static union<T extends Comparable<T>>(a: UniqueSet<T>, b: UniqueSet<T>) {
    let set = new UniqueSet<T>();
    a.elements.forEach((elem) => set.add(elem));
    b.elements.forEach((elem) => set.add(elem));
    return set;
  }

  static intersect<T extends Comparable<T>>(a: UniqueSet<T>, b: UniqueSet<T>) {
    let set = new UniqueSet<T>();
    for (const elem of a) {
      if (b.has(elem)) {
        set.add(elem);
      }
    }
    return set;
  }

  toString() {
    return `{${this.elements.map((e) => e.toString()).join(", ")}}`;
  }
}

export class UniqueMap<K extends Comparable<K>, V> {
  elements: { key: K; value: V }[] = [];

  get(key: K) {
    return this.elements.find((e) => e.key.equals(key))?.value;
  }

  set(key: K, value: V) {
    const elem = this.getOrSet(key, value);
    elem.value = value;
    return elem;
  }

  has(key: K) {
    return !!this.get(key);
  }

  getOrSet(key: K, value: V) {
    return (
      this.elements.find((e) => e.key.equals(key)) ??
      this.elements[this.elements.push({ key, value })]
    );
  }

  
}
