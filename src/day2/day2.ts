import { Decoder } from "../tools/Decoder.ts";

const testA = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

//console.log(day2A(testA.split('\n')));
//console.log(day2B(testA.split('\n')));

main();

function main() {
    const decoder = new Decoder()
    decoder.decode("res/day2.txt")
        .then(data => data.split('\n'))
        .then(day2A)
        .then(res => console.log('Day 2A:', res))

    decoder.decode("res/day2.txt")
        .then(data => data.split('\n'))
        .then(day2B)
        .then(res => console.log('Day 2B:', res))
}

function day2A(input: string[]): number {
    const games = input.map(lineToGame);
    
    const constraint = new Map([
        ['red', 12], ['green', 13], ['blue', 14]
    ])
    //12 red cubes, 13 green cubes, and 14 blue cubes
    let sum = 0;
    for (const game of games) {
        const possible = game.moves.every(move => {
            return (move.has('red') ? move.get('red') : 0) <= constraint.get('red')!
            && (move.has('green') ? move.get('green') : 0) <= constraint.get('green')!
            && (move.has('blue') ? move.get('blue') : 0) <= constraint.get('blue')!
        });

        if (possible) {
            console.log(`game ${game.gameNr} is possible!`);
            sum += game.gameNr;
        } else {
            console.log(`game ${game.gameNr} is impossible!`);
        }
    }
    return sum;
}

function day2B(input: string[]) : number {
    const games = input.map(lineToGame);

    const values = games.map(game => {
        //calculate map with least amount of moved
        const leastAmount = new Map([
            ['red', 0], ['green', 0], ['blue', 0]
        ]);
        
        game.moves.forEach(move => {
            move.forEach((val, key) => {
                let least = leastAmount.get(key)!;
                if (least == 0 || least < val) {
                    leastAmount.set(key, val);
                } 
            });
        });

        console.log(leastAmount);
        let gamevalue = 1;
        leastAmount.forEach((val) => gamevalue = gamevalue*val);
        return gamevalue;
    }); 
    return values.reduce((sum, current) => sum + current, 0);;
}

function lineToGame(line: string): Game {
    const splitted = line.split(':');
    const game = {} as Game;
    game.gameNr = parseInt(splitted[0].split('').filter(c => !Number.isNaN(Number(c))).join(''));

    const runs = splitted[1].split(";").map(singlerun => {
        const moves = singlerun.split(',');
        const moveAsMap = new Map<string, number>();
        moves.forEach(move => {
            move = move.trim();
            const parts = move.split(' ');
            moveAsMap.set(parts[1].trim(), parseInt(parts[0]));
        });
        return moveAsMap;
    });
    game.moves = runs;

    console.log(game);
    return game;
}

interface Game {
    gameNr: number
    moves: Map<string, number>[]
}