import { Decoder } from "../tools/Decoder.ts";

const test = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

console.log(day9A(parse(test)));
console.log(day9A(parse(test).map((inp) => inp.toReversed())));
main();

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day9.txt")
    .then((inp) => parse(inp))
    .then((inp) => day9A(inp))
    .then((res) => console.log("Day 9A:", res));

  decoder.decode("res/day9.txt")
    .then((inp) => parse(inp))
    .then((inp) => inp.map((inp) => inp.toReversed()))
    .then((inp) => day9A(inp))
    .then((res) => console.log("Day 9B:", res));
}

function day9A(input: number[][]): number {
  //console.log(input);
  return input.map((singleLine) => extrapolate(singleLine)).reduce(
    (prev, curr) => prev + curr,
    0,
  );
}

function parse(input: string): number[][] {
  return input
    .split("\n")
    .map((line) =>
      line
        .split(" ")
        .map((num) => Number(num.trim()))
    );
}

function extrapolate(input: number[]): number {
  if (input.every((inp) => inp == input[0])) {
    return input[0];
  }

  const toReduce = [];
  for (let i = 1; i < input.length; i++) {
    toReduce.push(input[i] - input[i - 1]);
  }

  const toAdd = extrapolate(toReduce);
  return input[input.length - 1] + toAdd;
}
