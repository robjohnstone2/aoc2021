const startingPositions: [number, number] = [7, 10];
const positions = [...startingPositions];
const scores = [0, 0];

const deterministicDie = (() => {
  let value = 1;
  return () => value++;
})();

const turn = (currentPos: number): number => {
  const roll = deterministicDie() + deterministicDie() + deterministicDie();
  let newPos = (currentPos + roll) % 10
  if (newPos === 0) newPos = 10;
  return newPos;
};

let i = 0;
while (scores[0] < 1000 && scores[1] < 1000) {
  const newPos = turn(positions[i]);
  positions[i] = newPos;
  scores[i] += newPos;
  i = (i + 1) % 2;
}

const timesRolled = deterministicDie() - 1;

console.log('part 1', Math.min(...scores) * timesRolled);

const getPossibleRolls = (): number[] => {
  const result = [];
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        result.push(i + j + k);
      }
    }
  }
  return result;
};
const freqTable: Map<number, number> = getPossibleRolls().reduce((acc, roll) => {
  acc.set(roll, (acc.get(roll) || 0) + 1);
  return acc;
}, new Map());

const possibleRolls = [...freqTable.keys()];

const cache: Map<string, [number, number]> = new Map();
const simulate = (positions: [number, number], i = 0, scores: [number, number] = [0,0]): [number, number] => {
  const cacheKey = JSON.stringify({ positions, i, scores });
  if (cache.has(cacheKey)) return cache.get(cacheKey) as [number, number];
  const wins: [number, number] = [ 0, 0 ];
  possibleRolls.forEach(roll => {
    let newPos = (positions[i] + roll) % 10;
    if (newPos === 0) newPos = 10;
    const newPositions: [number, number] = [...positions];
    newPositions[i] = newPos;
    const newScore = scores[i] + newPos;
    const newScores: [number, number] = [...scores];
    newScores[i] = newScore;
    const freq = freqTable.get(roll) as number;
    if (newScore >= 21) {
      wins[i] += freq;
    } else {
      const [player0Wins, player1Wins] = simulate(newPositions, (i + 1) % 2, newScores);
      wins[0] += freq * player0Wins;
      wins[1] += freq * player1Wins;
    }
  });
  cache.set(cacheKey, wins);
  return wins;
};

const wins = simulate(startingPositions);

console.log('part 2', Math.max(...wins));