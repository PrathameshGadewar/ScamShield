import re
from typing import List, Tuple
from .schemas import ScamIndicator


class ScamRuleEngine:
    """
    Modular rule-based indicator detection engine.
    Applies case-insensitive pattern matching to identify high-confidence
    scam heuristics independent of machine learning classification.
    """

    def __init__(self):
        # Rule definitions: (id, category, name, severity, explanation, regex_pattern)
        self.rules = [
            (
                "otp_credential_theft",
                "Credential & OTP Theft",
                "OTP or Authentication Code Request",
                "HIGH",
                "Scammers frequently solicit One-Time Passwords (OTP), 2FA codes, or credentials to hijack bank accounts, email, or social accounts.",
                re.compile(
                    r"\b(?:send|share|give|reply with|enter|provide|forward|confirm)\b.*?\b(?:otp|one[- ]time[- ]password|verification[- ]code|security[- ]code|cvv|pin|passcode|secret[- ]key)\b"
                    r"|\b(?:your\s+otp\s+is|my\s+otp|otp\s+immediately|send\s+me\s+your\s+otp|share\s+otp)\b",
                    re.IGNORECASE | re.DOTALL
                )
            ),
            (
                "account_suspension_threat",
                "Coercion & Account Threats",
                "Account Suspension or Restriction Threat",
                "HIGH",
                "Fraudsters use fear of account closure or frozen funds to bypass logical skepticism and force rapid compliance.",
                re.compile(
                    r"\b(?:account|card|access|service|profile|wallet)\b.*?\b(?:suspended|blocked|frozen|restricted|terminated|deactivated|closed|locked)\b"
                    r"|\b(?:unauthorized\s+access|security\s+alert|kyc\s+update\s+required|kyc\s+expired|reactivate\s+your\s+account)\b",
                    re.IGNORECASE | re.DOTALL
                )
            ),
            (
                "urgency_pressure",
                "Social Engineering",
                "High Urgency or Coercive Pressure",
                "MEDIUM",
                "Creating artificial urgency (e.g. 'immediately', 'within 24 hours') impairs critical thinking and prevents the victim from verifying independently.",
                re.compile(
                    r"\b(?:immediately|urgent|urgently|act\s+now|without\s+delay|final\s+warning|last\s+notice|final\s+notice|strictly\s+within|within\s+(?:24|12|48|1|2|5)\s*(?:hours|hrs|mins|minutes)|expires\s+today)\b",
                    re.IGNORECASE
                )
            ),
            (
                "advance_fee_payment",
                "Financial Fraud",
                "Upfront Fee or Advance Payment Demand",
                "HIGH",
                "Advance-fee fraud requires the target to pay a 'small' fee (registration, processing, customs, or courier) to unlock a much larger fictitious payoff.",
                re.compile(
                    r"\b(?:pay|deposit|transfer|send)\b.*?\b(?:fee|charge|deposit|advance|registration\s+fee|processing\s+fee|clearance\s+fee|courier\s+fee|handling\s+charge|small\s+fee)\b"
                    r"|\b(?:registration\s+fee|processing\s+fee|upfront\s+payment|advance\s+payment|advance\s+fee|small\s+deposit|initial\s+deposit|deposit\s+required)\b",
                    re.IGNORECASE | re.DOTALL
                )
            ),
            (
                "prize_lottery_claim",
                "Reward & Lottery Scams",
                "Unsolicited Prize, Lottery, or Reward Claim",
                "HIGH",
                "Claims that you have won a lottery, sweepstakes, or high-value gift card you never entered are standard phishing bait.",
                re.compile(
                    r"\b(?:congratulations|congrats)\b.*?\b(?:won|winner|claim|reward|prize|lottery|jackpot|gift\s*card)\b"
                    r"|\b(?:selected\s+as\s+(?:the\s+)?winner|claim\s+your\s+(?:prize|reward|gift\s*card|bonus)|you\s+have\s+won|won\s+\$?\d+[\d,]*)\b",
                    re.IGNORECASE | re.DOTALL
                )
            ),
            (
                "job_recruitment_fraud",
                "Employment Fraud",
                "High-Yield Part-Time Job or Work-From-Home Scam",
                "HIGH",
                "Scammers promise unrealistic daily earnings for minimal tasks (rating products, YouTube likes) and subsequently demand fees to 'upgrade tiers'.",
                re.compile(
                    r"\b(?:work\s+from\s+home|part[- ]time\s+job|daily\s+income|earn\s+\$?\d+[\d,]*\s*(?:daily|per\s+day))\b"
                    r"|\b(?:simple\s+task|youtube\s+like|telegram\s+task|daily\s+payout|no\s+experience\s+needed.*earn)\b",
                    re.IGNORECASE | re.DOTALL
                )
            ),
            (
                "suspicious_link",
                "Technical Indicators",
                "Suspicious URL or Obfuscated Link",
                "HIGH",
                "Obfuscated URLs, link shorteners, or atypical top-level domains disguise malicious phishing destinations.",
                re.compile(
                    r"(?:https?://)?(?:bit\.ly|tinyurl\.com|is\.gd|cutt\.ly|t\.co|ow\.ly|rb\.gy)/[a-zA-Z0-9_\-]+"
                    r"|https?://\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?"
                    r"|https?://[a-zA-Z0-9\-.]+\.(?:xyz|top|buzz|club|work|cam|racing|surf|icu|sbs)(?:/[^\s]*)?",
                    re.IGNORECASE
                )
            ),
            (
                "impersonation_delivery_authority",
                "Impersonation",
                "Delivery Failure or Law Enforcement Impersonation",
                "HIGH",
                "Impersonating courier services (postal, FedEx, DHL) claiming an address issue, or law enforcement threatening action, is a widespread tactic to steal card details.",
                re.compile(
                    r"\b(?:package|parcel|delivery|shipment)\b.*?\b(?:failed|undelivered|address\s+missing|redelivery|reschedule|update\s+address)\b"
                    r"|\b(?:customs\s+clearance|law\s+enforcement|irs\s+notice|arrest\s+warrant|police\s+department)\b",
                    re.IGNORECASE | re.DOTALL
                )
            )
        ]

    def analyze(self, text: str) -> List[ScamIndicator]:
        """
        Evaluate text against rule sets and return detected scam indicators.
        """
        detected: List[ScamIndicator] = []
        clean_text = text.strip()

        for rule_id, category, name, severity, explanation, pattern in self.rules:
            match = pattern.search(clean_text)
            if match:
                matched_span = match.group(0)
                # Trim matched snippet for clean display
                if len(matched_span) > 80:
                    matched_span = matched_span[:77] + "..."

                detected.append(
                    ScamIndicator(
                        id=rule_id,
                        category=category,
                        name=name,
                        severity=severity,
                        explanation=explanation,
                        matched_text=matched_span
                    )
                )

        return detected


# Default singleton instance
rule_engine = ScamRuleEngine()
