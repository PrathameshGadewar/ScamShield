# ScamShield AI
### Intelligent Scam Detection & Conversation Risk Analysis
*Powered by Fine-Tuned DistilBERT and Behavioral Heuristic Rule Engine*

> **Academic Project**: CSE472 — Deep Learning for Natural Language Processing (5th Semester B.Tech)  
> **Tagline**: *"Detect the deception. Protect your digital life."*

---

## 1. Overview & Architecture

**ScamShield AI** is a production-style cybersecurity web application engineered to analyze text messages, emails, and conversational prompts for deceptive intent, social engineering tactics, and phishing patterns.

Rather than relying purely on statistical classification (which has critical blind spots on modern targeted threats) or brittle regex rules alone, ScamShield AI implements an **explainable hybrid threat detection engine**:

```
                                  ┌────────────────────────────────────────┐
                                  │           Input Message Text           │
                                  └──────────────────┬─────────────────────┘
                                                     │
                          ┌──────────────────────────┴──────────────────────────┐
                          ▼                                                     ▼
        ┌───────────────────────────────────┐                 ┌───────────────────────────────────┐
        │       Fine-Tuned DistilBERT       │                 │       Heuristic Threat Rules      │
        │    Sequence Classifier (PyTorch)  │                 │    8 Behavioral Pattern Sets      │
        └─────────────────┬─────────────────┘                 └─────────────────┬─────────────────┘
                          │                                                     │
                          ▼                                                     ▼
                Spam Probability p ∈ [0, 1]                            Detected Indicators
                          │                                                     │
                          └──────────────────────────┬──────────────────────────┘
                                                     │
                                                     ▼
                                      ┌─────────────────────────────┐
                                      │   Hybrid Decision Engine    │
                                      │  p ≥ 0.50 OR len(Rules) > 0 │
                                      └──────────────┬──────────────┘
                                                     │
                                                     ▼
                                      ┌─────────────────────────────┐
                                      │    Final System Verdict:    │
                                      │         SUSPICIOUS          │
                                      │             or              │
                                      │ NO STRONG INDICATORS DETECTED│
                                      └─────────────────────────────┘
```

### Key Technical Characteristics
- **Machine Learning Core**: DistilBERT sequence classification model (`distilbert-base-uncased`, 6 layers, 12 attention heads, 768 hidden dimension, 66M parameters) fine-tuned for spam/scam detection.
- **Rule-Based Engine**: 8 modular pattern sets detecting high-severity vectors:
  1. *OTP & Credential Solicitation* (e.g. 2FA interception, PIN requests)
  2. *Account Suspension & Restriction Threats* (e.g. urgent KYC closure)
  3. *Artificial Urgency & Coercion* (e.g. "within 24 hours", "act now")
  4. *Advance-Fee & Upfront Processing Demands* (e.g. registration fees)
  5. *Unsolicited Prize & Lottery Claims* (e.g. Walmart/Amazon reward traps)
  6. *Employment & Task Scams* (e.g. Telegram video rating gigs)
  7. *Obfuscated URLs & Suspicious TLDs* (e.g. bit.ly, raw IPs, .xyz)
  8. *Impersonation of Authorities & Couriers* (e.g. postal redelivery fees)
- **Local Persistence**: SQLite database (`scamshield.db`) stores analysis logs, risk scores, and telemetry metrics locally without external third-party transmission.
- **Privacy First**: All model inference runs on your local machine using PyTorch and Hugging Face Transformers.

---

## 2. Project Directory Structure

```
ScamShield AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Backend package marker
│   │   ├── main.py               # FastAPI application, CORS, routers, lifespan
│   │   ├── model_service.py      # DistilBERT loader, PyTorch inference, label mapping
│   │   ├── rules.py              # 8 modular regex & heuristic pattern sets
│   │   ├── schemas.py            # Pydantic request & response validation schemas
│   │   └── history.py            # SQLite database store & analytics aggregation
│   ├── model/
│   │   └── final_model/          # Extracted trained model directory
│   │       ├── config.json
│   │       ├── model.safetensors
│   │       ├── tokenizer.json
│   │       ├── tokenizer_config.json
│   │       └── training_args.bin
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_api.py           # Endpoint integration & model validation tests
│   │   └── test_rules.py         # Heuristic pattern unit tests
│   ├── scamshield.db             # Local SQLite database (auto-generated)
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Backend environment template
│   └── .env                      # Local backend configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navigation, live health status, theme toggle
│   │   │   ├── Footer.tsx        # Disclaimers and metadata
│   │   │   ├── ProbabilityGauge.tsx  # Visual percentage meter with accessible labels
│   │   │   ├── IndicatorBadge.tsx    # Severity badges with matched excerpt tags
│   │   │   ├── ResultsCard.tsx       # Full report breakdown with safety actions
│   │   │   └── SamplePrompts.tsx     # One-click test scenarios
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx       # Hero, live sandbox, feature cards
│   │   │   ├── AnalyzerPage.tsx      # Main analysis workspace with clipboard paste
│   │   │   ├── DashboardPage.tsx     # Telemetry KPI cards and top indicators
│   │   │   ├── HistoryPage.tsx       # SQLite history browser, search & export
│   │   │   ├── AwarenessCenterPage.tsx # 7 educational modules with red flags
│   │   │   └── AboutModelPage.tsx    # Neural architecture, dataset & boundaries
│   │   ├── services/
│   │   │   └── api.ts            # Typed HTTP client connecting to FastAPI
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx               # Root component, theme state, routing
│   │   ├── main.tsx              # React DOM mounting
│   │   └── index.css             # Tailwind CSS styles and theme variables
│   ├── public/
│   │   └── favicon.svg           # Brand shield icon
│   ├── index.html                # App entrypoint
│   ├── vite.config.ts            # Vite & Tailwind configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── package.json              # Frontend npm dependencies
│   ├── .env.example              # Frontend environment template
│   └── .env                      # Local frontend configuration
├── .gitignore                    # Git exclusions (weights, databases, node_modules)
├── .env.example                  # Root environment template
└── README.md                     # Comprehensive documentation
```

