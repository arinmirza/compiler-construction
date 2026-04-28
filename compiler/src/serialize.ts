import { IndexCounter, Letter, RegexTree } from "./regex.ts";
import { Sets } from "./utils.ts";

type Edge = { source: number; target: number; label: string };

export function serialize(root: RegexTree, counter: IndexCounter) {
  const edges: Edge[] = serializeRoot(root, counter);

  const finalStates = root.empty
    ? Sets.union(root.last, Sets.make(0))
    : Sets.copy(root.last);

  const dot = `digraph nfa {
rankdir=LR;
size="8,5"
node [shape=none,width=0,height=0,margin=0]; start [label=""];
node [shape=doublecircle];
${Array.from(finalStates).join(";")};
node [shape=circle];
${Array.from(edges)
  .map((edge) => `${edge.source} -> ${edge.target} [label="${edge.label}"];`)
  .join("\n")}
start -> 0;
}`;

  return dot;
}

function serializeRoot(root: RegexTree, counter: IndexCounter) {
  let edges: Edge[] = [];

  for (const targetId of root.first) {
    const label = counter.get(targetId)?.letter ?? "";
    edges.push({ source: 0, label, target: targetId });
  }

  for (const child of root.children()) {
    edges = edges.concat(serializeRec(child, counter));
  }

  return edges;
}

function serializeRec(node: RegexTree, counter: IndexCounter) {
  let edges: Edge[] = [];

  if (node instanceof Letter) {
    for (const targetId of node.next) {
      console.log(node.next);
      const label = counter.get(targetId)?.letter ?? "";
      edges.push({ source: node.id, label, target: targetId });
    }
  } else {
    for (const child of node.children()) {
      edges = edges.concat(serializeRec(child, counter));
    }
  }
  return edges;
}
