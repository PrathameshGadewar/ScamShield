import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { ScamIndicator } from "../types";

interface IndicatorBadgeProps {
  indicator: ScamIndicator;
}

export const IndicatorBadge: React.FC<IndicatorBadgeProps> = ({ indicator }) => {
  const isHigh = indicator.severity === "HIGH";

  return (
    <div
      className={`rounded-lg p-3.5 border transition-all ${
        isHigh
          ? "bg-rose-950/20 border-rose-800/40 text-rose-200"
          : "bg-amber-950/20 border-amber-800/40 text-amber-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isHigh ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="font-semibold text-sm text-slate-100">
            {indicator.name}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
            isHigh
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}
        >
          {indicator.severity} Risk
        </span>
      </div>

      <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
        {indicator.explanation}
      </p>

      {indicator.matched_text && (
        <div className="mt-2 text-xs flex items-center gap-1.5 pt-2 border-t border-slate-700/40">
          <span className="text-slate-400 font-mono text-[11px]">Matched phrase:</span>
          <code className="px-1.5 py-0.5 rounded bg-slate-900/80 text-rose-300 font-mono text-[11px] border border-slate-700/50">
            "{indicator.matched_text}"
          </code>
        </div>
      )}
    </div>
  );
};
