from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


class AnalyzeRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Text message to analyze for scam indicators and spam probability",
        examples=["Send me your OTP immediately or your bank account will be blocked."]
    )

    @field_validator("message")
    @classmethod
    def validate_not_blank(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Message cannot be empty or contain only whitespace.")
        return trimmed


class ScamIndicator(BaseModel):
    id: str
    category: str
    name: str
    severity: str  # HIGH, MEDIUM, LOW
    explanation: str
    matched_text: Optional[str] = None


class AnalyzeResponse(BaseModel):
    analysis_id: Optional[int] = None
    message_preview: str
    model_spam_probability: float = Field(..., ge=0.0, le=1.0)
    model_prediction: str  # "SPAM" or "HAM"
    detected_indicators: List[ScamIndicator]
    final_verdict: str  # "SUSPICIOUS" or "NO STRONG INDICATORS DETECTED"
    assessment: str
    safety_advice: List[str]
    timestamp: str


class HealthResponse(BaseModel):
    status: str  # "healthy", "degraded", "error"
    model_loaded: bool
    device: str
    model_name: str
    label_mapping: Dict[str, Any]
    timestamp: str
    message: str
    error_detail: Optional[str] = None


class HistoryItem(BaseModel):
    id: int
    message_preview: str
    full_message: str
    spam_probability: float
    model_prediction: str
    final_verdict: str
    indicator_count: int
    indicators: List[ScamIndicator]
    safety_advice: List[str]
    created_at: str


class StatsResponse(BaseModel):
    total_analyses: int
    suspicious_count: int
    clean_count: int
    suspicious_rate: float
    top_indicators: List[Dict[str, Any]]
