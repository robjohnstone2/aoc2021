const input = Deno.readTextFileSync('./input.txt');

const [dotsInput, foldsInput] = input.split('\n\n');

const dots: Set<string> = dotsInput.split('\n').reduce((dots: Set<string>, row: string) => {
  const [x, y] = row.split(',').map(n => parseInt(n));
  dots.add(JSON.stringify({x, y}));
  return dots;
}, new Set());

const folds: Array<{ axis: string, pos: number }> = foldsInput.split('\n').map((row: string) => {
  const [_, axis, pos] = row.match(/([xy])=(\d+)/) as string[];
  return { axis, pos: parseInt(pos) };
});

const fold = (dots: Set<string>, { axis, pos }: { axis: string, pos: number }): Set<string> => {
  return [...dots.entries()].reduce((newDots: Set<string>, [dot]: string[]) => {
    const coord = JSON.parse(dot);
    if (coord[axis] < pos) {
      newDots.add(dot);
    } else if (axis === 'x') {
      newDots.add(JSON.stringify({ x: 2 * pos - coord.x, y: coord.y }));
    } else {
      newDots.add(JSON.stringify({ x: coord.x, y: 2 * pos - coord.y }));
    }
    return newDots;
  }, new Set());
};

const draw = (dots: Set<string>) => {
  const coords = [...dots].map(dot => JSON.parse(dot));
  const maxX = Math.max(...coords.map(({ x }) => x));
  const maxY = Math.max(...coords.map(({ y }) => y));
  for (let y = 0; y <= maxY; y++) {
    let row = '';
    for (let x = 0; x <= maxX; x++) {
      if (dots.has(JSON.stringify({ x, y }))) {
        row += '#';
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
};

const foldedOnce = fold(dots, folds[0]);
console.log('part 1', foldedOnce.size);

const folded = folds.reduce((folded: Set<string>, thisFold) => fold(folded, thisFold), dots);

draw(folded);