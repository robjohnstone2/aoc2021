const input = Deno.readTextFileSync('./input.txt');

const digits = input.split('\n').map(row => row.split(''));

type Col = { zeros: number, ones: number };

const stats: Col[] = [];

for (let rowIndex = 0; rowIndex < digits.length; rowIndex++) {
  for (let colIndex = 0; colIndex < digits[0].length; colIndex++) {
    let col = stats[colIndex];
    if (!col) {
      col = { zeros: 0, ones: 0 };
      stats[colIndex] = col;
    }
    if (digits[rowIndex][colIndex] === '0') col.zeros++;
    else col.ones++;
  }
}

let gamma = '';
let epsilon = '';

stats.forEach(({ zeros, ones }) => {
  if (zeros > ones) {
    gamma += '0';
    epsilon += '1';
  } else {
    gamma += '1';
    epsilon += '0';
  }
});

const power = parseInt(gamma, 2) * parseInt(epsilon, 2);
console.log('part 1', power);

const rows = input.split('\n');

const splitOnMostCommonDigit = (strs: string[], colIndex: number) => {
  let total = 0;
  const withZero = [];
  const withOne = [];
  for (let i = 0; i < strs.length; i++) {
    total += parseInt(strs[i][colIndex]);
    if (strs[i][colIndex] === '0') withZero.push(strs[i]);
    else withOne.push(strs[i]);
  }
  const mostCommon = Math.round(total / strs.length).toString();
  return { withZero, withOne, mostCommon };
};

let oxGen = [...rows];
let co2 = [...rows];

for (let colIndex = 0; colIndex < rows[0].length; colIndex++) {
  if (oxGen.length > 1) {
    const oxGenSplit = splitOnMostCommonDigit(oxGen, colIndex);
    oxGen = oxGenSplit.mostCommon === '0' ? oxGenSplit.withZero : oxGenSplit.withOne;
  }
  if (co2.length > 1) {
    const co2Split = splitOnMostCommonDigit(co2, colIndex);
    co2 = co2Split.mostCommon === '0' ? co2Split.withOne : co2Split.withZero;
  }
}

const lifeSupport = parseInt(oxGen[0], 2) * parseInt(co2[0], 2);
console.log('part 2', lifeSupport);