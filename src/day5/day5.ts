import { Decoder } from "../tools/Decoder.ts";

let test = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

// console.log("Test A: " + day5A(test));
console.log("Test B: " + day5B(test));

//main();

type Chapter = {
  destinationStart: number;
  sourceStart: number;
  range: number;
};

type Almanac = {
  seeds: number[];
  seed_to_soil: Chapter[];
  soil_to_fert: Chapter[];
  fert_to_water: Chapter[];
  water_to_light: Chapter[];
  light_to_temp: Chapter[];
  temp_to_humid: Chapter[];
  humid_to_loc: Chapter[];
};

type Range = {
  start: number;
  stop: number;
};

function main() {
  const decoder = new Decoder();
  decoder.decode("res/day5.txt")
    .then((inp) => day5A(inp))
    .then((res) => console.log("Day 5A:", res));

  decoder.decode("res/day5.txt")
    .then((inp) => day5B(inp))
    .then((res) => console.log("Day 5B:", res));
}

function day5A(input: string): number {
  const almanac = parseAlmanac(input);
  return calculateLowest(
    almanac.seeds.map((inp) => {
      return { start: inp, stop: inp + 1 } as Range;
    }),
    almanac,
  );
}

function day5B(input: string): number {
  const almanac = parseAlmanac(input);
  const pairs = almanac.seeds.flatMap((_, i, a) =>
    i % 2 ? [] : [a.slice(i, i + 2)]
  );

  return calculateLowest(
    pairs.map((inp) => {
      return { start: inp[0], stop: inp[0] + inp[1] } as Range;
    }),
    almanac,
  );
}

function calculateLowest(ranges: Range[], almanac: Almanac): number {
  let lowest = Number.MAX_SAFE_INTEGER;

  for (const range of ranges) {
    let current = range.start;

    while (current < range.stop) {
      const seed = current;
      const soil = searchChapter(seed, almanac.seed_to_soil);
      const fert = searchChapter(soil.result, almanac.soil_to_fert);
      const water = searchChapter(fert.result, almanac.fert_to_water);
      const light = searchChapter(water.result, almanac.water_to_light);
      const temp = searchChapter(light.result, almanac.light_to_temp);
      const humid = searchChapter(temp.result, almanac.temp_to_humid);
      const loc = searchChapter(humid.result, almanac.humid_to_loc);

      console.log(`seed ${seed} to loc ${loc.result}`);
      if (loc.result < lowest) {
        lowest = loc.result;
      }

      const possibleNextValues = [
        loc.maxOfChapter,
        range.stop,
      ];

      const next = Math.min(...possibleNextValues);
      console.log(`old index: ${current} - skipping to ${next}`);
      current += next;
    }
  }
  return lowest;
}

function searchChapter(
  source: number,
  chapters: Chapter[],
): { result: number; maxOfChapter: number } {
  for (const chapter of chapters) {
    if (
      source >= chapter.sourceStart &&
      source < chapter.sourceStart + chapter.range
    ) {
      const offset = source - chapter.sourceStart;
      return {
        result: chapter.destinationStart + offset,
        maxOfChapter: chapter.sourceStart + chapter.range,
      };
    }
  }

  return { result: source, maxOfChapter: source + 1 };
}

function parseAlmanac(input: String): Almanac {
  let splitted = input.split("\n\n");

  splitted = splitted.reverse(); //Easier popping
  const seeds = splitted.pop()!.split(":")[1].split(" ").filter((str) =>
    str !== ""
  ).map((inp) => Number(inp.trim()));

  const almanac: Almanac = {
    seeds: seeds,
    seed_to_soil: parseChapter(splitted.pop()!),
    soil_to_fert: parseChapter(splitted.pop()!),
    fert_to_water: parseChapter(splitted.pop()!),
    water_to_light: parseChapter(splitted.pop()!),
    light_to_temp: parseChapter(splitted.pop()!),
    temp_to_humid: parseChapter(splitted.pop()!),
    humid_to_loc: parseChapter(splitted.pop()!),
  };
  console.log(almanac);
  return almanac;
}

function parseChapter(chapter: String): Chapter[] {
  const chapterInfo = chapter.substring(chapter.indexOf("\n") + 1);
  const chapters = chapterInfo.split("\n").map((chapterstr) => {
    const info = chapterstr.split(" ");
    return {
      destinationStart: Number(info[0]),
      sourceStart: Number(info[1]),
      range: Number(info[2]),
    } as Chapter;
  });
  console.log(chapters);

  return chapters;
}
