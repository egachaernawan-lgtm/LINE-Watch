"""Upload reports to Google Drive.

The HTML is converted into a native Google Doc (links stay clickable); the PDF is uploaded as is.
The target folder should live in a Shared Drive: service accounts have no storage quota of their
own, so binary uploads to a normal "My Drive" folder are rejected.
"""

import asyncio
import io
from dataclasses import dataclass

from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

from app.core.config import get_settings
from app.services.google_auth import service_account_credentials


@dataclass
class DriveFile:
    file_id: str
    url: str


def _upload(name: str, data: bytes, mimetype: str, convert_to_doc: bool) -> DriveFile:
    folder = get_settings().drive_reports_folder_id
    drive = build("drive", "v3", credentials=service_account_credentials(), cache_discovery=False)
    body = {"name": name, "parents": [folder]}
    if convert_to_doc:
        body["mimeType"] = "application/vnd.google-apps.document"
    created = (
        drive.files()
        .create(
            body=body,
            media_body=MediaIoBaseUpload(io.BytesIO(data), mimetype=mimetype, resumable=False),
            fields="id, webViewLink",
            supportsAllDrives=True,
        )
        .execute()
    )
    return DriveFile(created["id"], created["webViewLink"])


async def upload_doc_from_html(name: str, html: str) -> DriveFile:
    return await asyncio.to_thread(_upload, name, html.encode("utf-8"), "text/html", True)


async def upload_pdf(name: str, pdf: bytes) -> DriveFile:
    return await asyncio.to_thread(_upload, name, pdf, "application/pdf", False)


def drive_configured() -> bool:
    s = get_settings()
    return bool(s.drive_reports_folder_id and s.google_service_account_json)
