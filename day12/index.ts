const input = Deno.readTextFileSync('./input.txt');

const parsePath = (row: string): [string, string] => {
  return row.split('-') as [string, string];
};

const graph: Map<string, string[]> = input.split('\n').map(parsePath).reduce((graph, [start, end]) => {
  if (!graph.has(start)) graph.set(start, []);
  if (!graph.has(end)) graph.set(end, []);
  graph.set(start, graph.get(start).concat(end));
  graph.set(end, graph.get(end).concat(start));
  return graph;
}, new Map());

const getRoutes = (from: string, visited: Map<string, number> = new Map()): string[][] => {
  if (from === 'end') return [['end']];
  const options = graph.get(from) as string[];
  let routes: string[][] = [];
  options.sort().filter(option => {
    if (option === 'start') return false;
    const smallCave= /[a-z]/.test(option);
    const visitedTwice = !![...visited.entries()].filter(([k,n]) => /[a-z]/.test(k) && n > 1).length;
    return !(smallCave && visitedTwice && visited.has(option))
  }).forEach(option => {
    const newVisited: Map<string, number> = new Map(visited);
    newVisited.set(option, (visited.get(option) || 0) + 1);
    routes = routes.concat(getRoutes(option, newVisited).map((route: string[]): string[] => [from].concat(...route)));
  });

  return routes;
};

const routes = getRoutes('start');

console.log('num routes', routes.length);