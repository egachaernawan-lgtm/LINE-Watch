from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.core.config import get_settings

_env = Environment(
    loader=FileSystemLoader(Path(__file__).parent / "templates"),
    autoescape=select_autoescape(["html"]),
)


def _localtime(value: datetime, tz: str) -> str:
    return value.astimezone(ZoneInfo(tz)).strftime("%d %b %Y %H:%M")


_env.filters["localtime"] = _localtime


def render_html(template: str, **context) -> str:
    return _env.get_template(template).render(tz=get_settings().timezone, **context)


def html_to_pdf(html: str) -> bytes:
    # Imported lazily: WeasyPrint needs native Pango/Cairo libraries (present in the Docker image).
    from weasyprint import HTML

    return HTML(string=html).write_pdf()
