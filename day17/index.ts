const input = Deno.readTextFileSync('./input.txt');

const [ _, minX, maxX, minY, maxY ] = input.match(/:\sx=(.+)\.\.(.+),\sy=(.+)\.\.(.+)$/) as string[];

const target = {
  minX: parseInt(minX),
  maxX: parseInt(maxX),
  minY: parseInt(minY),
  maxY: parseInt(maxY)
};

const simulateY = (dy: number): [boolean, number[], number] => {
  let y = 0;
  let maxHeight = 0;
  const hits: number[] = [];
  let i = 0;
  while (y >= target.minY) {
    i++;
    y += dy;
    if (y > maxHeight) maxHeight = y;
    dy--;
    if (y >= target.minY && y <= target.maxY) hits.push(i);
  }
  return [!!hits.length, hits, maxHeight];
};

const yCandidates: [number, number[], number][] = [];
for (let dy = -10000; dy < 10000; dy++) {
  const [ hitTarget, hits, maxHeight ] = simulateY(dy);
  if (hitTarget) {
    yCandidates.push([dy, hits, maxHeight]);
  }
}

const [ bestDy, _hits, maxHeight] = yCandidates.sort((a, b) => b[0] - a[0])[0] as [number, number[], number];
console.log('best dy', bestDy);
console.log('max height', maxHeight);

const simulateX = (dx: number): [boolean, number[], boolean] => {
  let x = 0;
  const hits: number[] = [];
  let i = 0;
  while (x <= target.maxX) {
    i++;
    x += dx;
    if (dx > 0) dx--;
    else if (dx < 0) dx++;
    else if (dx === 0) return [!!hits.length, hits, x >= target.minX && x <= target.maxX];
    if(x >= target.minX && x <= target.maxX) hits.push(i);
  }
  return [!!hits.length, hits, false];
};

const xCandidates: [number, number[], boolean][] = [];
for (let dx = 0; dx < 10000; dx++) {
  const [hitsTarget, hits, stoppedInTarget] = simulateX(dx);
  if (hitsTarget) {
    xCandidates.push([dx, hits, stoppedInTarget]);
  }
}

const velocities: [number, number][] = [];
for (const [dx, xHits, stoppedInTarget] of xCandidates) {
  for (const [dy, yHits] of yCandidates) {
    const union = new Set([...xHits, ...yHits]);
    for (const step of union) {
      if ((stoppedInTarget && xHits[xHits.length - 1] < step) || (xHits.includes(step) && yHits.includes(step))) {
        velocities.push([ dx, dy ]);
        break;
      }
    }
  }
}

console.log('part 2', velocities.length);