/** 空间图像 AI 分析结果 */
export interface SpaceVisionAnalysis {
  /** 空间类型推测 */
  spaceType?: string;
  /** 杂乱程度 */
  clutterLevel?: "low" | "medium" | "high";
  /** 光线水平 */
  lightLevel?: "low" | "medium" | "high";
  /** 背后支撑感 */
  backSupport?: "weak" | "normal" | "strong" | "unknown";
  /** 前方开阔度 */
  frontOpen?: "blocked" | "normal" | "open" | "unknown";
  /** 是否有头顶压迫 */
  overheadPressure?: boolean;
  /** 是否可见镜子 */
  mirrorVisible?: boolean;
  /** 门冲/窗冲 */
  doorWindowRush?: "possible" | "no" | "unknown";
}

/**
 * 分析空间图像（第一版为 mock，预留 AI 识图接口）
 *
 * 后续接入 AI 图像识别时，只需替换此函数体，
 * 保持入参和返回类型不变即可。
 */
export async function analyzeSpaceImage(
  imageUrl: string,
): Promise<SpaceVisionAnalysis> {
  void imageUrl;
  // TODO: 后续接入 AI 图像识别模型
  // 目前返回空结果，由 buildSpaceFengshuiResult 自行规则生成
  return {};
}
