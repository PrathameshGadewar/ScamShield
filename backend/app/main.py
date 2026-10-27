import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    HealthResponse,
    HistoryItem,
    StatsResponse,
)
from .model_service import model_service
from .rules import rule_engine
from .history import history_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("scamshield.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load the DistilBERT model once during application startup.
    Avoids reloading weights on individual requests.
    """
    logger.info("Starting ScamShield AI backend service...")
    success = model_service.load_model()
    if not success:
        logger.warning(
            f"Model could not be loaded on startup: {model_service.error_message}"
        )
    yield
    logger.info("Shutting down ScamShield AI backend...")


app = FastAPI(
    title="ScamShield AI API",
    description="Intelligent Scam Detection and Conversation Risk Analysis API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
allowed_origins_raw = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
)
origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_safety_advice(
    verdict: str,
    indicator_ids: List[str]
) -> List[str]:
    """
    Builds context-aware, practical safety instructions.
    """
    advice: List[str] = []

    if verdict == "SUSPICIOUS":
        if "otp_credential_theft" in indicator_ids:
            advice.append(
                "Never share OTPs, passcodes, or banking PINs. Official banks and platforms never ask for your OTP over SMS or phone."
            )
        if "account_suspension_threat" in indicator_ids:
            advice.append(
                "Do not use links or phone numbers provided in the message. Verify your account status by logging in through the official banking app or website independently."
            )
        if "advance_fee_payment" in indicator_ids:
            advice.append(
                "Never send money, crypto, or gift cards to unlock a prize, refund, or employment opportunity. Legitimate organizations never demand advance fees."
            )
        if "prize_lottery_claim" in indicator_ids:
            advice.append(
                "Treat unexpected lottery, contest, or reward claims with high skepticism. If you did not enter a contest, you cannot win it."
            )
        if "job_recruitment_fraud" in indicator_ids:
            advice.append(
                "Decline work-from-home offers that promise exorbitant daily returns for effortless tasks, or that ask for registration fees."
            )
        if "suspicious_link" in indicator_ids:
            advice.append(
                "Avoid clicking shortened or unfamiliar web links. Inspect URLs carefully before entering any personal data."
            )
        if "impersonation_delivery_authority" in indicator_ids:
            advice.append(
                "Courier companies (DHL, FedEx, Postal) will not ask for card details via an SMS link for redelivery. Check package status on the official tracking portal."
            )

        if not advice:
            advice.append(
                "Do not reply or click any links in this message. Delete or report it to your service provider."
            )
            advice.append(
                "Verify the sender's identity through official, trusted channels before taking any action."
            )
    else:
        advice.append(
            "No prominent scam indicators were detected, but always remain cautious with unsolicited messages."
        )
        advice.append(
            "Never divulge sensitive credentials or send money unless you have verified the requester independently."
        )

    return advice


def generate_assessment_summary(
    spam_prob: float,
    model_pred: str,
    indicators_count: int,
    final_verdict: str
) -> str:
    """
    Provides an honest, transparent breakdown of how the verdict was determined.
    """
    percent = round(spam_prob * 100, 1)

    if final_verdict == "SUSPICIOUS":
        if spam_prob >= 0.5 and indicators_count > 0:
            return (
                f"High-Confidence Risk: Both the DistilBERT neural model ({percent}% spam probability) "
                f"and rule-based heuristic filters ({indicators_count} scam indicators) identified deceptive patterns."
            )
        elif indicators_count > 0:
            return (
                f"Elevated Risk: The DistilBERT model assigned a lower statistical score ({percent}%), "
                f"but {indicators_count} high-priority heuristic scam indicators were triggered (e.g. credential theft or coercion)."
            )
        else:
            return (
                f"Model Flagged: The DistilBERT classifier detected strong structural and linguistic similarities "
                f"to spam/scam campaigns ({percent}% probability), even though specific keyword heuristics did not trigger."
            )
    else:
        return (
            f"Advisory Assessment: The message yielded a low spam probability ({percent}%) and no known heuristic "
            "scam indicators were detected. Note that novel or highly personalized phishing messages may evade detection."
        )


@app.get("/", summary="API Root Status")
def get_root():
    return {
        "service": "ScamShield AI",
        "tagline": "Detect the deception. Protect your digital life.",
        "status": "operational",
        "version": "1.0.0"
    }


@app.get("/health", response_model=HealthResponse, summary="Service and Model Health")
def get_health():
    """
    Checks health status. Returns 503 if the model is not loaded.
    """
    is_loaded = model_service.is_loaded
    now_iso = datetime.now(timezone.utc).isoformat()

    if not is_loaded:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "error",
                "model_loaded": False,
                "device": model_service.device,
                "model_name": "distilbert-base-uncased (fine-tuned)",
                "label_mapping": model_service.label_mapping,
                "timestamp": now_iso,
                "message": "Model is not loaded.",
                "error_detail": model_service.error_message
            }
        )

    return HealthResponse(
        status="healthy",
        model_loaded=True,
        device=model_service.device,
        model_name="distilbert-base-uncased (fine-tuned)",
        label_mapping=model_service.label_mapping,
        timestamp=now_iso,
        message="Model is loaded and ready for inference.",
        error_detail=None
    )


@app.post(
    "/api/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze Message with Hybrid AI & Rules"
)
def analyze_message(request: AnalyzeRequest):
    """
    Analyzes message text:
    1. Runs DistilBERT sequence classification for statistical spam probability.
    2. Runs rule-based pattern matching for known scam indicators.
    3. Combines both signals into a final verdict.
    4. Persists the analysis locally in SQLite.
    """
    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                model_service.error_message
                or "DistilBERT model is not loaded. Please ensure weights are in 'backend/model/final_model/'."
            )
        )

    message_text = request.message

    # 1. DistilBERT Inference
    try:
        model_spam_prob, model_pred = model_service.predict(message_text)
    except Exception as e:
        logger.exception("Inference error occurred")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failure: {str(e)}"
        )

    # 2. Rule-based Indicator Detection
    detected_indicators = rule_engine.analyze(message_text)

    # 3. Hybrid Decision Logic
    # If model is confident (>= 0.5) OR any rule matched -> SUSPICIOUS
    if model_spam_prob >= 0.5 or len(detected_indicators) > 0:
        final_verdict = "SUSPICIOUS"
    else:
        final_verdict = "NO STRONG INDICATORS DETECTED"

    # 4. Synthesize Assessment & Safety Advice
    indicator_ids = [i.id for i in detected_indicators]
    assessment = generate_assessment_summary(
        spam_prob=model_spam_prob,
        model_pred=model_pred,
        indicators_count=len(detected_indicators),
        final_verdict=final_verdict
    )
    safety_advice = generate_safety_advice(final_verdict, indicator_ids)
    preview = message_text[:90] + "..." if len(message_text) > 90 else message_text
    now_iso = datetime.now(timezone.utc).isoformat()

    # 5. Persist in local SQLite
    analysis_id = history_db.save_analysis(
        full_message=message_text,
        spam_probability=model_spam_prob,
        model_prediction=model_pred,
        final_verdict=final_verdict,
        indicators=detected_indicators,
        safety_advice=safety_advice
    )

    return AnalyzeResponse(
        analysis_id=analysis_id,
        message_preview=preview,
        model_spam_probability=model_spam_prob,
        model_prediction=model_pred,
        detected_indicators=detected_indicators,
        final_verdict=final_verdict,
        assessment=assessment,
        safety_advice=safety_advice,
        timestamp=now_iso
    )


@app.get("/api/history", response_model=List[HistoryItem], summary="Get Analysis History")
def get_history(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    verdict: Optional[str] = Query(None, description="Filter by verdict"),
    search: Optional[str] = Query(None, description="Search term in messages")
):
    return history_db.get_history(limit=limit, offset=offset, verdict=verdict, search=search)


@app.get("/api/history/{analysis_id}", response_model=HistoryItem, summary="Get Analysis by ID")
def get_single_analysis(analysis_id: int):
    item = history_db.get_analysis_by_id(analysis_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID {analysis_id} not found."
        )
    return item


@app.delete("/api/history", summary="Clear All Analysis History")
def clear_history():
    deleted_count = history_db.clear_history()
    return {"message": "History cleared successfully", "deleted_count": deleted_count}


@app.get("/api/stats", response_model=StatsResponse, summary="Get Historical Statistics")
def get_stats():
    return history_db.get_stats()
