type Instr = [string, number];

const parseInput = (input: string): Instr[] => {
  return input.split('\n').map(line => {
    const [command, value] = line.split(' ');
    return [command, parseInt(value)];
  });
};

const move = (instrs: Instr[]): [number, number] => {
  let distance = 0;
  let depth = 0;
  instrs.forEach(instr => {
    const [command, value] = instr;
    switch (command) {
      case 'down':
        depth += value;
        break;
      case 'up':
        depth -= value;
        break;
      case 'forward':
        distance += value;
        break;
    }
  });
  return [distance, depth];
};

const move2 = (instrs: Instr[]): [number, number] => {
  let distance = 0;
  let depth = 0;
  let aim = 0;
  instrs.forEach(instr => {
    const [command, value] = instr;
    switch (command) {
      case 'down':
        aim += value;
        break;
      case 'up':
        aim -= value;
        break;
      case 'forward':
        distance += value;
        depth += aim * value;
        break;
    }
  });
  return [distance, depth];
};

(async () => {
  const input = await Deno.readTextFile('./input.txt');

  const instrs = parseInput(input);
  const [distance, depth] = move(instrs);
  console.log('part 1', distance * depth);

  const [distance2, depth2] = move2(instrs);
  console.log('part 2', distance2 * depth2);
})();