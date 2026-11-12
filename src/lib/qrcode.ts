// Pure TypeScript ISO/IEC 18004 QR Code Matrix Generator (Byte mode, ECC Level M / Q)
// Zero external dependencies — renders crisp SVG & Canvas QR codes client-side.

type EccLevel = "M" | "Q";

interface VersionSpec {
  totalCodewords: number;
  ecCodewordsPerBlock: number;
  group1Blocks: number;
  group1DataCodewords: number;
  group2Blocks: number;
  group2DataCodewords: number;
  alignmentPatterns: number[];
}

// Specs for Versions 1..10 at ECC Level M (~15%) and Q (~25%, ideal for center logo)
const VERSION_SPECS: Record<EccLevel, Record<number, VersionSpec>> = {
  M: {
    1: { totalCodewords: 26, ecCodewordsPerBlock: 10, group1Blocks: 1, group1DataCodewords: 16, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [] },
    2: { totalCodewords: 44, ecCodewordsPerBlock: 16, group1Blocks: 1, group1DataCodewords: 28, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 18] },
    3: { totalCodewords: 70, ecCodewordsPerBlock: 26, group1Blocks: 1, group1DataCodewords: 44, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 22] },
    4: { totalCodewords: 100, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 32, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 26] },
    5: { totalCodewords: 134, ecCodewordsPerBlock: 24, group1Blocks: 2, group1DataCodewords: 43, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 30] },
    6: { totalCodewords: 172, ecCodewordsPerBlock: 16, group1Blocks: 4, group1DataCodewords: 27, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 34] },
  },
  Q: {
    1: { totalCodewords: 26, ecCodewordsPerBlock: 13, group1Blocks: 1, group1DataCodewords: 13, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [] },
    2: { totalCodewords: 44, ecCodewordsPerBlock: 22, group1Blocks: 1, group1DataCodewords: 22, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 18] },
    3: { totalCodewords: 70, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 17, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 22] },
    4: { totalCodewords: 100, ecCodewordsPerBlock: 26, group1Blocks: 2, group1DataCodewords: 24, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 26] },
    5: { totalCodewords: 134, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 15, group2Blocks: 2, group2DataCodewords: 16, alignmentPatterns: [6, 30] },
    6: { totalCodewords: 172, ecCodewordsPerBlock: 24, group1Blocks: 4, group1DataCodewords: 19, group2Blocks: 0, group2DataCodewords: 0, alignmentPatterns: [6, 34] },
    7: { totalCodewords: 196, ecCodewordsPerBlock: 18, group1Blocks: 2, group1DataCodewords: 14, group2Blocks: 4, group2DataCodewords: 15, alignmentPatterns: [6, 22, 38] },
  },
};

// GF(256) log/exp tables with primitive polynomial 0x11d
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLen);
  const rem = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0];
    rem.copyWithin(0, 1);
    rem[ecLen - 1] = 0;
    if (factor !== 0) {
      for (let j = 0; j < ecLen; j++) {
        rem[j] ^= gfMul(gen[j + 1], factor);
      }
    }
  }
  return rem;
}

function computeFormatBits(ecc: EccLevel, mask: number): number {
  // Format indicator: M = 00 (0), Q = 11 (3)
  const eccBits = ecc === "M" ? 0 : 3;
  const data = (eccBits << 3) | mask;
  let rem = data << 10;
  const gen = 0x537;
  for (let i = 14; i >= 10; i--) {
    if ((rem >> i) & 1) {
      rem ^= gen << (i - 10);
    }
  }
  return ((data << 10) | rem) ^ 0x5412;
}

