export namespace Sets {
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