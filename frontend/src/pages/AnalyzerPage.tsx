import React, { useState, useEffect } from "react";
import {
  Search,
  RotateCcw,
  Clipboard,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { api, ApiError } from "../services/api";
import type { AnalyzeResponse } from "../types";
import { ResultsCard } from "../components/ResultsCard";
import { SamplePrompts } from "../components/SamplePrompts";

interface AnalyzerPageProps {
  initialText?: string;
  onAnalysisComplete?: () => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  initialText = "",
  onAnalysisComplete,
}) => {
  const [message, setMessage] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialText) {
      setMessage(initialText);
    }
  }, [initialText]);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze ?? message).trim();
    if (!text) {
      setError("Please enter or paste a message to analyze.");
      return;
    }

    if (text.length > 5000) {
      setError("Message exceeds the maximum limit of 5,000 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.analyze(text);
      setResult(data);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err: any) {
      setResult(null);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          "Failed to communicate with ScamShield backend. Please verify your Python FastAPI server is running."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setMessage(clipText);
        setError(null);
      }
    } catch (err) {
      setError(
        "Could not read from clipboard. Please paste manually into the text box."
      );
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setMessage(sampleText);
    setError(null);
  };

  const charCount = message.length;
  const isTooLong = charCount > 5000;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Search className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Message Analyzer Workspace
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Inspect suspicious SMS texts, emails, WhatsApp messages, or social DM prompts using our hybrid neural and heuristic threat pipeline.
        </p>
      </div>

      {/* Main Analysis Input Box */}
      <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        {/* Sample selector */}
        <SamplePrompts
          onSelect={handleSelectSample}
          disabled={isLoading}
        />

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            rows={5}
            placeholder="Paste or type suspicious message here (e.g. 'Your account has been suspended. Click here to verify...')"
            className={`w-full rounded-xl bg-slate-950/90 border p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none transition-colors resize-y min-h-[140px] ${
              isTooLong
                ? "border-rose-500 focus:border-rose-400"
                : "border-slate-700/80 focus:border-cyan-500"
            }`}
          />

          {/* Character counter */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste from Clipboard</span>
              </button>
            </div>

            <span
              className={`font-mono text-xs ${
                isTooLong ? "text-rose-400 font-bold" : "text-slate-400"
              }`}
            >
              {charCount.toLocaleString()} / 5,000 characters
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading || (!message && !result && !error)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Input & Results</span>
          </button>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={isLoading || !message.trim() || isTooLong}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Message...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="rounded-xl p-8 bg-slate-900/50 border border-slate-800/80 text-center space-y-3 animate-pulse">
          <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            Running Hybrid Inference Pipeline
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Computing DistilBERT sequence logits, applying softmax probability distribution, and testing 8 heuristic pattern sets...
          </p>
        </div>
      )}

      {/* Inline Error Display */}
      {error && !isLoading && (
        <div className="rounded-xl p-4 bg-rose-950/40 border border-rose-800/60 text-rose-200 text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Analysis Request Error</span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed">{error}</p>
          <div className="pt-2 border-t border-rose-900/40 text-[11px] text-rose-300/80 font-mono">
            Troubleshooting tip: Ensure the FastAPI backend is running locally at{" "}
            <code>http://127.0.0.1:8000</code> and weights are in{" "}
            <code>backend/model/final_model/</code>.
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {result && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Inspection Report</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Evaluated {new Date(result.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <ResultsCard result={result} fullMessage={message} />
        </div>
      )}
    </div>
  );
};
