// deno-lint-ignore-file no-unused-vars
import { Decoder } from "../tools/Decoder.ts";

const test = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

//parseAndExpand(test);
//console.log(day11A(parseAndExpand(test)));
//console.log(day11B(test, 100));

main();

function main() {
  const decoder = new Decoder();
  //   decoder.decode("res/day11.txt")
  //     .then((inp) => parseAndExpand(inp, 1))
  //     .then((inp) => day11A(inp))
  //     .then((res) => console.log("Day 11A:", res));

  decoder.decode("res/day11.txt")
    .then((inp) => day11B(inp, 1))
    .then((res) => console.log("Day 11A:", res));

  decoder.decode("res/day11.txt")
    .then((inp) => day11B(inp, 1000000))
    .then((res) => console.log("Day 11B:", res));
}

//Day B is different, we'll change the way we expand
function day11B(input: string, amountExpansions: number): number {
  if (amountExpansions == 1) {
    // Anticipate. This works differently when you expand over 1 amount of rows. If we use 1, use 2 to subtract later
    // This means that for a modifier of 10 rows, the multiplier is 9. The same with 100 etc..
    amountExpansions = 2;
  }
  const parsed = parseAndReturnExpandedIds(input);
  const galaxies = findGalaxies(parsed.grid);

  const expanded = galaxies.map((g) => {
    const rows = parsed.expandedRows.filter((exp) => exp < g.y);
    const cols = parsed.expandedCols.filter((exp) => exp < g.x);

    return {
      x: g.x + (cols.length * (amountExpansions - 1)),
      y: g.y + (rows.length * (amountExpansions - 1)),
    };
  });
  //We'll expand the rows first - add the amount-multiplier * amount of rows before our current
  let distances = calculateDistances(expanded);
  return distances.reduce((prev, curr) => prev + curr, 0);
}

//We expanded the universe, just do the rest
function day11A(expanded: string[][]): number {
  const galaxies = findGalaxies(expanded);
  //console.log(galaxies);

  const distances = calculateDistances(galaxies);
  return distances.reduce((prev, curr) => prev + curr, 0);
}

function calculateDistances(points: Point[]): number[] {
  const pCopy = [...points];
  const distances: number[] = [];
  while (pCopy.length > 1) { //Keep going till we have 1 more pair
    //Since order doesnt matter, keep popping
    const current = pCopy.pop()!;
    pCopy.forEach((p) => {
      const dist = Math.abs(p.x - current.x) + (Math.abs(p.y - current.y));
      distances.push(dist);
    });
  }
  return distances;
}

function findGalaxies(space: string[][]): Point[] {
  const results: Point[] = [];
  for (let y = 0; y < space.length; y++) {
    for (let x = 0; x < space[y].length; x++) {
      if (space[y][x] !== ".") {
        results.push({ x: x, y: y });
      }
    }
  }

  return results;
}

function parseAndReturnExpandedIds(
  input: string,
): { grid: string[][]; expandedRows: number[]; expandedCols: number[] } {
  const parsed = input.split("\n").map((line) => line.split(""));
  const expandedRows: number[] = [];
  const expandedCols: number[] = [];

  //lets expand rows first. We expand from the back to not mess up indexes
  for (let row = 0; row < parsed.length; row++) {
    if (parsed[row].every((c) => c === ".")) {
      expandedRows.push(row);
    }
  }

  //Transpose and do it again
  const transposed = transposeMatrix(parsed);
  //lets expand rows again. We expand from the back to not mess up indexes
  for (let row = 0; row < transposed.length; row++) {
    if (transposed[row].every((c) => c === ".")) {
      expandedCols.push(row);
    }
  }

  return {
    grid: parsed,
    expandedCols: expandedCols,
    expandedRows: expandedRows,
  };
}

function parseAndExpand(input: string, amountExpansions: number): string[][] {
  let parsed = input.split("\n").map((line) => line.split(""));

  //   console.log("original");
  //   parsed.forEach((v) => console.log(...v));

  //lets expand rows first. We expand from the back to not mess up indexes
  for (let row = parsed.length - 1; row >= 0; row--) {
    if (parsed[row].every((c) => c === ".")) {
      for (let exp = 0; exp < amountExpansions; exp++) {
        parsed.splice(row, 0, [...parsed[row]]);
      }
    }
  }

  //Transpose and do it again
  parsed = transposeMatrix(parsed);
  //lets expand rows again. We expand from the back to not mess up indexes
  for (let row = parsed.length - 1; row >= 0; row--) {
    if (parsed[row].every((c) => c === ".")) {
      for (let exp = 0; exp < amountExpansions; exp++) {
        parsed.splice(row, 0, [...parsed[row]]);
      }
    }
  }

  //T R A N S P O S E - not needed I guess
  //parsed = transposeMatrix(parsed);

  //   console.log("expanded");
  //   parsed.forEach((v) => console.log(...v));

  return parsed;
}

function transposeMatrix(matrix: string[][]): string[][] {
  // Get the number of rows and columns
  const numRows: number = matrix.length;
  const numCols: number = matrix[0].length;

  // Create a new matrix with swapped rows and columns
  const transposedMatrix: string[][] = new Array(numCols).fill(null).map(
    () => [],
  );

  // Loop through the original matrix and swap rows with columns
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedMatrix[j][i] = matrix[i][j];
    }
  }

  return transposedMatrix;
}

type Point = {
  x: number;
  y: number;
};
