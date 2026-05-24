export interface CastResult {
  /** 六爻值（从下爻到上爻）：6=老阴, 7=少阳, 8=少阴, 9=老阳 */
  lines: number[];
  /** 动爻位置（0-based，从下爻起） */
  movingLines: number[];
}

/** 简单的 seeded PRNG（LCG） */
function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** 模拟三枚钱起一爻 */
function castLine(rand: () => number): number {
  let heads = 0;
  for (let i = 0; i < 3; i++) {
    if (rand() > 0.5) heads++;
  }
  if (heads === 3) return 9; // 老阳（动爻）
  if (heads === 2) return 7; // 少阳（静爻）
  if (heads === 1) return 8; // 少阴（静爻）
  return 6; // 老阴（动爻）
}

/** 用户手动掷一爻（非确定性，使用 Math.random） */
export function castSingleLine(): number {
  let heads = 0;
  for (let i = 0; i < 3; i++) {
    if (Math.random() > 0.5) heads++;
  }
  if (heads === 3) return 9;
  if (heads === 2) return 7;
  if (heads === 1) return 8;
  return 6;
}

/**
 * 模拟三枚钱六次起卦，从下爻到上爻依次得出。
 */
export function castSixLines(seed: number): CastResult {
  const rand = seededRandom(seed);
  const lines: number[] = [];
  const movingLines: number[] = [];

  for (let i = 0; i < 6; i++) {
    const value = castLine(rand);
    lines.push(value);
    if (value === 6 || value === 9) {
      movingLines.push(i);
    }
  }

  return { lines, movingLines };
}
