import asyncio
import base64

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Attachment, Disposition, FileContent, FileName, FileType, Mail

from app.core.config import get_settings


def email_configured() -> bool:
    s = get_settings()
    return bool(s.sendgrid_api_key and s.email_from and s.report_recipients)


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
