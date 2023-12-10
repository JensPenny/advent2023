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

const test2 = `OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO`;

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
console.log(day10A(parse(test2)));
//main();

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day10.txt")
    .then((inp) => parse(inp))
    .then((inp) => day10A(inp))
    .then((res) => console.log("Day 10A:", res.daya));

  //   decoder.decode("res/day10.txt")
  //     .then((inp) => parse(inp))
  //     .then((inp) => day10A(inp))
  //     .then((res) => console.log("Day 10B:", res));
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
  let currentDirection = firstDirections[0];
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

  const empties = solveB(traversed);

  return { daya: traversed.size / 2, dayb: empties };
}

function solveB(path: Set<string>): number {
  const points = [...path].map((str) => JSON.parse(str) as Point);

  points.sort((l, r) => {
    if (l.x !== r.x) {
      return l.x - r.x;
    }
    return l.y - r.y;
  });

  console.log(points);

  let lastpoint = points.shift();
  let counter = 0;
  let isInside = false;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.x !== lastpoint?.x) {
      lastpoint = p; //New line to count
      isInside = false;
    } else {
      //Same line, get diffs between y's - incorrect since there can be a path to outside :(
      let spaces = p.y - lastpoint.y - 1;
      if (spaces === 0 && points[i + 1].y - p.y - 1 === 0) {
        isInside = true;
        //Ignore if we are in the middle of a line
        continue;
      }
      isInside = !isInside;

      if (spaces !== 0) {
        if (isInside) {
          counter += spaces;
        }
      }
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
