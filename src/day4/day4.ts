import { Decoder } from "../tools/Decoder.ts";

let test = 
`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

//console.log("test A = ", day4A(test.split('\n')));
//console.log("test B = ", day4B(test.split('\n')));

main();

function main() {
    const decoder = new Decoder()
    decoder.decode("res/day4.txt")
        .then(data => data.split('\n'))
        .then(inp => day4A(inp))
        .then(res => console.log('Day 4A:', res))

    decoder.decode("res/day4.txt")
        .then(data => data.split('\n'))
        .then(inp => day4B(inp))
        .then(res => console.log('Day 4B:', res))
}

function day4A(input: string[]): number {
    const sequences = input.map(inp => {
        return inp.split(':')[1].split('|');
    });

    let sum = 0;
    for (const sequence of sequences) {
        const winningnrs = sequence[0].split(' ').map(inp => parseInt(inp.trim())).filter(inp => !Number.isNaN(inp));
        const card = sequence[1].split(' ').map(inp => parseInt(inp.trim())).filter(inp => !Number.isNaN(inp));

        const winners = card.filter(c => winningnrs.indexOf(c) !== -1);
        //console.log(winners);

        const score = winners.reduce((r) => r == 0 ? 1 : r * 2, 0);
        //console.log(score);
        sum += score;

    }

    return sum;
}

function day4B(input: string[]): number {
    const sequences = input.map(inp => {
        return { game: inp.split(':')[1].split('|'), cardmultiplier: 1};
    });
    
    sequences.forEach((sequence, index) => {
        const winningnrs = sequence.game[0].split(' ').map(inp => parseInt(inp.trim())).filter(inp => !Number.isNaN(inp));
        const card = sequence.game[1].split(' ').map(inp => parseInt(inp.trim())).filter(inp => !Number.isNaN(inp));

        const winners = card.filter(c => winningnrs.indexOf(c) !== -1);
        for (let toUpdate = 1; toUpdate <= winners.length; toUpdate++){
            sequences[index + toUpdate].cardmultiplier += sequence.cardmultiplier
        }

        //console.log(sequences);
    });

    return sequences.reduce((r, seq) =>  r + seq.cardmultiplier,0);
}
