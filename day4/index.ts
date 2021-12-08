const input = Deno.readTextFileSync('./input.txt');

const [drawInput, ...boardsInput] = input.split('\n\n');

const draw = drawInput.split(',');

type Board = {
  matches: boolean[][],
  layout: string[][];
}

const parseBoard = (input: string): Board => {
  const layout = input.split('\n').map(row => row.trim().split(/\s+/));
  const matches = layout.map(row => row.map(() => false));
  return {
    matches: matches,
    layout: layout
  }
};

const boards = boardsInput.map(parseBoard);

const winners: Board[] = [];

const hasWon = (board: Board): boolean => {
  // check rows
  for (let y = 0; y < 5; y++) {
    const matchesInRow = board.matches[y].reduce((matches, tile) => tile ? matches + 1 : matches, 0);
    if (matchesInRow === 5) return true;
  }

  // check columns
  for (let x = 0; x < 5; x++) {
    const matchesInCol = board.matches.map(row => row[x]).reduce((matches, tile) => tile ? matches + 1 : matches, 0);
    if (matchesInCol === 5) return true;
  }

  return false;
};

let justCalled: number;

while (winners.length < boards.length) {
  const next = draw.shift();
  boards.forEach((board, i) => {
    if (winners.includes(board)) return;
    board.layout.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === next) {
          board.matches[y][x] = true;
          if (hasWon(board)) {
            winners.push(board);
            justCalled = parseInt(next);
          }
        }
      })
    })
  });
}

const calcScore = (board: Board): number => {
  let total = 0;
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      if (!board.matches[y][x]) {
        total += parseInt(board.layout[y][x]);
      }
    }
  }
  return total * justCalled;
}

console.log('part 2', calcScore(winners[winners.length - 1]));