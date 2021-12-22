// This works but is clearly much slower than intended (~10 minutes). Not sure what the "correct" approach is!

const input = Deno.readTextFileSync('./input.txt');

type Coord = [number, number, number];

type Scanner = {
  id: number,
  beacons: Coord[]
};

const parseScanner = (str: string): Scanner => {
  const rows = str.split('\n');
  const [ idStr ] = rows[0].match(/(\d+)/) as string[];
  const beaconInputs = rows.slice(1);
  const beacons = beaconInputs.map((str: string) => str.split(',').map(n => parseInt(n)));
  return {
    id: parseInt(idStr),
    beacons: (beacons as Coord[])
  };
};

const scanners = input.split('\n\n').map(parseScanner);

type Rotation = (coord: Coord) => Coord;

const rotations: Rotation[] = [
  // facing in z direction
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-y, x, z],

  // facing in -z direction
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [y, x, -z],

  // facing in x direction
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [z, x, y],

  // facing in -x direction
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, -y, -x],
  ([x, y, z]) => [-z, x, -y],

  // facing in y direction
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-y, z, -x],

  // facing in -y direction
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-x, -z, -y],
];

const findPossibleXCoords = (scannerA: Scanner, scannerALoc: Coord, scannerB: Scanner, numOverlap: number, rotation: (coord: Coord) => Coord): { x: number, beacons: number[] }[] => {
  // possible xCoords of scannerB relative to scannerA
  const results: { x: number, beacons: number[] }[] = [];
  for (let x = scannerALoc[0] - 2000; x <= scannerALoc[0] + 2000; x++) {
    const aBeaconsX = scannerA.beacons.map(b => b[0]);
    const bBeaconsRelativeToA = scannerB.beacons.map(rotation).map(beacon => beacon[0] + x) as number[];
    const overlapping: number[] = [];
    bBeaconsRelativeToA.forEach(b => aBeaconsX.includes(b) && overlapping.push(b));
    if (overlapping.length >= numOverlap) {
      results.push({
        x,
        beacons: overlapping
      }); }
  }
  return results;
};

const findPossibleYCoords = (scannerA: Scanner, scannerALoc: Coord, scannerB: Scanner, numOverlap: number, rotation: (coord: Coord) => Coord): { y: number, beacons: number[] }[] => {
  // possible yCoords of scannerB relative to scannerA
  const results: { y: number, beacons: number[] }[] = [];
  for (let y = scannerALoc[1] - 2000; y <= scannerALoc[1] + 2000; y++) {
    const aBeaconsY = scannerA.beacons.map(b => b[1]);
    const bBeaconsRelativeToA = scannerB.beacons.map(rotation).map(beacon => beacon[1] + y) as number[];
    const overlapping: number[] = [];
    bBeaconsRelativeToA.forEach(b => aBeaconsY.includes(b) && overlapping.push(b));
    if (overlapping.length >= numOverlap) {
      results.push({
        y,
        beacons: overlapping
      }); }
  }
  return results;
};

const findPossibleZCoords = (scannerA: Scanner, scannerALoc: Coord, scannerB: Scanner, numOverlap: number, rotation: (coord: Coord) => Coord): { z: number, beacons: number[] }[] => {
  // possible zCoords of scannerB relative to scannerA
  const results: { z: number, beacons: number[] }[] = [];
  for (let z = scannerALoc[2] - 2000; z <= scannerALoc[2] + 2000; z++) {
    const aBeaconsZ = scannerA.beacons.map(b => b[2]);
    const bBeaconsRelativeToA = scannerB.beacons.map(rotation).map(beacon => beacon[2] + z) as number[];
    const overlapping: number[] = [];
    bBeaconsRelativeToA.forEach(b => aBeaconsZ.includes(b) && overlapping.push(b));
    if (overlapping.length >= numOverlap) {
      results.push({
        z,
        beacons: overlapping
      }); }
  }
  return results;
};

const findRelPositions = (scannerA: Scanner, scannerALoc: Coord, scannerB: Scanner, numOverlap: number): { coord: Coord, rotation: number }[] => {
  const orientations: { coord: Coord, rotation: number }[] = [];
  for (let r = 0; r < rotations.length; r++) {
    const rotation = rotations[r];
    const candidateXPositions = findPossibleXCoords(scannerA, scannerALoc, scannerB, numOverlap, rotation);
    const candidateYPositions = findPossibleYCoords(scannerA, scannerALoc, scannerB, numOverlap, rotation);
    const candidateZPositions = findPossibleZCoords(scannerA, scannerALoc, scannerB, numOverlap, rotation);
    for (let i = 0; i < candidateXPositions.length; i++) {
      for (let j = 0; j < candidateYPositions.length; j++) {
        for (let k = 0; k < candidateZPositions.length; k++) {
          const x = candidateXPositions[i].x;
          const y = candidateYPositions[j].y;
          const z = candidateZPositions[k].z;
          const beacons = new Set([...scannerA.beacons.map(b => JSON.stringify(b)), ...scannerB.beacons.map(b => JSON.stringify({ x: b[0] - x, y: b[1] - y, z: b[2] - z }))]);
          if (beacons.size >= numOverlap) orientations.push({ coord: [ x, y, z ], rotation: r });
        }
      }
    }
  }
  return orientations;
};

const transformScanner = (scanner: Scanner, coord: Coord, rotation: number): Scanner => {
  return {
    id: scanner.id,
    beacons: scanner.beacons.map(b => rotations[rotation](b)).map(b => [b[0] + coord[0], b[1] + coord[1], b[2] + coord[2]])
  }
};

const scannerLocations: {scanner: Scanner, coord: Coord, rotation: number, transformedScanner: Scanner }[] = [];

const [ scanner0, ...remainingScanners ] = scanners;
scannerLocations.push({ scanner: scanner0, coord: [0,0,0], rotation: 0, transformedScanner: scanner0 });

while (remainingScanners.length) {
  const nextScanner = remainingScanners.shift() as Scanner;
  const matches: Set<string> = new Set();
  for (let i = 0; i < scannerLocations.length; i++) {
    const { transformedScanner, coord } = scannerLocations[i];
    const relPositions = findRelPositions(transformedScanner, coord, nextScanner, 12);
    if (relPositions.length) {
      relPositions.forEach(({ coord, rotation }) => {
        matches.add(JSON.stringify({ scanner: nextScanner, coord, rotation }));
      });
    }
  }

  if (matches.size === 1) {
    const { scanner, coord, rotation } = JSON.parse([...matches.values()][0])
    console.log(`Scanner ${scanner.id} at ${coord} rotation ${rotation}`);
    scannerLocations.push({
      scanner: scanner,
      coord,
      rotation,
      transformedScanner: transformScanner(scanner, coord, rotation)
    });
  } else if (remainingScanners.length) {
    remainingScanners.push(nextScanner);
  }
}

const beacons: Set<string> = new Set();
scannerLocations.forEach(({ transformedScanner }) => {
  transformedScanner.beacons.forEach(b => {
    beacons.add(JSON.stringify(b));
  });
});

console.log('num beacons', beacons.size);

let maxDistance = 0;

const manhatten = (coord1: Coord, coord2: Coord): number =>
  Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]) + Math.abs(coord1[2] - coord2[2]);

for (let i = 0; i < scannerLocations.length; i++) {
  for (let j = 0; j < scannerLocations.length; j++) {
    const dist = manhatten(scannerLocations[i].coord, scannerLocations[j].coord);
    if (dist > maxDistance) maxDistance = dist;
  }
}

console.log('Max distance', maxDistance);