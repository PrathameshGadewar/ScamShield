import type {
  AnalyzeResponse,
  HealthResponse,
  HistoryItem,
  StatsResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export class ApiError extends Error {
  statusCode?: number;
  detail?: string;

  constructor(message: string, statusCode?: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = "";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await res.text();
    }

    if (res.status === 503) {
      throw new ApiError(
        `Model Service Unavailable: ${errorDetail || "The DistilBERT model could not be loaded."}`,
        res.status,
        errorDetail
      );
    }

    throw new ApiError(
      errorDetail || `API request failed with status ${res.status}`,
      res.status,
      errorDetail
    );
  }

  return res.json() as Promise<T>;
}

export const api = {
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  async checkHealth(): Promise<HealthResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        headers: { Accept: "application/json" },
      });
      return await handleResponse<HealthResponse>(res);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        `Cannot reach ScamShield backend at ${API_BASE_URL}. Ensure FastAPI is running on port 8000.`,
        0
      );
    }
  },

  async analyze(message: string): Promise<AnalyzeResponse> {
    const trimmed = message.trim();
    if (!trimmed) {
      throw new ApiError("Please enter a message to analyze.", 400);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      return await handleResponse<AnalyzeResponse>(res);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        `Analysis failed: Unable to connect to backend server at ${API_BASE_URL}.`,
        0
      );
    }
  },

  async getHistory(
    limit: number = 50,
    offset: number = 0,
    verdict?: string,
    search?: string
  ): Promise<HistoryItem[]> {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    if (verdict && verdict !== "ALL") params.set("verdict", verdict);
    if (search && search.trim()) params.set("search", search.trim());

    try {
      const res = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });
      return await handleResponse<HistoryItem[]>(res);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("Failed to retrieve analysis history.", 0);
    }
  },

  async getAnalysisById(id: number): Promise<HistoryItem> {
    const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
      headers: { Accept: "application/json" },
    });
    return await handleResponse<HistoryItem>(res);
  },

  async clearHistory(): Promise<{ message: string; deleted_count: number }> {
    const res = await fetch(`${API_BASE_URL}/api/history`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<{ message: string; deleted_count: number }>(res);
  },

  async getStats(): Promise<StatsResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: { Accept: "application/json" },
      });
      return await handleResponse<StatsResponse>(res);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("Failed to retrieve statistics.", 0);
    }
  },
};