export function generateQrMatrix(text: string, ecc: EccLevel = "Q"): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const specs = VERSION_SPECS[ecc];

  let version = 1;
  let spec = specs[1];
  for (let v = 1; v <= 7; v++) {
    const s = specs[v];
    if (!s) continue;
    const totalData =
      s.group1Blocks * s.group1DataCodewords +
      s.group2Blocks * s.group2DataCodewords;
    // Byte mode header is 4 bits mode + 8 bits length = 12 bits (+4 terminator = 2 bytes overhead)
    if (bytes.length + 2 <= totalData) {
      version = v;
      spec = s;
      break;
    }
  }

  const totalDataCodewords =
    spec.group1Blocks * spec.group1DataCodewords +
    spec.group2Blocks * spec.group2DataCodewords;

  // Build bit stream
  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Mode indicator: Byte mode = 0100
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (const b of bytes) {
    pushBits(b, 8);
  }

  // Terminator (up to 4 zero bits)
  const maxBits = totalDataCodewords * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  pushBits(0, termLen);

  // Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataCodewords = new Uint8Array(totalDataCodewords);
  for (let i = 0; i < bits.length / 8; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i * 8 + b];
    }
    dataCodewords[i] = byte;
  }

  // Pad bytes 0xEC, 0x11
  let padToggle = true;
  for (let i = bits.length / 8; i < totalDataCodewords; i++) {
    dataCodewords[i] = padToggle ? 0xec : 0x11;
    padToggle = !padToggle;
  }

  // Split into blocks & compute EC
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let b = 0; b < spec.group1Blocks; b++) {
    const block = dataCodewords.slice(offset, offset + spec.group1DataCodewords);
    offset += spec.group1DataCodewords;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, spec.ecCodewordsPerBlock));
  }
  for (let b = 0; b < spec.group2Blocks; b++) {
    const block = dataCodewords.slice(offset, offset + spec.group2DataCodewords);
    offset += spec.group2DataCodewords;
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, spec.ecCodewordsPerBlock));
  }

  // Interleave data and EC codewords
  const interleaved: number[] = [];
  const maxDataLen = Math.max(spec.group1DataCodewords, spec.group2DataCodewords);
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) interleaved.push(block[i]);
    }
  }
  for (let i = 0; i < spec.ecCodewordsPerBlock; i++) {
    for (const block of ecBlocks) {
      interleaved.push(block[i]);
    }
  }

  const size = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunction = (r: number, c: number, dark: boolean) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    modules[r][c] = dark;
    isFunction[r][c] = true;
  };

  // Finder patterns + separators
  const drawFinder = (topR: number, leftC: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = topR + dr;
        const c = leftC + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunction(r, c, inOuter && (onBorder || inInner));
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  // Alignment patterns
  const align = spec.alignmentPatterns;
  for (const r of align) {
    for (const c of align) {
      if (
        (r === 6 && c === 6) ||
        (r === 6 && c === size - 7) ||
        (r === size - 7 && c === 6)
      ) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunction(r + dr, c + dc, dark);
        }
      }
    }
  }

  // Dark module & reserved format areas
  setFunction(4 * version + 9, 8, true);
  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) setFunction(8, i, false);
    if (!isFunction[i][8]) setFunction(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) setFunction(8, size - 1 - i, false);
    if (!isFunction[size - 1 - i][8]) setFunction(size - 1 - i, 8, false);
  }

  // Place data bits in zigzag
  const allBits: number[] = [];
  for (const cw of interleaved) {
    for (let b = 7; b >= 0; b--) {
      allBits.push((cw >> b) & 1);
    }
  }

  let bitIdx = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!isFunction[r][c]) {
          modules[r][c] = bitIdx < allBits.length ? allBits[bitIdx] === 1 : false;
          bitIdx++;
        }
      }
    }
    upward = !upward;
  }

  const writeFormatBits = (grid: boolean[][], mask: number) => {
    const bits = computeFormatBits(ecc, mask);
    const bit = (i: number) => ((bits >> i) & 1) === 1;

    // Top-left: row 8 (bits 14..7) & col 8 (bits 6..0)
    grid[8][0] = bit(14);
    grid[8][1] = bit(13);
    grid[8][2] = bit(12);
    grid[8][3] = bit(11);
    grid[8][4] = bit(10);
    grid[8][5] = bit(9);
    grid[8][7] = bit(8);
    grid[8][8] = bit(7);

    grid[7][8] = bit(6);
    grid[5][8] = bit(5);
    grid[4][8] = bit(4);
    grid[3][8] = bit(3);
    grid[2][8] = bit(2);
    grid[1][8] = bit(1);
    grid[0][8] = bit(0);

    // Bottom-left col 8 (bits 14..8) + dark module
    grid[size - 1][8] = bit(14);
    grid[size - 2][8] = bit(13);
    grid[size - 3][8] = bit(12);
    grid[size - 4][8] = bit(11);
    grid[size - 5][8] = bit(10);
    grid[size - 6][8] = bit(9);
    grid[size - 7][8] = bit(8);
    grid[size - 8][8] = true;

    // Top-right row 8 (bits 7..0)
    grid[8][size - 8] = bit(7);
    grid[8][size - 7] = bit(6);
    grid[8][size - 6] = bit(5);
    grid[8][size - 5] = bit(4);
    grid[8][size - 4] = bit(3);
    grid[8][size - 3] = bit(2);
    grid[8][size - 2] = bit(1);
    grid[8][size - 1] = bit(0);
  };

  const maskFn = (mask: number, r: number, c: number): boolean => {
    switch (mask) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      default: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    }
  };

  const scoreGrid = (grid: boolean[][]): number => {
    let penalty = 0;
    for (let r = 0; r < size; r++) {
      let runLen = 1;
      for (let c = 1; c < size; c++) {
        if (grid[r][c] === grid[r][c - 1]) {
          runLen++;
          if (runLen === 5) penalty += 3;
          else if (runLen > 5) penalty += 1;
        } else {
          runLen = 1;
        }
      }
    }
    for (let c = 0; c < size; c++) {
      let runLen = 1;
      for (let r = 1; r < size; r++) {
        if (grid[r][c] === grid[r - 1][c]) {
          runLen++;
          if (runLen === 5) penalty += 3;
          else if (runLen > 5) penalty += 1;
        } else {
          runLen = 1;
        }
      }
    }
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size - 1; c++) {
        const v = grid[r][c];
        if (grid[r][c + 1] === v && grid[r + 1][c] === v && grid[r + 1][c + 1] === v) {
          penalty += 3;
        }
      }
    }
    return penalty;
  };

  let bestMask = 0;
  let bestScore = Infinity;
  let bestGrid = modules;

  for (let m = 0; m < 8; m++) {
    const candidate = modules.map((row, r) =>
      row.map((val, c) => (!isFunction[r][c] && maskFn(m, r, c) ? !val : val)),
    );
    writeFormatBits(candidate, m);
    const sc = scoreGrid(candidate);
    if (sc < bestScore) {
      bestScore = sc;
      bestMask = m;
      bestGrid = candidate;
    }
  }

  writeFormatBits(bestGrid, bestMask);
  return bestGrid;
}
