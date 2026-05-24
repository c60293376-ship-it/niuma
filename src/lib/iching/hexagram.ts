import type { CastResult } from "./castLines";
import { getHexagramName } from "../../data/hexagrams";

const LINE_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

/** 将六爻值转换为二进制 id（阳=1, 阴=0, 下爻为低位） */
function linesToBinaryId(lines: number[]): number {
  let id = 0;
  for (let i = 0; i < 6; i++) {
    if (lines[i] === 7 || lines[i] === 9) {
      id |= 1 << i;
    }
  }
  return id;
}

/** 获取本卦名称 */
export function getBaseHexagram(lines: number[]): string {
  return getHexagramName(linesToBinaryId(lines));
}

/** 获取变卦名称（动爻翻转后） */
export function getChangedHexagram(lines: number[]): string {
  const changed = lines.map((v) => {
    if (v === 6) return 7; // 老阴 → 少阳（阴变阳）
    if (v === 9) return 8; // 老阳 → 少阴（阳变阴）
    return v;
  });
  return getHexagramName(linesToBinaryId(changed));
}

/** 获取主爻名称 */
export function getPrimaryMovingLine(
  castResult: CastResult,
  seed: number,
): string {
  if (castResult.movingLines.length > 0) {
    return LINE_NAMES[castResult.movingLines[0]];
  }
  // 静卦：取时爻（用 seed 在 0-5 中选一个）
  const i = seed % 6;
  return `${LINE_NAMES[i]}（静卦取时爻）`;
}

/** 获取主爻索引（0-based），用于传给 buildAskResult */
export function getPrimaryMovingLineIndex(
  castResult: CastResult,
  seed: number,
): number {
  if (castResult.movingLines.length > 0) {
    return castResult.movingLines[0];
  }
  return seed % 6;
}
