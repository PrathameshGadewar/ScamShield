import React from "react";

interface ProbabilityGaugeProps {
  probability: number; // 0.0 to 1.0
  label?: string;
  className?: string;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({
  probability,
  label = "DistilBERT Model Spam Probability",
  className = "",
}) => {
  const percentage = Math.round(probability * 1000) / 10; // e.g. 99.7%

  // Determine status color
  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let riskLevel = "Low Statistical Risk";

  if (probability >= 0.7) {
    barColor = "bg-rose-500";
    textColor = "text-rose-400";
    riskLevel = "Critical Statistical Spam Signal";
  } else if (probability >= 0.4) {
    barColor = "bg-amber-500";
    textColor = "text-amber-400";
    riskLevel = "Moderate Statistical Uncertainty";
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">({riskLevel})</span>
          <span className={`text-base font-bold font-mono ${textColor}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-slate-700/60"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percentage}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.max(2, Math.min(100, percentage))}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-400">
        <span>0% (Legitimate)</span>
        <span>50% (Threshold)</span>
        <span>100% (High Confidence Spam)</span>
      </div>
    </div>
  );
};
