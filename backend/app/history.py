import os
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Dict, Any

from .schemas import HistoryItem, ScamIndicator, StatsResponse


class HistoryDB:
    """
    SQLite-backed persistent history store for message analyses and metrics.
    Runs locally without requiring external database servers.
    """

    def __init__(self, db_path: Optional[str] = None):
        if db_path:
            self.db_path = Path(db_path).resolve()
        else:
            backend_dir = Path(__file__).resolve().parent.parent
            self.db_path = backend_dir / "scamshield.db"

        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS analyses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    message_text TEXT NOT NULL,
                    message_preview TEXT NOT NULL,
                    spam_probability REAL NOT NULL,
                    model_prediction TEXT NOT NULL,
                    final_verdict TEXT NOT NULL,
                    indicators_json TEXT NOT NULL,
                    safety_advice_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            """)
            conn.commit()

    def save_analysis(
        self,
        full_message: str,
        spam_probability: float,
        model_prediction: str,
        final_verdict: str,
        indicators: List[ScamIndicator],
        safety_advice: List[str]
    ) -> int:
        preview = full_message[:90] + "..." if len(full_message) > 90 else full_message
        indicators_data = [i.model_dump() for i in indicators]
        now_iso = datetime.now(timezone.utc).isoformat()

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO analyses (
                    message_text,
                    message_preview,
                    spam_probability,
                    model_prediction,
                    final_verdict,
                    indicators_json,
                    safety_advice_json,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    full_message,
                    preview,
                    float(spam_probability),
                    model_prediction,
                    final_verdict,
                    json.dumps(indicators_data),
                    json.dumps(safety_advice),
                    now_iso
                )
            )
            conn.commit()
            return cursor.lastrowid

    def get_history(
        self,
        limit: int = 50,
        offset: int = 0,
        verdict: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[HistoryItem]:
        query = "SELECT * FROM analyses WHERE 1=1"
        params: List[Any] = []

        if verdict and verdict.strip() and verdict != "ALL":
            query += " AND final_verdict = ?"
            params.append(verdict.strip())

        if search and search.strip():
            query += " AND (message_text LIKE ? OR message_preview LIKE ?)"
            term = f"%{search.strip()}%"
            params.extend([term, term])

        query += " ORDER BY id DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        items: List[HistoryItem] = []
        with self._get_connection() as conn:
            rows = conn.execute(query, params).fetchall()
            for r in rows:
                try:
                    raw_indicators = json.loads(r["indicators_json"])
                    indicators = [ScamIndicator(**i) for i in raw_indicators]
                except Exception:
                    indicators = []

                try:
                    advice = json.loads(r["safety_advice_json"])
                except Exception:
                    advice = []

                items.append(
                    HistoryItem(
                        id=r["id"],
                        message_preview=r["message_preview"],
                        full_message=r["message_text"],
                        spam_probability=r["spam_probability"],
                        model_prediction=r["model_prediction"],
                        final_verdict=r["final_verdict"],
                        indicator_count=len(indicators),
                        indicators=indicators,
                        safety_advice=advice,
                        created_at=r["created_at"]
                    )
                )

        return items

    def get_analysis_by_id(self, analysis_id: int) -> Optional[HistoryItem]:
        with self._get_connection() as conn:
            r = conn.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
            if not r:
                return None

            try:
                raw_indicators = json.loads(r["indicators_json"])
                indicators = [ScamIndicator(**i) for i in raw_indicators]
            except Exception:
                indicators = []

            try:
                advice = json.loads(r["safety_advice_json"])
            except Exception:
                advice = []

            return HistoryItem(
                id=r["id"],
                message_preview=r["message_preview"],
                full_message=r["message_text"],
                spam_probability=r["spam_probability"],
                model_prediction=r["model_prediction"],
                final_verdict=r["final_verdict"],
                indicator_count=len(indicators),
                indicators=indicators,
                safety_advice=advice,
                created_at=r["created_at"]
            )

    def clear_history(self) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM analyses")
            conn.commit()
            return cursor.rowcount

    def get_stats(self) -> StatsResponse:
        with self._get_connection() as conn:
            total = conn.execute("SELECT COUNT(*) FROM analyses").fetchone()[0]
            if total == 0:
                return StatsResponse(
                    total_analyses=0,
                    suspicious_count=0,
                    clean_count=0,
                    suspicious_rate=0.0,
                    top_indicators=[]
                )

            suspicious = conn.execute(
                "SELECT COUNT(*) FROM analyses WHERE final_verdict = 'SUSPICIOUS'"
            ).fetchone()[0]

            clean = total - suspicious
            rate = round((suspicious / total) * 100, 1)

            # Indicator frequency
            rows = conn.execute("SELECT indicators_json FROM analyses").fetchall()
            counts: Dict[str, int] = {}
            names: Dict[str, str] = {}

            for row in rows:
                try:
                    ind_list = json.loads(row["indicators_json"])
                    for ind in ind_list:
                        cid = ind.get("id", "unknown")
                        cname = ind.get("name", "Unknown Indicator")
                        counts[cid] = counts.get(cid, 0) + 1
                        names[cid] = cname
                except Exception:
                    continue

            top_indicators = [
                {"id": cid, "name": names[cid], "count": count}
                for cid, count in sorted(counts.items(), key=lambda x: x[1], reverse=True)[:5]
            ]

            return StatsResponse(
                total_analyses=total,
                suspicious_count=suspicious,
                clean_count=clean,
                suspicious_rate=rate,
                top_indicators=top_indicators
            )


# Default singleton instance
history_db = HistoryDB()
