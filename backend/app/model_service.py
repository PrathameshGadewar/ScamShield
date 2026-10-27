import os
import logging
from pathlib import Path
from typing import Tuple, Optional, Dict, Any
import torch

logger = logging.getLogger("scamshield.model")


class ModelService:
    """
    Manages loading and inference for the fine-tuned DistilBERT text classification model.
    Loads once at startup, supports CPU & CUDA, verifies label mappings,
    and provides safe prediction inference.
    """

    REQUIRED_FILES = [
        "config.json",
        "tokenizer.json",
        "tokenizer_config.json"
    ]

    def __init__(self, model_dir: Optional[str] = None):
        self.model_dir = self._resolve_model_path(model_dir)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tokenizer = None
        self.model = None
        self.is_loaded = False
        self.error_message: Optional[str] = None
        self.spam_label_idx: int = 1
        self.label_mapping: Dict[str, str] = {"0": "HAM", "1": "SPAM"}

    def _resolve_model_path(self, custom_path: Optional[str]) -> Path:
        """
        Robustly resolves the model directory using pathlib.
        Checks custom path, environment variable, or default relative paths.
        """
        if custom_path:
            return Path(custom_path).resolve()

        env_path = os.getenv("MODEL_PATH")
        if env_path:
            return Path(env_path).resolve()

        # Default standard location: backend/model/final_model
        # Current file is in backend/app/model_service.py -> parent.parent is backend/
        backend_dir = Path(__file__).resolve().parent.parent
        default_path = backend_dir / "model" / "final_model"
        if default_path.exists():
            return default_path

        # Secondary fallback: backend/model/ScamShield_model
        fallback_path = backend_dir / "model" / "ScamShield_model"
        if fallback_path.exists():
            return fallback_path

        return default_path

    def load_model(self) -> bool:
        """
        Loads the Hugging Face tokenizer and DistilBERT model.
        Returns True if successful, False otherwise.
        """
        logger.info(f"Attempting to load model from: {self.model_dir}")

        if not self.model_dir.exists():
            self.error_message = (
                f"Model directory not found at '{self.model_dir}'. "
                "Please extract 'ScamShield_model.zip' into 'backend/model/final_model/'."
            )
            logger.error(self.error_message)
            self.is_loaded = False
            return False

        # Verify required files exist
        missing = [f for f in self.REQUIRED_FILES if not (self.model_dir / f).exists()]
        weight_exists = (
            (self.model_dir / "model.safetensors").exists()
            or (self.model_dir / "pytorch_model.bin").exists()
        )
        if not weight_exists:
            missing.append("model.safetensors or pytorch_model.bin")

        if missing:
            self.error_message = (
                f"Model files missing in '{self.model_dir}': {', '.join(missing)}. "
                "Please verify model extraction."
            )
            logger.error(self.error_message)
            self.is_loaded = False
            return False

        try:
            from transformers import AutoTokenizer, AutoModelForSequenceClassification

            logger.info("Loading AutoTokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(str(self.model_dir))

            logger.info("Loading AutoModelForSequenceClassification...")
            self.model = AutoModelForSequenceClassification.from_pretrained(str(self.model_dir))
            self.model.to(self.device)
            self.model.eval()

            # Determine label mapping
            # Typically 0 = ham, 1 = spam
            raw_id2label = getattr(self.model.config, "id2label", None)
            if raw_id2label:
                # Check if labels contain spam/ham keywords
                found_spam_idx = None
                for idx, name in raw_id2label.items():
                    name_lower = str(name).lower()
                    if "spam" in name_lower or "fraud" in name_lower:
                        found_spam_idx = int(idx)
                        break
                if found_spam_idx is not None:
                    self.spam_label_idx = found_spam_idx
                else:
                    # Default: LABEL_1 is spam
                    self.spam_label_idx = 1
                self.label_mapping = {str(k): str(v) for k, v in raw_id2label.items()}
            else:
                self.spam_label_idx = 1
                self.label_mapping = {"0": "LABEL_0 (HAM)", "1": "LABEL_1 (SPAM)"}

            self.is_loaded = True
            self.error_message = None
            logger.info(f"Model successfully loaded on {self.device}. Spam index: {self.spam_label_idx}")
            return True

        except Exception as e:
            self.error_message = f"Failed to load model: {str(e)}"
            logger.exception(self.error_message)
            self.is_loaded = False
            return False

    def predict(self, text: str) -> Tuple[float, str]:
        """
        Runs inference on the provided text.
        Returns:
            (model_spam_probability, model_prediction)
        """
        if not self.is_loaded or self.model is None or self.tokenizer is None:
            detail = f"Model is not loaded. {self.error_message}" if self.error_message else "Model is not loaded."
            raise RuntimeError(detail)

        with torch.no_grad():
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=False
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1).squeeze()

            if probs.dim() == 0:
                # Handle single scalar edge-case
                spam_prob = float(probs.item())
            else:
                spam_prob = float(probs[self.spam_label_idx].item())

            # Clamp safely between 0.0 and 1.0
            spam_prob = max(0.0, min(1.0, spam_prob))
            prediction = "SPAM" if spam_prob >= 0.5 else "HAM"

            return spam_prob, prediction


# Global singleton instance
model_service = ModelService()
