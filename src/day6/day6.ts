import { Decoder } from "../tools/Decoder.ts";

let test = `Time:      7  15   30
Distance:  9  40  200`;

let test2 = `Time:      71530
Distance:  940200`;

console.log("test A: ", day6A(parse(test)));
console.log("test B: ", day6A(parse(test2)));
main();

type Races = {
  times: number[];
  distances: number[];
};

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day6.txt")
    .then((inp) => parse(inp))
    .then((inp) => day6A(inp))
    .then((res) => console.log("Day 6A:", res));

  decoder.decode("res/day6.txt")
    .then((inp) => parse(inp))
    .then((inp) => {
      const newTime = Number(inp.times.join(""));
      const newDist = Number(inp.distances.join(""));
      return { times: [newTime], distances: [newDist] };
    })
    .then((inp) => day6A(inp))
    .then((res) => console.log("Day 6B:", res));
}

function day6A(toProcess: Races): number {
  console.log(toProcess);

  //To solve, use maths. there are 2 roots: 0 and {{time}}, use a function, and use results that go over
  //The function is abs(x^2 - {{time}}x) (somewhat easier to parse imo)
  //The max is time / 2 as an extra possible improvement for later
  const quads = function solveForTime(x: number, time: number): number {
    return Math.abs((x * x) - (time * x));
  };

  let result = 1;
  for (let group = 0; group < toProcess.times.length; group++) {
    const time = toProcess.times[group];
    const tobeat = toProcess.distances[group];

    let beating = 0;
    for (let x = 0; x <= time; x++) {
      const res = quads(x, time);
      if (res > tobeat) {
        beating++;
      }
      //console.log(`x: ${x} - time: ${res}`);
    }

    if (beating > 0) {
      result *= beating;
    }
  }

  return result;
}

function parse(input: string): Races {
  const splitted = input.split("\n");
  const times = splitted[0].split(" ").map(Number).filter((input) =>
    input != 0 && !Number.isNaN(input)
  );

  const distances = splitted[1].split(" ").map(Number).filter((input) =>
    input != 0 && !Number.isNaN(input)
  );

  return { times: times, distances: distances };
}
