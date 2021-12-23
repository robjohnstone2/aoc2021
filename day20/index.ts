const input = Deno.readTextFileSync('./input.txt');

const [algo, inputImageStr] = input.split('\n\n');

class Image {
  data: Map<string, string> = new Map();
  minX = 0;
  maxX: number;
  minY = 0;
  maxY: number;
  steps = 0;

  constructor(inputImageStr: string) {
    const rows = inputImageStr.split('\n');
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[0].length; x++) {
        this.data.set(JSON.stringify([ x, y ]), rows[y][x]);
      }
    }

    this.maxX = rows[0].length - 1;
    this.maxY = rows.length - 1;
  }

  outputForPixel(x: number, y: number): string {
    const data = this.data;
    const binary: string = [
      [x - 1, y - 1],
      [x,     y - 1],
      [x + 1, y - 1],
      [x - 1, y    ],
      [x,     y    ],
      [x + 1, y    ],
      [x - 1, y + 1],
      [x,     y + 1],
      [x + 1, y + 1]
    ].reduce((binary: string, coord: number[]): string => {
      if (!this.data.has(JSON.stringify(coord))) {
        if (this.steps % 2 === 0) {
          return binary + '0';
        } else {
          return binary + (algo[0] === '.' ? '0' : '1');
        }
      }
      return binary + (data.get(JSON.stringify(coord)) === '#' ? '1' : '0')
    }, '');
    if (binary.length !== 9) console.log('invalid length binary', binary);
    if (typeof algo[parseInt(binary, 2)] === 'undefined') console.log('out of bounds?');

    return algo[parseInt(binary, 2)];
  }

  iterate() {
    const outputData: Map<string, string> = new Map();
    for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
      for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
        outputData.set(JSON.stringify([ x, y ]), this.outputForPixel(x, y));
      }
    }

    this.data = outputData;
    this.minX--;
    this.maxX++;
    this.minY--;
    this.maxY++;
    this.steps++;
  }

  draw() {
    console.log('');
    for (let y = this.minY; y <= this.maxY; y++) {
      let row = '';
      for (let x = this.minX; x <= this.maxX; x++) {
        row += this.data.get(JSON.stringify([x,y]));
      }
      console.log(row);
    }
    console.log('');
  }

  getNumLit(): number {
    return [...this.data.values()].filter(l => l === '#').length;
  }
}

const image = new Image(inputImageStr);

for (let i = 0; i < 50; i++) {
  image.iterate();
}

console.log('num lit', image.getNumLit());