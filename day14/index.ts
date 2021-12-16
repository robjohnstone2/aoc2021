const input = Deno.readTextFileSync('./input.txt');

const [template, rulesInput] = input.split('\n\n');

const rules: Map<string, string> = rulesInput.split('\n').reduce((rules: Map<string, string>, row: string) => {
  const [_, key, out] = row.match(/(\w+)\s->\s(\w+)/) as string[];
  rules.set(key, out);
  return rules;
}, new Map());

const mergeMaps = (map1: Map<string, number>, map2: Map<string, number>): Map<string, number> => {
  const result: Map<string, number> = new Map(map2.entries());
  for (const [k, v] of map1.entries()) {
    result.set(k, (result.get(k) || 0) + v);
  }
  return result;
};

const cache: Map<string, Map<string, number>> = new Map();

const expand = (pair: string, steps: number): Map<string, number> => {
  if (cache.has(pair + steps)) return cache.get(pair + steps) as Map<string, number>;
  let counts: Map<string, number> = new Map();
  if (pair.length > 2) {
    for (let i = 0; i < pair.length - 1; i++) {
      counts = mergeMaps(expand(pair[i] + pair[i + 1], steps), counts);
      if (i !== 0) {
        counts.set(pair[i], (counts.get(pair[i]) as number) - 1);
      }
    }
  } else if (steps === 0) {
    counts.set(pair[0], 1);
    counts.set(pair[1], (counts.get(pair[1]) || 0) + 1);
  } else {
    const newChar = rules.get(pair) as string;
    counts = mergeMaps(
      expand(pair[0] + newChar, steps - 1), expand(newChar + pair[1], steps - 1)
    );
    counts.set(newChar, (counts.get(newChar) as number) - 1);
  }
  cache.set(pair + steps, counts);
  return counts;
};

const counts: Map<string, number> = expand(template, 40);
const max = Math.max(...counts.values());
const min = Math.min(...counts.values());
console.log('result', max - min);