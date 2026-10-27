import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  X,
  RotateCw,
} from "lucide-react";
import { api } from "../services/api";
import type { HistoryItem } from "../types";
import { IndicatorBadge } from "../components/IndicatorBadge";
import { ProbabilityGauge } from "../components/ProbabilityGauge";

interface HistoryPageProps {
  onNavigateToAnalyzer: (text: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onNavigateToAnalyzer,
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("ALL");

  // Selected item modal
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // Clear confirmation modal
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getHistory(
        100,
        0,
        verdictFilter,
        searchQuery
      );
      setHistory(data);
    } catch (err: any) {
      setError("Failed to fetch history from SQLite backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [verdictFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      await api.clearHistory();
      setHistory([]);
      setIsConfirmingClear(false);
      setSelectedItem(null);
    } catch (err) {
      alert("Failed to clear history.");
    } finally {
      setIsClearing(false);
    }
  };

  const exportToJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `scamshield-history-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <History className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Analysis History
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Persisted records stored locally in your SQLite database (<code>scamshield.db</code>).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportToJson}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Export analyses to JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setIsConfirmingClear(true)}
                className="px-3 py-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full md:w-96 relative flex items-center"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search text in stored messages..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Verdict:</span>
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Verdicts</option>
            <option value="SUSPICIOUS">Suspicious Only</option>
            <option value="NO STRONG INDICATORS DETECTED">
              No Strong Indicators Only
            </option>
          </select>

          <button
            onClick={fetchHistory}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* History Table / List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <RotateCw className="w-6 h-6 mx-auto animate-spin text-cyan-400 mb-2" />
          <span>Loading historical records...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl p-12 bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <History className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">
            No Records Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || verdictFilter !== "ALL"
              ? "No analyses matched your current filter criteria."
              : "Your analysis history is currently empty. Run a message analysis to create a local record."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
          <div className="divide-y divide-slate-800">
            {history.map((item) => {
              const isSusp = item.final_verdict === "SUSPICIOUS";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-4 hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                          isSusp
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {item.final_verdict}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        #REC-{item.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 font-mono line-clamp-2">
                      "{item.full_message}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span>Model Class: <strong className="text-slate-300">{item.model_prediction}</strong></span>
                      <span>•</span>
                      <span>
                        Rule Indicators:{" "}
                        <strong
                          className={
                            item.indicator_count > 0
                              ? "text-amber-400"
                              : "text-slate-400"
                          }
                        >
                          {item.indicator_count}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Spam Prob
                      </div>
                      <div
                        className={`text-sm font-mono font-bold ${
                          item.spam_probability >= 0.5
                            ? "text-rose-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {(item.spam_probability * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-xs font-semibold">
                      <span>Inspect</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Item Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400">
                  Record #{selectedItem.id}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verdict Box */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                selectedItem.final_verdict === "SUSPICIOUS"
                  ? "bg-rose-950/30 border-rose-800/40 text-rose-200"
                  : "bg-emerald-950/30 border-emerald-800/40 text-emerald-200"
              }`}
            >
              {selectedItem.final_verdict === "SUSPICIOUS" ? (
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              )}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Assessment
                </div>
                <div className="text-lg font-black">
                  {selectedItem.final_verdict}
                </div>
              </div>
            </div>

            {/* Full Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Message Text:
              </label>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                {selectedItem.full_message}
              </div>
            </div>

            {/* Model Probability */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <ProbabilityGauge
                probability={selectedItem.spam_probability}
                label="DistilBERT Spam Probability"
              />
            </div>

            {/* Indicators */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Detected Indicators ({selectedItem.indicators.length}):
              </label>
              {selectedItem.indicators.length > 0 ? (
                <div className="space-y-2">
                  {selectedItem.indicators.map((ind, i) => (
                    <IndicatorBadge key={i} indicator={ind} />
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  No heuristic rule indicators matched this text.
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onNavigateToAnalyzer(selectedItem.full_message);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Re-analyze in Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Clear History */}
      {isConfirmingClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Clear All Analysis History?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all {history.length} analysis records from your local SQLite database (<code>scamshield.db</code>). This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmingClear(false)}
                disabled={isClearing}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                {isClearing ? "Clearing..." : "Yes, Delete All Records"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