---

## 3. Prerequisites

Before running ScamShield AI, ensure you have:

- **Windows 10/11** (or macOS/Linux)
- **Python 3.10+** (Tested on Python 3.13)
- **Node.js 18+** (Tested on Node v24.19 / npm 11)
- **Trained DistilBERT model weights** (placed into `backend/model/final_model/`)

---

## 4. Model Setup Instructions

The application loads the fine-tuned DistilBERT model directly from:
```
backend/model/final_model/
```

### Verifying Extracted Files
Ensure this folder contains the following 5 files directly:
- `config.json`
- `model.safetensors` (or `pytorch_model.bin`)
- `tokenizer.json`
- `tokenizer_config.json`
- `training_args.bin`

If you have downloaded `ScamShield_model.zip`, extract it so the files reside in `backend/model/final_model/`:
```powershell
# In Windows PowerShell:
Expand-Archive -Path "backend\model\ScamShield_model.zip" -DestinationPath "backend\model\final_model" -Force
```

> **Note**: The backend resolves this path robustly using Python's `pathlib`. You can also set a custom path using the `MODEL_PATH` variable in `backend/.env`.

---

## 5. Step-by-Step Local Setup

We recommend opening **two separate Windows PowerShell terminals**: one for the backend and one for the frontend.

### Terminal 1: Backend Setup (FastAPI & PyTorch)

1. **Navigate to the project root**:
   ```powershell
   cd "d:\B. Tech\5th Sem\CSE472  DEEP LEARNING FOR NATURAL LANGUAGE PROCESSING\ScamShield AI"
   ```

2. **(Optional) Create and activate a virtual environment**:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

3. **Install Python backend dependencies**:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```

4. **Verify backend environment configuration**:
   Ensure `backend/.env` exists (copied from `backend/.env.example`):
   ```env
   MODEL_PATH=backend/model/final_model
   HOST=127.0.0.1
   PORT=8000
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
   ```

5. **Start the FastAPI backend with Uvicorn**:
   ```powershell
   cd backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *Expected console output:*
   ```text
   INFO:     scamshield.api: Starting ScamShield AI backend service...
   INFO:     scamshield.model: Loading AutoTokenizer...
   INFO:     scamshield.model: Loading AutoModelForSequenceClassification...
   INFO:     scamshield.model: Model successfully loaded on cpu. Spam index: 1
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://127.0.0.1:8000
   ```

---

### Terminal 2: Frontend Setup (React & Vite)

1. **Open a second PowerShell terminal and navigate to the frontend folder**:
   ```powershell
   cd "d:\B. Tech\5th Sem\CSE472  DEEP LEARNING FOR NATURAL LANGUAGE PROCESSING\ScamShield AI\frontend"
   ```

2. **Install Node dependencies**:
   ```powershell
   npm.cmd install
   ```

3. **Verify frontend environment configuration**:
   Ensure `frontend/.env` exists (copied from `frontend/.env.example`):
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

4. **Start the Vite development server**:
   ```powershell
   npm.cmd run dev
   ```
   *Expected console output:*
   ```text
     VITE v8.3.5  ready in 180 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
   ```

5. **Open your browser and navigate to**:
   ```
   http://localhost:5173
   ```

---

## 6. Testing the API Directly

You can verify the backend endpoints independently using PowerShell or `curl`:

### Health Check (`GET /health`)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" | ConvertTo-Json
```
*Response:*
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu",
  "model_name": "distilbert-base-uncased (fine-tuned)",
  "label_mapping": { "0": "LABEL_0", "1": "LABEL_1" },
  "message": "Model is loaded and ready for inference."
}
```

