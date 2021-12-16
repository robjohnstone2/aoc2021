const input = Deno.readTextFileSync('./input.txt');

type Packet = Literal | Operator;

type Literal = {
  version: number,
  typeId: number,
  value: number
};

type Operator = {
  version: number,
  typeId: number,
  lengthTypeId: string,
  subPackets: Packet[]
};

const toBinary = (hex: string): string => {
  let binary = '';
  while (hex.length) {
    const pair = hex.slice(0, 2);
    hex = hex.slice(2);
    binary += parseInt(pair, 16).toString(2).padStart(8, '0');
  }
  return binary;
};

const binary = toBinary(input);

const parse = (binary: string): { packet: Packet, remainder: string } => {

  const take = (n: number): string => {
    const result = binary.slice(0, n);
    binary = binary.slice(n);
    return result;
  }

  const version = parseInt(take(3), 2);
  const typeId = parseInt(take(3), 2);

  if (typeId === 4) {
    let numBin = '';
    while (true) {
      const nextChunk = take(5);
      numBin += nextChunk.slice(1);
      if (nextChunk[0] === '0') break;
    }
    const value = parseInt(numBin, 2);

    const packet = {
      version,
      typeId,
      value
    };

    return { packet, remainder: binary };
  }

  const subPackets: Packet[] = [];
  const lengthTypeId = take(1);
  if (lengthTypeId === '0') {
    const lengthBin = take(15);
    const length = parseInt(lengthBin, 2);
    let subPacketsBin = take(length);
    while (subPacketsBin.length) {
      const { packet, remainder } = parse(subPacketsBin);
      subPackets.push(packet);
      subPacketsBin = remainder;
    }

  } else {
    const numSubPackets = parseInt(take(11), 2);
    for (let i = 0; i < numSubPackets; i++) {
      const { packet, remainder } = parse(binary);
      subPackets.push(packet);
      binary = remainder;
    }
  }

  const packet = {
    version,
    typeId,
    lengthTypeId,
    subPackets
  };

  return { packet, remainder: binary };
};

const { packet } = parse(binary);

const addVersions = (packet: Packet): number => {
  const operator = packet as Operator;
  if (typeof operator.subPackets === 'undefined') return operator.version;
  return operator.version + operator.subPackets.reduce((total, subPacket) => total + addVersions(subPacket), 0);
};

console.log('part 1', addVersions(packet));

const evaluate = (packet: Packet): number => {
  if (packet.typeId === 4) return (packet as Literal).value;

  const operator = packet as Operator;
  switch (operator.typeId) {
    case 0:
      // sum
      return operator.subPackets.reduce((total, subPacket) => total + evaluate(subPacket), 0);
    case 1:
      // product
      return operator.subPackets.reduce((total, subPacket) => total * evaluate(subPacket), 1);
    case 2:
      // min
      return Math.min(...operator.subPackets.map(p => evaluate(p)));
    case 3:
      // max
      return Math.max(...operator.subPackets.map(p => evaluate(p)));
    case 5:
      // greater than
      return evaluate(operator.subPackets[0]) > evaluate(operator.subPackets[1]) ? 1 : 0
    case 6:
      // less than
      return evaluate(operator.subPackets[0]) < evaluate(operator.subPackets[1]) ? 1 : 0
    case 7:
      // equal to
      return evaluate(operator.subPackets[0]) === evaluate(operator.subPackets[1]) ? 1 : 0
  }
  throw `invalid typeId: ${operator.typeId}`;
};

console.log('part 2', evaluate(packet));

