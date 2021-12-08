const input = Deno.readTextFileSync('./input.txt');

const rows = input.split('\n');

type Entry = { signals: string[], outputs: string[] }
const parsed: Entry[] = rows.map(row => {
  const [ signals, encodedOutputs ] = row.split(' | ');
  return {
    signals: signals.split(' '),
    outputs: encodedOutputs.split(' ')
  };
});

const part1 = parsed.reduce((total, { outputs }) =>
  total + outputs.filter(output => output.length === 2 || output.length === 4 || output.length === 3 || output.length === 7).length, 0);

console.log('part1', part1);

const correctSignalPatterns = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg',
]


const getFrequencies = (patterns: string[]): Map<string, number> => {
  const frequencies: Map<string, number> = new Map();
  patterns.forEach(pattern => {
    pattern.split('').forEach(char => {
      frequencies.set(char, (frequencies.get(char) || 0) + 1);
    });
  });
  return frequencies;
};

const decodeEntry = (entry: Entry): number => {
  const mapping: Map<string, string> = new Map();
  const mangledFrequencies = getFrequencies(entry.signals);
  const keys = Array.from(mangledFrequencies.keys());
  mapping.set('b', keys.find(char => mangledFrequencies.get(char) === 6) as string);
  mapping.set('e', keys.find(char => mangledFrequencies.get(char) === 4) as string);
  mapping.set('f', keys.find(char => mangledFrequencies.get(char) === 9) as string);

  const signal1 = entry.signals.find(s => s.length === 2) as string;
  mapping.set('c', signal1.split('').find(char => char !== mapping.get('f')) as string);

  const signal7 = entry.signals.find(s => s.length === 3) as string;
  mapping.set('a', signal7.split('').find(char => !Array.from(mapping.values()).includes(char)) as string);

  const signal4 = entry.signals.find(s => s.length === 4) as string;
  mapping.set('d', signal4.split('').find(char => !Array.from(mapping.values()).includes(char)) as string);

  const signal8 = entry.signals.find(s => s.length === 7) as string;
  mapping.set('g', signal8.split('').find(char => !Array.from(mapping.values()).includes(char)) as string);

  const encodedDigits = correctSignalPatterns.map(pattern => {
    return pattern.split('').map(c => mapping.get(c)).sort().join('');
  });

  return parseInt(entry.outputs.map(code => encodedDigits.indexOf(code.split('').sort().join('')).toString()).join(''));
}

const part2 = parsed.reduce((total, entry) => total + decodeEntry(entry), 0);
console.log('part2', part2);