### Analyze an OTP Scam Message (`POST /api/analyze`)
```powershell
$body = @{ message = "Send me your OTP immediately or your bank account will be blocked." } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/analyze" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5
```
*Response highlights:*
```json
{
  "model_spam_probability": 0.0088,
  "model_prediction": "HAM",
  "detected_indicators": [
    { "id": "otp_credential_theft", "name": "OTP or Authentication Code Request", "severity": "HIGH" },
    { "id": "account_suspension_threat", "name": "Account Suspension or Restriction Threat", "severity": "HIGH" },
    { "id": "urgency_pressure", "name": "High Urgency or Coercive Pressure", "severity": "MEDIUM" }
  ],
  "final_verdict": "SUSPICIOUS",
  "assessment": "Elevated Risk: The DistilBERT model assigned a lower statistical score (0.9%), but 3 high-priority heuristic scam indicators were triggered..."
}
```

### View Telemetry Metrics (`GET /api/stats`)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/stats" | ConvertTo-Json -Depth 5
```

---

## 7. Running the Automated Test Suite

Automated tests are located in `backend/tests/` and cover:
- OTP credential interception and coercive threat matching
- Advance-fee and fake prize/lottery scams
- Benign message evaluation
- Blank and whitespace message validation errors (HTTP 422)
- Graceful model-failure handling (refuses to serve fake predictions)
- SQLite history and stats persistence

To execute the test suite:
```powershell
cd backend
python -m pytest tests/ -v
```

*Expected output:*
```text
============================= test session starts =============================
platform win32 -- Python 3.13.15, pytest-9.1.1, pluggy-1.7.0
collected 13 items

tests/test_api.py::test_root_endpoint PASSED                            [  7%]
tests/test_api.py::test_health_endpoint PASSED                          [ 15%]
tests/test_api.py::test_analyze_otp_scam PASSED                         [ 23%]
tests/test_api.py::test_analyze_prize_scam PASSED                       [ 30%]
tests/test_api.py::test_analyze_ordinary_message PASSED                 [ 38%]
tests/test_api.py::test_analyze_invalid_empty_input PASSED             [ 46%]
tests/test_api.py::test_history_and_stats PASSED                        [ 53%]
tests/test_api.py::test_model_failure_handling PASSED                   [ 61%]
tests/test_rules.py::test_otp_credential_theft_detected PASSED         [ 69%]
tests/test_rules.py::test_prize_scam_detected PASSED                    [ 76%]
tests/test_rules.py::test_ordinary_benign_message PASSED                [ 84%]
tests/test_rules.py::test_job_recruitment_scam PASSED                  [ 92%]
tests/test_rules.py::test_suspicious_link PASSED                       [100%]

============================= 13 passed in 4.40s ==============================
```

---

## 8. Troubleshooting Guide

### 1. Model Files Missing Error (`503 Service Unavailable`)
- **Symptom**: `/health` returns status `error` or `/api/analyze` returns HTTP 503 stating `Model directory not found`.
- **Solution**: Confirm that `backend/model/final_model/` contains `config.json` and `model.safetensors` directly (not inside another nested sub-folder). Check `backend/.env` for `MODEL_PATH`.

### 2. PowerShell Script Execution Disabled (`UnauthorizedAccess`)
- **Symptom**: `npm : File ... npm.ps1 cannot be loaded because running scripts is disabled on this system.`
- **Solution**: Use `npm.cmd` instead of `npm` in PowerShell:
  ```powershell
  npm.cmd install
  npm.cmd run dev
  ```
  Or temporarily set execution policy for the current session:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

### 3. Port Conflict (`Port 8000 or 5173 is already in use`)
- **Symptom**: `[Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000)`
- **Solution**: Identify and terminate the occupying process, or change the port in `.env`:
  ```powershell
  # Check which process is on port 8000:
  Get-NetTCPConnection -LocalPort 8000
  # Or start on another port:
  python -m uvicorn app.main:app --port 8001
  ```

### 4. CORS Errors in Browser
- **Symptom**: Browser console displays `Cross-Origin Request Blocked`.
- **Solution**: Check `CORS_ORIGINS` in `backend/.env`. Ensure it includes your frontend origin (e.g. `http://localhost:5173,http://127.0.0.1:5173`).

---

## 9. Academic & Scientific Disclosures

1. **Advisory Tool**: ScamShield AI provides probabilistic decision support. An output of "NO STRONG INDICATORS DETECTED" indicates the absence of recognized threat patterns, but cannot guarantee that a communication is safe.
2. **Dataset Scope**: The DistilBERT classifier was trained on the historic UCI SMS Spam Collection. While effective for structural spam representations, modern scams (e.g. multi-step Telegram tasks, QR smishing) rely heavily on our heuristic rule engine to prevent false negatives.
3. **No External API Dependencies**: Unlike systems that outsource classification to proprietary third-party LLMs, ScamShield AI runs entirely locally, preserving privacy and eliminating external API costs.
