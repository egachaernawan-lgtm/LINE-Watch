import json
import os

from google.oauth2 import service_account

from app.core.config import get_settings

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def service_account_credentials():
    """GOOGLE_SERVICE_ACCOUNT_JSON may be a file path or the raw JSON string."""
    raw = get_settings().google_service_account_json
    if not raw:
        raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON is not set")
    if os.path.exists(raw):
        return service_account.Credentials.from_service_account_file(raw, scopes=SCOPES)
    return service_account.Credentials.from_service_account_info(json.loads(raw), scopes=SCOPES)
