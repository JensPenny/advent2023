import { Decoder } from "../tools/Decoder.ts";

const test = 
`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

//console.log("test A = ", day3(test.split('\n'), false));
//console.log("test B = ", day3(test.split('\n'), true));

main();

function main() {
    const decoder = new Decoder()
    decoder.decode("res/day3.txt")
        .then(data => data.split('\n'))
        .then(inp => day3(inp, false))
        .then(res => console.log('Day 3A:', res))

    decoder.decode("res/day3.txt")
        .then(data => data.split('\n'))
        .then(inp => day3(inp, true))
        .then(res => console.log('Day 3B:', res))
}


function day3(input: string[], onlyratios: boolean) : number {
    const parsed = parse(input);
    console.log(parsed);

    const symbols = parsed.symbols;
    const parts = parsed.parts;

    const validParts = new Set<Part>();
    for (const symbol of symbols) {
        //Find parts adjecant to a symbol, and move these to another valid list
        const used = parts
            .filter(part => Math.abs(part.startpos.y - symbol.pos.y) <= 1)  //Filter relevant-ish lines
            .filter(part => {
                const toCheck = symbol.pos.x - part.startpos.x;
                return toCheck >= -1  && toCheck <= part.length; //Actually used paper, should work
                // return (symbol.pos.x == part.startpos.x - 1)
                // || (symbol.pos.x > part.startpos.x && symbol.pos.x < part.startpos.x + part.length)
                // || (symbol.pos.x == part.startpos.x + part.length)
            });
        console.log('parts next to:', symbol, ' are ', used);
        if (onlyratios) {
            if (symbol.symbol != '*') {
                continue;
            }
            if (used.length == 2) {
                //lets abuse the parts for this
                const ratio = used.reduce((r, current) => r * current.nr, 1);
                validParts.add({nr: ratio,length: 0, startpos: {x: 0, y: 0}}) 
            } 
        } else {
            used.forEach(p => validParts.add(p));
        }
    }
    
    let sum = 0;
    validParts.forEach(p => sum += p.nr);
    return sum;
}

function parse(input: string[]) : {parts: Part[], symbols: Symbol[]} {
    const parts: Part[] = [];
    const symbols: Symbol[] = [];
    input.forEach((line, index) => {
        const matches = line.matchAll(/\d+/g);
        for (const match of matches) {
            const pos: Point = { x: match.index!, y: index };
            const nr = parseInt(match.toString());
            const length = match.toString().length;
            parts.push({length: length, nr: nr, startpos: pos});
        }

        //Find all symbols: no numbers and no dots
        line.split('').forEach((c, xpos) => {
            if (Number.isNaN(Number(c)) && c.trim() !== '.') {
                symbols.push({pos: {x: xpos, y:index}, symbol: c})
            }
        })
    });
    return {parts: parts, symbols: symbols};
}

type Point = {x: number, y: number};
type Part = {
    nr: number, 
    startpos: Point
    length: number
}
type Symbol = {
    pos: Point, 
    symbol: string
}