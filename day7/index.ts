const input = Deno.readTextFileSync('./input.txt');

const positions = input.split(',').map(p => parseInt(p));

const fuel = (dist: number): number => {
  let result = 0;
  for (let i = 1; i <= dist; i++) {
    result += i;
  }
  return result;
};

const calcCost = (positions: number[], target: number): number => positions.reduce((total, pos) => total + fuel(Math.abs(target - pos)), 0);

let lowestCost = Infinity;
let bestPos;

for (let pos = Math.min(...positions); pos <= Math.max(...positions); pos++) {
  const cost = calcCost(positions, pos);
  if (cost < lowestCost) {
    lowestCost = cost;
    bestPos = pos;
  }
}

console.log('best position', bestPos, 'cost', lowestCost);