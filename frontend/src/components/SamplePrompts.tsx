import React from "react";
import { Sparkles } from "lucide-react";

interface SamplePrompt {
  label: string;
  category: string;
  text: string;
}

const SAMPLES: SamplePrompt[] = [
  {
    label: "OTP Banking Threat",
    category: "Phishing / Coercion",
    text: "Send me your OTP immediately or your bank account will be blocked.",
  },
  {
    label: "Fake Lottery Prize",
    category: "Advance-Fee Fraud",
    text: "Congratulations! Pay a registration fee to claim your prize.",
  },
  {
    label: "Telegram Task Job",
    category: "Employment Scam",
    text: "Work from home and earn $500 per day by rating videos on Telegram! Small deposit required.",
  },
  {
    label: "Delivery Redirection",
    category: "Smishing Link",
    text: "USPS Notice: Your package could not be delivered due to missing house number. Confirm delivery fee at http://bit.ly/4xPostTrack",
  },
  {
    label: "Benign Personal Chat",
    category: "Legitimate",
    text: "Hey, are we meeting at the library tomorrow?",
  },
  {
    label: "Account KYC Expiry",
    category: "Impersonation",
    text: "URGENT: Your SBI net banking account access will be terminated within 24 hours. Update your KYC immediately.",
  },
];

interface SamplePromptsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const SamplePrompts: React.FC<SamplePromptsProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Test with sample messages:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((sample, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(sample.text)}
            disabled={disabled}
            className="text-xs px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center gap-1.5"
            title={sample.text}
          >
            <span className="font-semibold text-slate-200">{sample.label}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              • {sample.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
