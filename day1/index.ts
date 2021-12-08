(async () => {
  const input = await Deno.readTextFile('./input.txt');

  const depths = input.split('\n').map(n => parseInt(n));

  let increases = 0;
  depths.reduce((prev, curr) => {
    if (curr > prev) increases++;
    return curr;
  });
  
  console.log('part 1', increases);

  increases = 0;
  let prevSum = Infinity;
  for (let w = 0; w <= depths.length - 3; w++) {
    const sum = depths[w] + depths[w+1] + depths[w+2];
    if (sum > prevSum) increases++;
    prevSum = sum;
  }

  console.log('part2', increases);
})();