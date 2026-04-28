import { IndexCounter, epsilon, letter, concat, or, star } from "../src/regex.ts";
import { serialize } from "../src/serialize.ts";

async function testBasicExample() {
  let counter = new IndexCounter();
  let regex = concat(
    star(or(letter("a", counter), letter("b", counter))),
    concat(
      letter("a", counter),
      or(letter("a", counter), letter("b", counter)),
    ),
  );

  regex.computeSelf();
  regex.computeChild();
  console.log(regex);

  const dot = serialize(regex, counter);
  console.log(dot);

  await Deno.writeTextFile('./out/basic-example.gv', dot);
}

testBasicExample();
