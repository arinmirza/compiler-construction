import { IndexCounter, epsilon, letter, concat, or, star } from "../src/regex.ts";

function testBasicExample() {
  let counter = new IndexCounter();
  let regex = concat(
    star(or(letter("a", counter.next()), letter("b", counter.next()))),
    concat(
      letter("a", counter.next()),
      or(letter("a", counter.next()), letter("b", counter.next())),
    ),
  );

  regex.computeSelf();
  regex.computeChild();
  console.log(regex);
}

testBasicExample();
