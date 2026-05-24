import { useEffect, useState, useCallback } from "react";
import SpaceUploadCard from "../components/SpaceUploadCard";
import SpaceQuestionSheet from "../components/SpaceQuestionSheet";
import SpaceResultSheet from "../components/SpaceResultSheet";
import { buildSpaceFengshuiResult } from "../utils/buildSpaceFengshuiResult";
import { basicQuestionFlow, deepQuestionFlow } from "../data/rentalQuestionFlow";
import type { SpaceFengshuiResult, BasicAnswers, DeepAnswers, AnalysisDepth, RentalMode } from "../data/spaceFengshuiReadings";
import { defaultBasicAnswers, defaultDeepAnswers } from "../data/spaceFengshuiReadings";

/* ==================== 页面组件 ==================== */

const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  marginLeft: -20,
  marginRight: -20,
  marginTop: 0,
  marginBottom: -92,
  padding: "clamp(286px, 66vw, 318px) 20px 104px",
  backgroundImage: "url('/assets/space-page-bg.png')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center -86px",
  backgroundSize: "100% calc(100% + 86px)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

interface SpacePageProps {
  onQuestionStepChange?: (isQuestionStep: boolean) => void;
}

export default function SpacePage({ onQuestionStepChange }: SpacePageProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [basicAnswers, setBasicAnswers] = useState<BasicAnswers>({ ...defaultBasicAnswers });
  const [deepAnswers, setDeepAnswers] = useState<DeepAnswers>({ ...defaultDeepAnswers });
  const [analysisDepth, setAnalysisDepth] = useState<AnalysisDepth>("basic");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [result, setResult] = useState<SpaceFengshuiResult | null>(null);
  const [basicSheetOpen, setBasicSheetOpen] = useState(false);
  const [deepSheetOpen, setDeepSheetOpen] = useState(false);
  const [resultSheetOpen, setResultSheetOpen] = useState(false);

  useEffect(() => {
    onQuestionStepChange?.(basicSheetOpen || deepSheetOpen || resultSheetOpen);
    return () => onQuestionStepChange?.(false);
  }, [basicSheetOpen, deepSheetOpen, resultSheetOpen, onQuestionStepChange]);

  const handleImageChange = useCallback(
    (file: File | null, url: string | null) => {
      setImage(file);
      setImageUrl(url);
      setHint("");
      setResult(null);
      setAnalysisDepth("basic");
      setBasicSheetOpen(false);
      setDeepSheetOpen(false);
      setResultSheetOpen(false);
    },
    [],
  );

  /** 轻量问诊 → 生成基础报告 */
  const doBasicAnalyze = useCallback(
    (imgUrl: string, basic: BasicAnswers) => {
      setLoading(true);
      setTimeout(() => {
        const generated = buildSpaceFengshuiResult({
          imageUrl: imgUrl,
          spaceType: basic.spaceType,
          answers: { backSupport: "不确定", frontView: "不确定", lightLevel: "不确定", mainIssue: "还挺舒服" },
          analysisDepth: "basic",
          basicAnswers: basic,
          timestamp: Date.now(),
        });
        setResult(generated);
        setAnalysisDepth("basic");
        setLoading(false);
        setBasicSheetOpen(false);
        setResultSheetOpen(true);
      }, 1500);
    },
    [],
  );

  const handleBasicSubmit = useCallback(() => {
    if (!image || !imageUrl) {
      setHint("先上传一张房间照片");
      return;
    }
    setHint("");
    doBasicAnalyze(imageUrl, basicAnswers);
  }, [image, imageUrl, basicAnswers, doBasicAnalyze]);

  /** 深度解析 → 更新为深度报告 */
  const doDeepAnalyze = useCallback(
    (imgUrl: string, basic: BasicAnswers, deep: DeepAnswers) => {
      setDeepLoading(true);
      setTimeout(() => {
        const generated = buildSpaceFengshuiResult({
          imageUrl: imgUrl,
          spaceType: basic.spaceType,
          answers: { backSupport: "不确定", frontView: "不确定", lightLevel: "不确定", mainIssue: "还挺舒服" },
          analysisDepth: "deep",
          basicAnswers: basic,
          deepAnswers: deep,
          timestamp: Date.now(),
        });
        setResult(generated);
        setAnalysisDepth("deep");
        setDeepLoading(false);
        setDeepSheetOpen(false);
        setResultSheetOpen(true);
      }, 1500);
    },
    [],
  );

  const handleDeepSubmit = useCallback(() => {
    if (!imageUrl) return;
    doDeepAnalyze(imageUrl, basicAnswers, deepAnswers);
  }, [imageUrl, basicAnswers, deepAnswers, doDeepAnalyze]);

  const handleOpenDeepSheet = useCallback(() => {
    setResultSheetOpen(false);
    setDeepSheetOpen(true);
  }, []);

  /** 再看一次（保留当前深度） */
  const handleRetry = useCallback(() => {
    if (!imageUrl) return;
    setHint("");
    setLoading(true);
    setTimeout(() => {
      const generated = buildSpaceFengshuiResult({
        imageUrl: imageUrl!,
        spaceType: basicAnswers.spaceType,
        answers: { backSupport: "不确定", frontView: "不确定", lightLevel: "不确定", mainIssue: "还挺舒服" },
        analysisDepth,
        basicAnswers,
        deepAnswers: analysisDepth === "deep" ? deepAnswers : undefined,
        timestamp: Date.now(),
      });
      setResult(generated);
      setLoading(false);
    }, 1500);
  }, [imageUrl, basicAnswers, deepAnswers, analysisDepth]);

  const handleOpenBasicSheet = useCallback(() => {
    if (!image || !imageUrl) {
      setHint("先上传一张房间照片");
      return;
    }
    setHint("");
    setBasicSheetOpen(true);
  }, [image, imageUrl]);

  const handleReset = useCallback(() => {
    setImage(null);
    setImageUrl(null);
    setBasicAnswers({ ...defaultBasicAnswers });
    setDeepAnswers({ ...defaultDeepAnswers });
    setAnalysisDepth("basic");
    setResult(null);
    setHint("");
    setBasicSheetOpen(false);
    setDeepSheetOpen(false);
    setResultSheetOpen(false);
  }, []);

  const handleCloseBasicSheet = useCallback(() => setBasicSheetOpen(false), []);
  const handleCloseDeepSheet = useCallback(() => setDeepSheetOpen(false), []);
  const handleCloseResultSheet = useCallback(() => setResultSheetOpen(false), []);

  // 将 basicAnswers/deepAnswers 转为 Record 供 SpaceQuestionSheet 使用
  const basicAnswersRecord: Record<string, string | string[]> = {
    rentalMode: basicAnswers.rentalMode,
    spaceType: basicAnswers.spaceType,
    mainConcern: basicAnswers.mainConcern,
    riskFeature: basicAnswers.riskFeature,
  };

  const deepAnswersRecord: Record<string, string | string[]> = {
    facingTarget: deepAnswers.facingTarget,
    backSupport: deepAnswers.backSupport,
    doorWindowRelation: deepAnswers.doorWindowRelation,
  };

  return (
    <div style={pageStyle}>
      {/* 上传卡片 */}
      <SpaceUploadCard
        imageUrl={imageUrl}
        onImageChange={handleImageChange}
      />

      {/* 上传后且无结果：显示「开始安居问诊」按钮 */}
      {imageUrl && !result && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleOpenBasicSheet}
            style={{
              width: "100%",
              height: 50,
              borderRadius: 22,
              border: "none",
              background: "linear-gradient(135deg, #D95A4E, #B8443A)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(217,90,78,0.28)",
            }}
          >
            开始安居问诊
          </button>
        </div>
      )}

      {/* 已有结果但弹窗关闭时 */}
      {result && !resultSheetOpen && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setResultSheetOpen(true)}
            style={{
              width: "100%",
              height: 50,
              borderRadius: 22,
              border: "none",
              background: "linear-gradient(135deg, #D95A4E, #B8443A)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(217,90,78,0.28)",
            }}
          >
            查看安居结果
          </button>
        </div>
      )}

      {/* 校验提示 */}
      {hint && (
        <p
          style={{
            fontSize: 13,
            color: "#D95A4E",
            textAlign: "center",
            fontWeight: 600,
            background: "rgba(217,90,78,0.06)",
            borderRadius: 12,
            padding: "10px 14px",
            marginTop: 12,
          }}
        >
          {hint}
        </p>
      )}

      {/* 轻量问诊弹窗 */}
      <SpaceQuestionSheet
        open={basicSheetOpen}
        mode="basic"
        questions={basicQuestionFlow}
        answers={basicAnswersRecord}
        onAnswersChange={(a) =>
          setBasicAnswers({
            rentalMode: (a.rentalMode as RentalMode) ?? "租前看房",
            spaceType: (a.spaceType as string) ?? "整个房间",
            mainConcern: (a.mainConcern as string[]) ?? ["只是随便看看"],
            riskFeature: (a.riskFeature as string[]) ?? ["不确定"],
          })
        }
        onSubmit={handleBasicSubmit}
        onClose={handleCloseBasicSheet}
        loading={loading}
      />

      {/* 深度解析问诊弹窗 */}
      <SpaceQuestionSheet
        open={deepSheetOpen}
        mode="deep"
        questions={deepQuestionFlow}
        answers={deepAnswersRecord}
        onAnswersChange={(a) =>
          setDeepAnswers({
            facingTarget: (a.facingTarget as string[]) ?? ["不确定"],
            backSupport: (a.backSupport as string) ?? "不确定",
            doorWindowRelation: (a.doorWindowRelation as string) ?? "不确定",
          })
        }
        onSubmit={handleDeepSubmit}
        onClose={handleCloseDeepSheet}
        loading={deepLoading}
      />

      {/* 结果弹窗 */}
      {result && (
        <SpaceResultSheet
          open={resultSheetOpen}
          result={result}
          onClose={handleCloseResultSheet}
          onRetry={handleRetry}
          onReset={handleReset}
          onDeepAnalyze={analysisDepth === "basic" ? handleOpenDeepSheet : undefined}
          deepLoading={deepLoading}
        />
      )}
    </div>
  );
}
