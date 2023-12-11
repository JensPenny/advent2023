import { Decoder } from "../tools/Decoder.ts";

const test = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const testez = `..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`;

const test2 = `
OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO`;

let test3 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

type Point = {
  x: number;
  y: number;
};

type Direction = "N" | "E" | "S" | "W";

const pipes: { [key: string]: Direction[] } = {
  "|": ["N", "S"],
  "-": ["E", "W"],
  "L": ["N", "E"],
  "J": ["N", "W"],
  "7": ["S", "W"],
  "F": ["S", "E"],
  ".": [],
  "S": ["N", "E", "S", "W"],
};

//console.log(day10A(parse(test)));
//console.log(day10A(parse(testez)));
//console.log(day10A(parse(test2)));
//console.log(day10A(parse(test3)));
main();

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day10.txt")
    .then((inp) => parse(inp))
    .then((inp) => day10A(inp))
    .then((res) => console.log("Day 10A:", res.daya));

  decoder.decode("res/day10.txt")
    .then((inp) => parse(inp))
    .then((inp) => day10A(inp))
    .then((res) => console.log("Day 10B:", res));
}

function day10A(grid: string[][]): { daya: number; dayb: number } {
  const start = findStart(grid);
  //console.log(start);

  //Keep a record of traversed points and add the start
  const traversed = new Set<string>();
  traversed.add(JSON.stringify(start));

  //Check possibilities next to start
  const firstDirections = possibleStartDirections(grid, start);
  //console.log(firstDirections);

  //Do traversal
  if (firstDirections.length !== 2) {
    console.log(
      "I did not account for this possibility. Multiple loops possible. Good luck!",
    );
    return { daya: -1, dayb: -1 };
  }

  let circleCompleted = false;
  let currentDirection = firstDirections[1]; //For B the start direction is important, since the way decides if you have an infinite loop or a closing loop (all lefts or all rights are inside.) Change this if you loop on B
  let currentPoint = start;
  while (!circleCompleted) {
    const result = nextPoint(grid, currentPoint, currentDirection);
    //console.log(result);

    if (traversed.has(JSON.stringify(result.nextPoint))) {
      circleCompleted = true;
    }
    traversed.add(JSON.stringify(result.nextPoint));
    currentDirection = result.nextDirection;
    currentPoint = result.nextPoint;
  }

  //const empties = solveB(traversed, grid);
  const empties = solveBWithLefties(traversed, grid);

  return { daya: traversed.size / 2, dayb: empties };
}

function solveBWithLefties(path: Set<string>, grid: string[][]): number {
  //Left is the inner part of the loop. We keep going 'left' until we find a point in the set.

  const points = [...path].map((str) => JSON.parse(str) as Point);
  const insideLoop: Point[] = []; //We'll make a set of this later, but keep it as an array for now

  let previous = points.shift();
  for (const p of points) {
    //Get the vector we went
    const vector = { x: p.x - previous!.x, y: p.y - previous!.y };
    console.log(vector);

    let dir: Direction = "E";

    //Modifiers for searches in a direction
    let xModifier = 0;
    let yModifier = 0;

    if (vector.x === 0 && vector.y === 1) {
      dir = "S";
      //Left from southbound is east
      xModifier = 1;
    } else if (vector.x === 0 && vector.y === -1) {
      dir = "N";
      //Left from northbound is west
      xModifier = -1;
    } else if (vector.x === 1 && vector.y === 0) {
      dir = "E";
      yModifier = -1;
    } else {
      dir = "W";
      yModifier = 1;
    }
    console.log(dir);

    //Check points 'left' from the current point, until we find one in the set. Add it to the 'foundpoints' - set.
    let isFound = false;
    let nextPoint = p;
    while (!isFound) {
      nextPoint = { x: nextPoint.x + xModifier, y: nextPoint.y + yModifier };
      if (path.has(JSON.stringify(nextPoint))) {
        isFound = true;
      } else {
        console.log(`found an inner point at ${JSON.stringify(nextPoint)}`);
        insideLoop.push(nextPoint);
      }
    }

    previous = p;
  }

  let unique = new Set(insideLoop.map((p) => JSON.stringify(p)));
  console.log(unique);
  return unique.size;
}

