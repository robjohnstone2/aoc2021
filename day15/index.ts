const input = Deno.readTextFileSync('./input.txt');

const parseGrid = (input: string): number[][] => input.split('\n').map(row => row.split('').map(n => parseInt(n)));

type Coord = { x: number, y: number };
type Tile = { x: number, y: number, cost: number };

type Candidate = { x: number, y: number, cost: number, accumulatedCost: number, estimatedRemaining: number };
const findRoute = (grid: number[][]): number => {
  const getTileAt = ({x, y}: Coord): Tile | undefined => {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) return;
    return { x, y, cost: grid[y][x] };
  };

  const getNeighbours = ({x, y}: Coord): Tile[] => {
    return [{ x, y: y - 1 }, { x: x + 1, y }, { x, y: y + 1 }, { x: x - 1, y }].map(getTileAt).filter(t => !!t) as Tile[];
  };

  const pos: Candidate = { x: 0, y: 0, cost: 0, accumulatedCost: 0, estimatedRemaining: grid[0].length + grid.length };
  const queue: Candidate[] = [];
  const seen: Map<string, Candidate> = new Map();
  while (true) {
    seen.set(JSON.stringify({ x: pos.x, y: pos.y }), pos);
    if (pos.x === grid[0].length - 1 && pos.y === grid.length - 1) break;
    getNeighbours(pos).forEach(({ x, y, cost }: Tile) => {
      const existing = queue.find(candidate => candidate.x === x && candidate.y === y);
      const accumulatedCost = pos.accumulatedCost + cost;
      const estimatedRemaining = grid[0].length - x + grid.length - y;
      const key = JSON.stringify({ x, y });
      if (seen.has(key)) {
        const previous = seen.get(key) as Candidate;
        if (accumulatedCost < previous.accumulatedCost) {
          queue.unshift({
            x,
            y,
            cost,
            accumulatedCost,
            estimatedRemaining
          });
        }
      } else if (existing) {
        if (existing.accumulatedCost > accumulatedCost) {
          existing.accumulatedCost = accumulatedCost;
        }
      } else {
        queue.unshift({
          x,
          y,
          cost,
          accumulatedCost,
          estimatedRemaining
        });
      }
    });
    queue.sort((a, b) => (a.estimatedRemaining + a.accumulatedCost) - (b.estimatedRemaining + b.accumulatedCost));
    const next = queue.shift() as Candidate;
    pos.x = next.x;
    pos.y = next.y;
    pos.accumulatedCost = next.accumulatedCost;
  }
  return pos.accumulatedCost;
};

console.log('part1', findRoute(parseGrid(input)));

const bigGrid = ((grid: number[][]): number[][] => {
  const originalSize = grid.length;
  for (let i = 1; i < 5; i++) {
    for (let y = 0; y < originalSize; y++) {
      for (let x = 0; x < originalSize; x++) {
        grid[y].push((grid[y][x] + i - 1) % 9 + 1);
      }
    }
  }

  for (let i = 1; i < 5; i++) {
    for (let y = 0; y < originalSize; y++) {
      const row: number[] = [];
      for (let x = 0; x < grid[0].length; x++) {
        row.push((grid[y][x] + i - 1) % 9 + 1);
      }
      grid.push(row);
    }
  }

  return grid;
})(parseGrid(input));

console.log('part2', findRoute(bigGrid));