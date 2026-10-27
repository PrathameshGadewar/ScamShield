# Model Weights Directory

This directory holds the fine-tuned DistilBERT model files:
- `config.json` (Tracked in Git)
- `tokenizer.json` (Tracked in Git)
- `tokenizer_config.json` (Tracked in Git)
- `model.safetensors` (Excluded from Git due to GitHub 100MB file limit)
- `training_args.bin` (Excluded from Git)

## Placing Weights
Extract `ScamShield_model.zip` so that `model.safetensors` is placed directly into this directory:
`backend/model/final_model/model.safetensors`
