const input = Deno.readTextFileSync('./input.txt');

const rows = input.split('\n');

type Coord = {
  x: number,
  y: number
}

type Line = {
  start: Coord,
  end: Coord
}

const parseLine = (row: string): Line => {
  const re = /(\d+),(\d+)\s->\s(\d+),(\d+)/;
  const [_, x1, y1, x2, y2] = (row.match(re) as string[]);
  return {
    start: {
      x: parseInt(x1),
      y: parseInt(y1)
    },
    end: {
      x: parseInt(x2),
      y: parseInt(y2)
    }
  }
};

const lines = rows.map(parseLine);

const isHorizontal = (line: Line): boolean => {
  return line.start.y === line.end.y;
};

const isVertical = (line: Line): boolean => {
  return line.start.x === line.end.x;
};

const horizontalLines = lines.filter(isHorizontal);
const verticalLines = lines.filter(isVertical);
const diagonalLines = lines.filter(line => !horizontalLines.includes(line) && !verticalLines.includes(line));

let ventsAtPoints: Map<string, number> = new Map();

const incrementVent = (coord: Coord) => {
    const key = JSON.stringify(coord);
    if (!ventsAtPoints.has(key)) ventsAtPoints.set(key, 0);
    ventsAtPoints.set(key, (ventsAtPoints.get(key) as number) + 1);
};

horizontalLines.forEach(line => {
  const y = line.start.y;
  const start = Math.min(line.start.x, line.end.x);
  const end = Math.max(line.start.x, line.end.x);
  for (let x = start; x <= end; x++) {
    incrementVent({ x, y });
  }
});

verticalLines.forEach(line => {
  const x = line.start.x;
  const start = Math.min(line.start.y, line.end.y);
  const end = Math.max(line.start.y, line.end.y);
  for (let y = start; y <= end; y++) {
    incrementVent({ x, y });
  }
});

const twoOrMore = Array.from(ventsAtPoints.values()).filter(num => num >= 2).length;

console.log('part 1', twoOrMore);

diagonalLines.forEach(line => {
  const [start, end] = [line.start, line.end].sort((a, b) => a.x - b.x);
  const dy = start.y > end.y ? -1 : 1;

  for (let x = start.x; x <= end.x; x++) {
    const y = start.y + dy * (x - start.x);
    incrementVent({ x, y });
  }
});

const part2 = Array.from(ventsAtPoints.values()).filter(num => num >= 2).length;

console.log('part 2', part2);