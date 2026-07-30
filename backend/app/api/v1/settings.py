import os
from pathlib import Path
from fastapi import APIRouter
from typing import Dict

router = APIRouter()

# Path to the .env file in the backend root
ENV_PATH = Path(".env")

@router.get("/keys")
async def get_keys():
    """Returns masked API keys currently set in the environment."""
    keys = ["GROQ_API_KEY", "GOOGLE_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    masked_keys = {}
    for k in keys:
        val = os.environ.get(k, "")
        if val:
            # Mask the value for frontend display (e.g. gsk_***123)
            if len(val) > 8:
                masked_keys[k] = val[:4] + "***" + val[-3:]
            else:
                masked_keys[k] = "***"
    return masked_keys

@router.post("/keys")
async def update_keys(payload: Dict[str, str]):
    """Receives non-empty keys and updates the .env file and process environment."""
    lines = []
    if ENV_PATH.exists():
        lines = ENV_PATH.read_text(encoding="utf-8").splitlines()
    
    # Parse existing .env safely
    env_vars = {}
    for line in lines:
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            env_vars[k.strip()] = v.strip()
            
    # Only update keys that actually have new values (not empty and not masked)
    for k, v in payload.items():
        v = str(v).strip()
        if v and "***" not in v:
            env_vars[k] = v
            os.environ[k] = v
            
    # Write back all variables to .env
    new_lines = []
    for k, v in env_vars.items():
        new_lines.append(f"{k}={v}")
        
    ENV_PATH.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
    return {"status": "success", "message": "API keys updated successfully in .env"}
