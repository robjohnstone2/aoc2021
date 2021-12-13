const input = Deno.readTextFileSync('./input.txt');

let octopi = input.split('\n').map(row => row.split('').map(n => parseInt(n)));

const increaseAllBy1 = (octopi: number[][]) => {
  for (let y = 0; y < octopi.length; y++) {
    for (let x = 0; x < octopi[0].length; x++) {
      octopi[y][x]++;
    }
  }
};

const flash = (x: number, y: number, alreadyFlashed: Set<string>/*, changed: Set<string>*/) => {
  const key = JSON.stringify({ x, y });
  if (alreadyFlashed.has(key)) return;
  alreadyFlashed.add(key);
  [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 }
  ].filter(({ x, y }) => x >= 0 && x < octopi[0].length && y >= 0 && y < octopi.length)
  .forEach(({x, y}) => {
     const energy = ++octopi[y][x];
     if (energy > 9) flash(x, y, alreadyFlashed/*, changed*/);
   });
};

const flashes = (octopi: number[][], flashed: Set<string>): number => {
  for (let y = 0; y < octopi.length; y++) {
    for (let x = 0; x < octopi[0].length; x++) {
      if (octopi[y][x] > 9) flash(x, y, flashed/*, changed*/);
    }
  }
  return flashed.size;
};

const resetFlashedToZero = (flashed: Set<string>, octopi: number[][]) => {
  for (const key of flashed) {
    const { x, y } = JSON.parse(key);
    octopi[y][x] = 0;
  }
};

const run = (octopi: number[][], steps: number): { numFlashes: number, synchronised: number } => {
  let numFlashes = 0;
  let synchronised = -1;
  for (let i = 0; i < steps; i++) {
    const flashed: Set<string> = new Set();
    increaseAllBy1(octopi);
    const stepFlashes = flashes(octopi, flashed);
    if (stepFlashes === octopi.length * octopi[0].length) {
      synchronised = i + 1;
      break;
    }
    numFlashes += stepFlashes;
    resetFlashedToZero(flashed, octopi)
  }

  return { numFlashes, synchronised };
};

const part1 = run(octopi, 100);

console.log('part1', part1.numFlashes);

octopi = input.split('\n').map(row => row.split('').map(n => parseInt(n)));
const part2 = run(octopi, Infinity);
console.log('part2', part2.synchronised);