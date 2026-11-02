import asyncio
import base64

import httpx
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Attachment, Disposition, FileContent, FileName, FileType, Mail

from app.core.config import get_settings

SENDGRID_SEND_URL = "https://api.sendgrid.com/v3/mail/send"
PERSONALIZATIONS_PER_REQUEST = 1000  # SendGrid's limit per call


def email_configured() -> bool:
    s = get_settings()
    return bool(s.sendgrid_api_key and s.email_from and s.report_recipients)


def sending_configured() -> bool:
    s = get_settings()
    return bool(s.sendgrid_api_key and s.email_from)


def _send(subject: str, html: str, pdf: bytes | None, pdf_name: str) -> int:
    s = get_settings()
    message = Mail(from_email=s.email_from, to_emails=s.report_recipients, subject=subject, html_content=html)
    if pdf:
        message.attachment = Attachment(
            FileContent(base64.b64encode(pdf).decode()), FileName(pdf_name), FileType("application/pdf"),
            Disposition("attachment"),
        )
    response = SendGridAPIClient(s.sendgrid_api_key).send(message)
    return response.status_code


async def send_report_email(*, subject: str, html: str, pdf: bytes | None = None, pdf_name: str = "report.pdf") -> int:
    return await asyncio.to_thread(_send, subject, html, pdf, pdf_name)


async def send_html_to(recipients: list[str], *, subject: str, html: str) -> None:
    """One message per recipient: nobody sees the other addresses. Raises on any SendGrid error."""
    s = get_settings()
    async with httpx.AsyncClient(timeout=30) as client:
        for i in range(0, len(recipients), PERSONALIZATIONS_PER_REQUEST):
            chunk = recipients[i : i + PERSONALIZATIONS_PER_REQUEST]
            resp = await client.post(
                SENDGRID_SEND_URL,
                headers={"Authorization": f"Bearer {s.sendgrid_api_key}"},
                json={
                    "personalizations": [{"to": [{"email": e}]} for e in chunk],
                    "from": {"email": s.email_from},
                    "subject": subject,
                    "content": [{"type": "text/html", "value": html}],
                },
            )
            if resp.status_code >= 300:
                raise RuntimeError(f"SendGrid {resp.status_code}: {resp.text[:200]}")
