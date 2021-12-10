const input = Deno.readTextFileSync('./input.txt');

const lines = input.split('\n');

const brackets: { [index: string]: string } = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

const scores: { [index: string]: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

const part2Scores: { [index: string]: number } = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
};

const opening = Object.keys(brackets);

const unexpectedChars: string[] = [];
const autocompleteScores: number[] = [];

const parseLine = (line: string) => {
  const chars = line.split('');
  let opened: string[] = [];
  while (chars.length) {
    const next = chars.shift() as string;
    if (opening.includes(next)) {
      opened.unshift(brackets[next]);
    } else if (opened[0] === next) {
      opened.shift();
    } else {
      unexpectedChars.push(next);
      opened = [];
      break;
    }
  }
  if (opened.length) {
    autocompleteScores.push(opened.reduce((total, char) => total * 5 + part2Scores[char], 0))
  }
};

lines.forEach(parseLine);

const score = unexpectedChars.reduce((total, char) => total + scores[char], 0);
console.log('part1', score);

const part2Score = autocompleteScores.sort((a, b) => a - b)[Math.floor(autocompleteScores.length / 2)];
console.log('part2', part2Score);