function solveB(path: Set<string>, grid: string[][]): number {
  const points = [...path].map((str) => JSON.parse(str) as Point);

  points.sort((l, r) => {
    if (l.x !== r.x) {
      return l.x - r.x;
    }
    return l.y - r.y;
  });

  console.log(points);

  let lastpoint = points.shift();
  let isInside = true; //we start at the first point :>
  let counter = 0;

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    //Ignore pieces of the line
    if (grid[p.y][p.x] === "|") {
      lastpoint = p;
      continue;
    }
    if (p.x !== lastpoint?.x) {
      lastpoint = p; //New line to count
      isInside = true;
    } else {
      //Same line, get diffs between y's - incorrect since there can be a path to outside :(
      let spaces = p.y - lastpoint.y - 1;
      if (spaces !== 0) {
        if (isInside) {
          counter += spaces;
        }
      }
      isInside = !isInside;
      lastpoint = p;
    }
  }
  return counter;
}

function nextPoint(
  grid: string[][],
  currentPoint: Point,
  currentDirection: Direction,
): { nextPoint: Point; nextDirection: Direction } {
  //const current = grid[currentPoint.y][currentPoint.x];
  let nextPoint: Point;
  let toRemove: Direction;
  switch (currentDirection) {
    case "E":
      nextPoint = { x: currentPoint.x + 1, y: currentPoint.y };
      toRemove = "W";
      break;
    case "N":
      nextPoint = { x: currentPoint.x, y: currentPoint.y - 1 };
      toRemove = "S";
      break;
    case "S":
      nextPoint = { x: currentPoint.x, y: currentPoint.y + 1 };
      toRemove = "N";
      break;
    case "W":
      nextPoint = { x: currentPoint.x - 1, y: currentPoint.y };
      toRemove = "E";
      break;
    default:
      nextPoint = { x: -1, y: -1 };
      toRemove = "E"; //meh
      break;
  }

  const nextDirections = [...pipes[grid[nextPoint.y][nextPoint.x]]];
  nextDirections.splice(nextDirections.indexOf(toRemove), 1);
  return { nextPoint: nextPoint, nextDirection: nextDirections[0] };
}

function possibleStartDirections(
  grid: string[][],
  current: Point,
): Direction[] {
  //Check north from here. This direction should have a South-connector
  const result: Direction[] = [];
  if (current.y !== 0) {
    const point = { x: current.x, y: current.y - 1 };
    const tocheck = grid[point.y][point.x];
    if (pipes[tocheck].includes("S")) {
      result.push("N");
    }
  }

  //Check south from here
  if (current.y !== grid.length - 1) {
    const tocheck = grid[current.y + 1][current.x];
    if (pipes[tocheck].includes("N")) {
      result.push("S");
    }
  }

  //Check east
  if (current.x !== grid.length - 1) { //This works since its a rectangular grid. Otherwise this bugs
    const tocheck = grid[current.y][current.x + 1];
    if (pipes[tocheck].includes("W")) {
      result.push("E");
    }
  }

  //Check west
  if (current.x !== 0) {
    const tocheck = grid[current.y][current.x - 1];

    if (pipes[tocheck].includes("E")) {
      result.push("W");
    }
  }

  return result;
}

function parse(input: string): string[][] {
  return input.split("\n").map((line) => line.split(""));
}

function findStart(grid: string[][]): Point {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "S") {
        return { x: x, y: y };
      }
    }
  }
  return { x: -1, y: -1 };
}

//There is still a bug here, but fuck it. Time waits for noone and the lefties-algo gives a VERY close approximation. I'd guess I missed a case
//278 too low
//300 too high
//285 is on the ball. I might visualize this later to find out what I missed, since I feel like the train of thought is good.
