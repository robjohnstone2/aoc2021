const input = Deno.readTextFileSync('./input.txt');
// const input = `2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678`;

const heightMap = input.split('\n').map(row => row.split('').map(h => parseInt(h)));

const getHeightAt = (x: number, y: number): number => {
  const row = heightMap[y];
  if (typeof row === 'undefined') return Infinity;
  const tile = row[x];
  if (typeof tile === 'undefined') return Infinity;
  return tile;
};

let riskLevel = 0;
const lowPoints: { x: number, y: number, h: number}[] = [];

for (let x = 0; x < heightMap[0].length; x++) {
  for (let y = 0; y < heightMap.length; y++) {
    const h = getHeightAt(x, y);
    const up = getHeightAt(x, y - 1);
    const down = getHeightAt(x, y + 1);
    const left = getHeightAt(x - 1, y);
    const right = getHeightAt(x + 1, y);
    if (h < Math.min(up, down, left, right)) {
      riskLevel += h + 1;
      lowPoints.push({ x, y, h });
    }
  }
}

console.log('part 1', riskLevel);

const basins: Map<string, number> = new Map();
lowPoints.forEach(({ x, y }, i) => {
  basins.set(JSON.stringify({ x, y }), i)
});

for (let y = 0; y < heightMap.length; y++) {
  for (let x = 0; x < heightMap[0].length; x++) {
    const key = JSON.stringify({ x, y });
    if (!basins.has(key) && getHeightAt(x, y) !== 9) {
      let currentLoc = { x, y };
      while (true) {
        const up = { x: currentLoc.x, y: currentLoc.y - 1};
        const down = { x: currentLoc.x, y: currentLoc.y + 1};
        const left = { x: currentLoc.x - 1, y: currentLoc.y};
        const right = { x: currentLoc.x + 1, y: currentLoc.y};
        const lowestNeighbour = [up, down, left, right].sort((a, b) => getHeightAt(a.x, a.y) - getHeightAt(b.x, b.y))[0];
        const lowestNeighbourKey = JSON.stringify(lowestNeighbour);
        if (basins.has(lowestNeighbourKey)) {
          basins.set(key, basins.get(lowestNeighbourKey) as number);
          break;
        } else {
          currentLoc = lowestNeighbour;
        }
      }
    }
  }
}

const basinSizes: Map<number, number> = Array.from(basins.values()).reduce((sizes, id) => {
  sizes.set(id, (sizes.get(id) || 0) + 1);
  return sizes;
}, new Map());

const sorted = Array.from(basinSizes.values()).sort((a, b) => b - a);
console.log('part 2', sorted[0] * sorted[1] * sorted[2]);