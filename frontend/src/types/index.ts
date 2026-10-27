export type VerdictType = "SUSPICIOUS" | "NO STRONG INDICATORS DETECTED" | "ANALYSIS ERROR";

export interface ScamIndicator {
  id: string;
  category: string;
  name: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  explanation: string;
  matched_text?: string | null;
}

export interface AnalyzeResponse {
  analysis_id?: number;
  message_preview: string;
  model_spam_probability: number;
  model_prediction: "SPAM" | "HAM";
  detected_indicators: ScamIndicator[];
  final_verdict: VerdictType;
  assessment: string;
  safety_advice: string[];
  timestamp: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "error";
  model_loaded: boolean;
  device: string;
  model_name: string;
  label_mapping: Record<string, string>;
  timestamp: string;
  message: string;
  error_detail?: string | null;
}

export interface HistoryItem {
  id: number;
  message_preview: string;
  full_message: string;
  spam_probability: number;
  model_prediction: string;
  final_verdict: VerdictType;
  indicator_count: number;
  indicators: ScamIndicator[];
  safety_advice: string[];
  created_at: string;
}

export interface IndicatorStat {
  id: string;
  name: string;
  count: number;
}

export interface StatsResponse {
  total_analyses: number;
  suspicious_count: number;
  clean_count: number;
  suspicious_rate: number;
  top_indicators: IndicatorStat[];
}
