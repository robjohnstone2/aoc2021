const input = Deno.readTextFileSync('./input.txt');

const numbers = input.split('\n');

const findExplodePair = (num: string): { start: number, end: number } => {
  let depth = 0;
  let start = -1;
  let end = -1;
  for (let i = 0; i < num.length; i++) {
    const next = num[i];
    if (next === '[') {
      depth++;
      if (depth === 5 && start === -1) start = i;
    } else if (next === ']') {
      depth--;
      if (end === -1 && start !== -1 && depth === 4) {
        end = i;
        break;
      }
    }
  }
  return {
    start,
    end
  };
};

const split = (str: string): string => {
  const match = str.match(/\d{2,}/);
  if (match === null) return str;
  const start = match.index as number;
  const end = start + match[0].length - 1;
  const before = str.slice(0, start);
  const after = str.slice(end + 1);
  const n = parseInt(match[0]);
  const result = n >= 10 ? `[${Math.floor(n / 2)},${Math.ceil(n / 2)}]` : n.toString();
  return before + result + after;
};

const reduce = (num: string): string => {
  while (true) {
    const { start, end } = findExplodePair(num);
    const canSplit = /\d{2,}/.test(num);
    if (start !== -1) {
      let before = num.slice(0, start);
      const pair = JSON.parse(num.slice(start, end + 1));
      let after = num.slice(end + 1);
      const leftMatches = [...before.matchAll(/(\d+)/g)];
      const leftDigit = leftMatches[leftMatches.length - 1];
      if (leftDigit) {
        const start = leftDigit.index as number;
        const end = start + leftDigit[0].length - 1;
        before = before.slice(0, start) + (parseInt(before.slice(start, end + 1)) + pair[0]) + before.slice(end + 1);
      }
      const rightDigit = [...after.matchAll(/(\d+)/g)][0];
      if (rightDigit) {
        const start = rightDigit.index as number;
        const end = start + rightDigit[0].length - 1;
        after = after.slice(0, start) + (parseInt(after.slice(start, end + 1)) + pair[1]) + after.slice(end + 1);
      }
      num = before + '0' + after;
    } else if (canSplit) {
      num = split(num);
    } else {
      break;
    }
  }
  return num;
};

const add = (...nums: string[]): string => {
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) {
    const num0 = JSON.parse(nums[0]);
    const num1 = JSON.parse(nums[1]);
    if (typeof num0 === 'number' && typeof num1 === 'number') return (num0 + num1).toString();
    return reduce(`[${nums[0]},${nums[1]}]`);
  }
  return add(add(nums[0], nums[1]), ...nums.slice(2));
};

const total = numbers.reduce((total, n) => add(total, n));

const magnitude = (str: string): number => {
  const parsed = JSON.parse(str);
  if (typeof parsed === 'number') return parsed;
  else return 3 * magnitude(JSON.stringify(parsed[0])) + 2 * magnitude(JSON.stringify(parsed[1]));
};

console.log('part 1', magnitude(total));

let highestMagnitude = 0;

for (let i = 0; i < numbers.length; i++) {
  for (let j = 0; j < numbers.length; j++) {
    if (i !== j) {
      const result = magnitude(add(numbers[i], numbers[j]));
      if (result > highestMagnitude) highestMagnitude = result;
    }
  }
}

console.log('part 2', highestMagnitude);