import { Decoder } from "../tools/Decoder.ts";


const test = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`

const test2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`

//day1A(test.split('\n'));
//day1B(test2.split('\n'));
main();

function main() {
    const decoder = new Decoder()
    decoder.decode("res/day1.txt")
        .then(data => data.split('\n'))
        .then(day1A)
        .then(res => console.log('Day 1A:', res))

    decoder.decode("res/day1.txt")
        .then(data => data.split('\n'))
        .then(day1B)
        .then(res => console.log('Day 1B:', res))
}

function day1A(lines: string[]): number {
    const numbers = lines.map(line => line.split('').filter(c => !Number.isNaN(Number(c))).map(Number));

    const result = numbers.map(line => {
        const first = line[0];
        const last = line[line.length - 1];

        const asString = `${first}${last}`
        const asNumber = Number(asString);
        if (!Number.isNaN(asNumber)) {
            return asNumber;
        } else {
            return 0;
        }
    }).reduce((sum, current) => sum + current, 0);
    return result;
}

function day1B(lines: string[]): number {
    const numbers = lines.map(line => {
        return line.replaceAll('one', 'o1e')
            .replaceAll('two', 't2o')
            .replaceAll('three', 't3e')
            .replaceAll('four', 'f4r')
            .replaceAll('five', 'f5e')
            .replaceAll('six', 's6x')
            .replaceAll('seven', 's7n')
            .replaceAll('eight', 'e8t')
            .replaceAll('nine', 'n9e');
    }).map(line => line.split('').filter(c => !Number.isNaN(Number(c))).map(Number));

    const result = numbers.map(line => {
        const first = line[0];
        const last = line[line.length - 1];

        const asString = `${first}${last}`
        const asNumber = Number(asString);
        if (!Number.isNaN(asNumber)) {
            return asNumber;
        } else {
            return 0;
        }
    }).reduce((sum, current) => sum + current, 0);

    return result;
}

export { };
