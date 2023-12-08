import { Decoder } from "../tools/Decoder.ts";

let test = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

let test2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

//console.log(day8A(test));
//console.log(day8B(test2));

main();

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day8.txt")
    .then((inp) => day8A(inp))
    .then((res) => console.log("Day 8A:", res));

  decoder.decode("res/day8.txt")
    .then((inp) => day8B(inp))
    .then((res) => console.log("Day 8B:", res));
}

//Just use a K,V map: key is string ,v = {left: right: }
type Node = {
  left: string;
  right: string;
};

function day8B(input: string): number {
  const parsed = parseFull(input);
  const map = parsed.nodes.map;
  const commands = parsed.commands;

  let startRoots = Object
    .entries(map)
    .filter(([key]) => key.endsWith("A"))
    .map(([key]) => key);

  console.log(startRoots);

  const loops = startRoots.map((node) => {
    let index = 0;
    let counter = 0;

    let currentNode = node;
    while (!currentNode.endsWith("Z")) {
      const command = commands[index];
      if (command === "R") {
        currentNode = map[currentNode].right;
      } else {
        currentNode = map[currentNode].left;
      }
      counter++;
      index = (index + 1) % parsed.commands.length;
    }
    return counter;
  });

  console.log(loops);
  const first = loops.pop()!;
  const res = loops.reduce(
    (prev, curr) => prev * (curr / ggd(prev, curr)),
    first,
  );
  return res;
}

function ggd(l: number, r: number): number {
  if (l == 0) {
    return r;
  }
  return ggd(r % l, l);
}

function day8A(input: string): number {
  const toUse = parseFull(input);
  console.log(toUse);

  let currentNode = "AAA"; //Made a mistake. The first item isnt the root. Oh well.
  const nodeMap = toUse.nodes.map;
  let index = 0;
  let counter = 0;
  while (currentNode != "ZZZ") {
    let nextNode: string;
    const currentVal = nodeMap[currentNode];
    const command = toUse.commands[index];
    if (command === "R") {
      nextNode = currentVal.right;
    } else {
      nextNode = currentVal.left;
    }

    console.log(
      `At node ${currentNode} - going ${command} towards ${nextNode} `,
    );
    currentNode = nextNode;

    if (currentNode === "ZZZ") {
      return counter + 1;
    }
    counter++;
    index = (index + 1) % toUse.commands.length;
  }

  return index;
}

function parseFull(
  input: string,
): { commands: string; nodes: { map: { [key: string]: Node }; root: string } } {
  const splitted = input.split("\n\n");

  return {
    commands: splitted[0].trim(),
    nodes: parseDay8A(splitted[1].split("\n")),
  };
}

function parseDay8A(
  input: string[],
): { map: { [key: string]: Node }; root: string } {
  const map: { [key: string]: Node } = {};
  let firstNode: string | null = null;
  for (const line of input) {
    const splitted = line.split("=");
    const key = splitted[0].trim();
    const [left, right] = splitted[1].replaceAll("(", "").replaceAll(")", "")
      .split(",");
    map[key] = { left: left.trim(), right: right.trim() };
    if (firstNode === null) {
      firstNode = key;
    }
  }
  return { root: firstNode!, map: map }; //We assume we got a first node
}
