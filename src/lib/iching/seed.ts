/**
 * 根据 question + scene + timestamp 生成稳定的起卦 seed。
 */
export function createDivinationSeed(
  question: string,
  scene: string,
  timestamp: number,
): number {
  const input = `${question}|${scene}|${timestamp}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}
