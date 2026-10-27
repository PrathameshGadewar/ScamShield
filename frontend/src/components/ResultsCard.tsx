import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { AnalyzeResponse } from "../types";
import { ProbabilityGauge } from "./ProbabilityGauge";
import { IndicatorBadge } from "./IndicatorBadge";

interface ResultsCardProps {
  result: AnalyzeResponse;
  fullMessage?: string;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  result,
}) => {
  const isSuspicious = result.final_verdict === "SUSPICIOUS";
  const probabilityPercent = (result.model_spam_probability * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Primary Verdict Banner */}
      <div
        className={`rounded-xl p-5 border shadow-lg transition-all ${
          isSuspicious
            ? "bg-rose-950/30 border-rose-600/50 text-rose-100 shadow-rose-950/20"
            : "bg-emerald-950/30 border-emerald-600/50 text-emerald-100 shadow-emerald-950/20"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-lg ${
                isSuspicious
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {isSuspicious ? (
                <ShieldAlert className="w-8 h-8" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                  Combined Verdict
                </span>
                {result.analysis_id && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    #REC-{result.analysis_id}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {result.final_verdict}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-700/50 pt-3 sm:pt-0 sm:pl-4">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">
                Model Spam Confidence
              </div>
              <div
                className={`text-xl font-bold font-mono ${
                  result.model_spam_probability >= 0.5
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              >
                {probabilityPercent}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-bold">
                Rule Indicators
              </div>
              <div
                className={`text-xl font-bold font-mono ${
                  result.detected_indicators.length > 0
                    ? "text-amber-400"
                    : "text-slate-400"
                }`}
              >
                {result.detected_indicators.length} Found
              </div>
            </div>
          </div>
        </div>

        {/* Executive Assessment Explanation */}
        <div className="mt-4 pt-3.5 border-t border-slate-700/50 text-sm leading-relaxed text-slate-200">
          <p>{result.assessment}</p>
        </div>
      </div>

      {/* 2. Visual Probability Gauge */}
      <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 shadow-md">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>DistilBERT Model Statistical Classification</span>
        </h3>
        <ProbabilityGauge
          probability={result.model_spam_probability}
          label="Estimated Probability of Spam / Fraud"
        />

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span>Model Prediction Class:</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded ${
                result.model_prediction === "SPAM"
                  ? "bg-rose-500/20 text-rose-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {result.model_prediction}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Decision Boundary:</span>
            <span className="font-mono text-slate-300">p ≥ 0.50 (Spam)</span>
          </div>
        </div>
      </div>

      {/* 3. Detected Heuristic Indicators */}
      <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Rule-Based Pattern Indicators</span>
          </h3>
          <span className="text-xs text-slate-400">
            {result.detected_indicators.length === 0
              ? "0 matches"
              : `${result.detected_indicators.length} heuristic flags`}
          </span>
        </div>

        {result.detected_indicators.length > 0 ? (
          <div className="space-y-3">
            {result.detected_indicators.map((ind, i) => (
              <IndicatorBadge key={i} indicator={ind} />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              No high-risk keywords or common scam tactics (e.g. OTP theft, urgent threats, upfront payment demands) matched heuristic rule sets.
            </span>
          </div>
        )}
      </div>

      {/* 4. Actionable Safety Recommendations */}
      <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 shadow-md">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Recommended Safety Actions</span>
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
          {result.safety_advice.map((adv, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
              <span>{adv}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Advisory Disclaimer */}
      <div className="rounded-lg p-3.5 bg-slate-950/60 border border-slate-800/70 text-slate-400 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Advisory Notice:</strong> ScamShield AI uses statistical inference and heuristic patterns to evaluate risk. An assessment of "NO STRONG INDICATORS DETECTED" means no prominent threat markers were recognized, but it <em>cannot guarantee</em> that a message is completely safe or legitimate. Always verify senders independently.
        </p>
      </div>
    </div>
  );
};
