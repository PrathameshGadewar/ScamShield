import React, { useEffect, useState } from "react";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Search,
  History,
  TrendingUp,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { api } from "../services/api";
import type { StatsResponse, HistoryItem } from "../types";

interface DashboardPageProps {
  onNavigateToAnalyzer: (text?: string) => void;
  onNavigateToHistory: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToAnalyzer,
  onNavigateToHistory,
}) => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, h] = await Promise.all([
        api.getStats(),
        api.getHistory(5, 0),
      ]);
      setStats(s);
      setRecentHistory(h);
    } catch (err: any) {
      setError(
        "Could not load telemetry metrics. Please ensure the ScamShield backend is online."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Security Analytics & Telemetry
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time aggregate threat statistics computed from local SQLite persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Refresh Metrics"
          >
            <RotateCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => onNavigateToAnalyzer()}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadDashboardData}
            className="font-bold underline ml-4 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Total Analyses</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats ? stats.total_analyses.toLocaleString() : "0"}
          </div>
          <p className="text-[11px] text-slate-400">Locally stored in SQLite</p>
        </div>

        {/* Flagged Suspicious */}
        <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Suspicious Flagged</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {stats ? stats.suspicious_count.toLocaleString() : "0"}
          </div>
          <p className="text-[11px] text-slate-400">High-risk patterns detected</p>
        </div>

        {/* Clean / Unflagged */}
        <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>No Strong Indicators</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {stats ? stats.clean_count.toLocaleString() : "0"}
          </div>
          <p className="text-[11px] text-slate-400">Below threat threshold</p>
        </div>

        {/* Suspicious Detection Rate */}
        <div className="rounded-xl p-5 bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Threat Ratio</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {stats ? `${stats.suspicious_rate}%` : "0.0%"}
          </div>
          <p className="text-[11px] text-slate-400">Relative suspicious frequency</p>
        </div>
      </div>

      {/* Telemetry Breakdown: Top Indicators & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Indicators Bar Widget */}
        <div className="lg:col-span-1 rounded-2xl p-5 sm:p-6 bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Frequent Indicators</span>
            </h3>
            <span className="text-xs text-slate-400">Top 5</span>
          </div>

          {stats && stats.top_indicators.length > 0 ? (
            <div className="space-y-3.5">
              {stats.top_indicators.map((ind, i) => {
                const maxCount = Math.max(
                  ...stats.top_indicators.map((t) => t.count),
                  1
                );
                const pct = Math.round((ind.count / maxCount) * 100);

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[180px]">
                        {ind.name}
                      </span>
                      <span className="font-mono font-bold text-cyan-400">
                        {ind.count}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-slate-600" />
              <p>No indicators logged yet.</p>
              <p className="text-[11px] text-slate-400">
                Analyze messages to populate telemetry.
              </p>
            </div>
          )}
        </div>

        {/* Recent Analysis Stream */}
        <div className="lg:col-span-2 rounded-2xl p-5 sm:p-6 bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Recent Analyses</span>
            </h3>
            <button
              onClick={onNavigateToHistory}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentHistory.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {recentHistory.map((item) => {
                const isSusp = item.final_verdict === "SUSPICIOUS";
                return (
                  <div
                    key={item.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                            isSusp
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {item.final_verdict}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-1 font-mono">
                        "{item.message_preview}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Spam Prob</div>
                        <div
                          className={`text-xs font-mono font-bold ${
                            item.spam_probability >= 0.5
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {(item.spam_probability * 100).toFixed(1)}%
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateToAnalyzer(item.full_message)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
                        title="Load into Analyzer"
                      >
                        <span>Re-test</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-600">
                <Search className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-300">
                No analyses recorded yet
              </p>
              <p className="text-slate-400 max-w-xs mx-auto">
                Scan your first message to begin generating real local telemetry.
              </p>
              <button
                onClick={() => onNavigateToAnalyzer()}
                className="mt-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                Launch Analyzer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
