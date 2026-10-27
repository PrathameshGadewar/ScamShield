import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.model_service import model_service


@pytest.fixture(scope="session")
def client():
    # Trigger startup lifespan event
    with TestClient(app) as c:
        yield c


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "ScamShield AI"
    assert data["status"] == "operational"


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert "device" in data


def test_analyze_otp_scam(client):
    payload = {
        "message": "Send me your OTP immediately or your bank account will be blocked."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["final_verdict"] == "SUSPICIOUS"
    assert isinstance(data["model_spam_probability"], float)
    assert 0.0 <= data["model_spam_probability"] <= 1.0

    indicator_ids = [ind["id"] for ind in data["detected_indicators"]]
    assert "otp_credential_theft" in indicator_ids
    assert "account_suspension_threat" in indicator_ids
    assert len(data["safety_advice"]) > 0


def test_analyze_prize_scam(client):
    payload = {
        "message": "Congratulations! Pay a registration fee to claim your prize."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["final_verdict"] == "SUSPICIOUS"
    indicator_ids = [ind["id"] for ind in data["detected_indicators"]]
    assert "prize_lottery_claim" in indicator_ids
    assert "advance_fee_payment" in indicator_ids


def test_analyze_ordinary_message(client):
    payload = {
        "message": "Hey, are we meeting at the library tomorrow?"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Model gives ~0.0015 for this message, no indicators match
    assert data["final_verdict"] == "NO STRONG INDICATORS DETECTED"
    assert len(data["detected_indicators"]) == 0
    assert data["model_spam_probability"] < 0.5


def test_analyze_invalid_empty_input(client):
    # Empty string
    response = client.post("/api/analyze", json={"message": ""})
    assert response.status_code == 422

    # Whitespace only
    response = client.post("/api/analyze", json={"message": "    "})
    assert response.status_code == 422


def test_history_and_stats(client):
    # Retrieve stats
    stats_resp = client.get("/api/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert "total_analyses" in stats
    assert stats["total_analyses"] >= 3

    # Retrieve history
    hist_resp = client.get("/api/history?limit=10")
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert isinstance(history, list)
    assert len(history) >= 3


def test_model_failure_handling(monkeypatch):
    """
    Ensure the application does not substitute fake predictions if model is unloaded.
    """
    from app.model_service import ModelService
    mock_service = ModelService(model_dir="non_existent_directory")
    # Verify it fails gracefully
    loaded = mock_service.load_model()
    assert loaded is False
    assert mock_service.is_loaded is False

    with pytest.raises(RuntimeError) as exc_info:
        mock_service.predict("Any message")
    assert "not loaded" in str(exc_info.value).lower()
