const input = Deno.readTextFileSync('./input.txt');

const fish = input.split(',').map(f => parseInt(f));

const cache: Map<number, number> = new Map();

// starting from a newly born fish
const fishAfterDays = (days: number): number => {
  if (days < 9) return 1;
  if (cache.has(days)) return (cache.get(days) as number); 
  const fish = fishAfterDays(days - 7) + fishAfterDays(days - 9);
  cache.set(days, fish);
  return fish;
};

const numFish = fish.reduce((total, timeToSpawn) => total + fishAfterDays(256 + 8 - timeToSpawn), 0);

console.log('part 2', numFish);