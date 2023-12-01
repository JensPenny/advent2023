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
    decoder()
        .then(data => data.split('\n'))
        .then(day1A)

    decoder()
        .then(data => data.split('\n'))
        .then(day1B)
}

async function decoder(): Promise<string> {
    const file = await Deno.open("day1.txt", { read: true });
    const decoder = new TextDecoder();
    let text = "";
    for await (const chunk of file.readable) {
        //console.log(decoder.decode(chunk));
        text += decoder.decode(chunk);
    }
    console.log(text);
    return text;
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

    console.log('day 1A: ', result);
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

    console.log('day 1B: ', result);
}

export { };
