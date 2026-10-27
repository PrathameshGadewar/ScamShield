import pytest
from app.rules import ScamRuleEngine


@pytest.fixture
def engine():
    return ScamRuleEngine()


def test_otp_credential_theft_detected(engine):
    msg = "Send me your OTP immediately or your bank account will be blocked."
    indicators = engine.analyze(msg)
    indicator_ids = [ind.id for ind in indicators]

    assert "otp_credential_theft" in indicator_ids
    assert "account_suspension_threat" in indicator_ids
    assert "urgency_pressure" in indicator_ids


def test_prize_scam_detected(engine):
    msg = "Congratulations! Pay a registration fee to claim your prize."
    indicators = engine.analyze(msg)
    indicator_ids = [ind.id for ind in indicators]

    assert "prize_lottery_claim" in indicator_ids
    assert "advance_fee_payment" in indicator_ids


def test_ordinary_benign_message(engine):
    msg = "Hey, are we meeting at the library tomorrow?"
    indicators = engine.analyze(msg)
    assert len(indicators) == 0


def test_job_recruitment_scam(engine):
    msg = "Work from home and earn $500 per day by rating videos on Telegram! Small deposit required."
    indicators = engine.analyze(msg)
    indicator_ids = [ind.id for ind in indicators]

    assert "job_recruitment_fraud" in indicator_ids
    assert "advance_fee_payment" in indicator_ids


def test_suspicious_link(engine):
    msg = "Your parcel delivery failed. Update your details at http://bit.ly/3xyzDelivery"
    indicators = engine.analyze(msg)
    indicator_ids = [ind.id for ind in indicators]

    assert "suspicious_link" in indicator_ids
    assert "impersonation_delivery_authority" in indicator_ids
