import { Decoder } from "../tools/Decoder.ts";

const test = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const parseTest = `TTTTT 11
TTTTJ 11
TTT22 11
TTT23 11
TT311 11
TT321 11
12345 11`;

type Type =
  | "FIVE"
  | "FOUR"
  | "FULLH"
  | "THREE"
  | "TWOP"
  | "PAIR"
  | "HIGHK";

//Higher index = more worth. Reverse bc I made a doodoo
const typeRanks = ["FIVE", "FOUR", "FULLH", "THREE", "TWOP", "PAIR", "HIGHK"]
  .reverse();

//Higher index = more worth
const valueRanksA = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

const valueRanksB = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

type Hand = {
  original: string;
  type: Type;
  bid: number;
};

//console.log(parse(parseTest));
//console.log(parse(parseTest, true));

console.log(day7A(parse(test), valueRanksA));
console.log(day7A(parse(test, true), valueRanksB));
main();

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day7.txt")
    .then((inp) => parse(inp))
    .then((inp) => day7A(inp, valueRanksA))
    .then((res) => console.log("Day 7A:", res));

  decoder.decode("res/day7.txt")
    .then((inp) => parse(inp, true))
    .then((inp) => day7A(inp, valueRanksB))
    .then((res) => console.log("Day 7B:", res));
}

function day7A(hands: Hand[], ranks: string[]): number {
  console.log(hands);

  hands.sort((left, right) => {
    if (typeRanks.indexOf(left.type) != typeRanks.indexOf(right.type)) {
      return typeRanks.indexOf(left.type) - typeRanks.indexOf(right.type);
    }

    for (let index = 0; index < left.original.length; index++) {
      if (left.original[index] !== right.original[index]) {
        return ranks.indexOf(left.original[index]) -
          ranks.indexOf(right.original[index]);
      }
    }

    return 0;
  });

  console.log(hands);
  // return sequences.reduce((r, seq) =>  r + seq.cardmultiplier,0);
  const result = hands.reduce(
    (r, currHand, index) => r + ((index + 1) * currHand.bid),
    0,
  );
  return result;
}

function determineType(hand: string): Type {
  const counts = new Map<string, number>();
  for (const c of hand) {
    if (counts.has(c)) {
      counts.set(c, counts.get(c)! + 1);
    } else {
      counts.set(c, 1);
    }
  }

  const morethen2: number[] = []; //amounts with more then 2 occurrences
  for (const entry of counts.entries()) {
    if (entry[1] >= 2) {
      morethen2.push(entry[1]);
    }
  }
  morethen2.sort();

  if (morethen2.length == 0) {
    //All different:
    return "HIGHK";
  }

  if (morethen2.length == 1) {
    if (morethen2[0] == 5) {
      return "FIVE";
    }
    if (morethen2[0] == 4) {
      return "FOUR";
    }
    if (morethen2[0] == 3) {
      return "THREE";
    }
    if (morethen2[0] == 2) {
      return "PAIR";
    }
  }

  if (morethen2.length == 2) {
    if (morethen2[1] == 3) {
      return "FULLH";
    }
    if (morethen2[1] == 2) {
      return "TWOP";
    }
  }

  return "HIGHK";
}

function determineTypeWithJoker(hand: string): Type {
  const counts = new Map<string, number>();
  for (const c of hand) {
    if (counts.has(c)) {
      counts.set(c, counts.get(c)! + 1);
    } else {
      counts.set(c, 1);
    }
  }

  let jokers: number = counts.has("J") ? counts.get("J")! : 0;
  counts.set("J", 0);
  const amounts = Array.from(counts.values()).filter((inp) => "J").sort()
    .reverse();

  amounts[0] = amounts[0] + jokers;
  const morethen2: number[] = []; //amounts with more then 2 occurrences
  for (const entry of amounts) {
    if (entry >= 2) {
      morethen2.push(entry);
    }
  }
  morethen2.sort();

  if (morethen2.length == 0) {
    //All different:
    return "HIGHK";
  }

  if (morethen2.length == 1) {
    if (morethen2[0] == 5) {
      return "FIVE";
    }
    if (morethen2[0] == 4) {
      return "FOUR";
    }
    if (morethen2[0] == 3) {
      return "THREE";
    }
    if (morethen2[0] == 2) {
      return "PAIR";
    }
  }

  if (morethen2.length == 2) {
    if (morethen2[1] == 3) {
      return "FULLH";
    }
    if (morethen2[1] == 2) {
      return "TWOP";
    }
  }

  return "HIGHK";
}

function parse(input: string, withJoker: boolean = false): Hand[] {
  return input.split("\n")
    .map((inp) => {
      const splitted = inp.split(" ");
      const handstr = splitted[0].trim();
      let type: Type;
      if (withJoker) {
        type = determineTypeWithJoker(handstr);
      } else {
        type = determineType(handstr);
      }

      return {
        original: handstr,
        bid: Number(splitted[1]),
        type: type,
      } as Hand;
    });
}
