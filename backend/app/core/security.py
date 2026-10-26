"""Authentication.

* Users: the Next.js server verifies Google Login + the email allow-list, then calls this API
  with a short-lived HS256 JWT (``sub`` = email) signed with BACKEND_JWT_SECRET. The allow-list
  is enforced again here, so the API is safe even if called directly.
* Cloud Scheduler: /internal/* accepts a Google-signed OIDC token for the scheduler service
  account (or INTERNAL_API_KEY for local testing).
"""

from dataclasses import dataclass

import jwt
from fastapi import Depends, Header, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.core.config import Settings, get_settings


@dataclass
class CurrentUser:
    email: str
    is_admin: bool = False


def _email_allowed(email: str, settings: Settings) -> bool:
    return email.lower() in {e.lower() for e in settings.allowed_emails}


async def get_current_user(
    authorization: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> CurrentUser:
    if settings.auth_disabled and settings.env == "local":
        return CurrentUser(email="dev@local", is_admin=True)
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        claims = jwt.decode(token, settings.backend_jwt_secret, algorithms=["HS256"], options={"require": ["exp", "sub"]})
    except jwt.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token") from exc
    email = str(claims["sub"])
    if not _email_allowed(email, settings):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Email not allowed")
    is_admin = email.lower() in {e.lower() for e in settings.admin_emails}
    return CurrentUser(email=email, is_admin=is_admin)


async def require_admin(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if not user.is_admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin only")
    return user


async def verify_scheduler(
    authorization: str | None = Header(default=None),
    x_internal_key: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> None:
    if settings.internal_api_key and x_internal_key == settings.internal_api_key:
        return
    if not settings.scheduler_audience:
        if settings.env == "local":
            return
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Scheduler auth not configured")
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing token")
    try:
        claims = id_token.verify_oauth2_token(
            authorization.split(" ", 1)[1], google_requests.Request(), audience=settings.scheduler_audience
        )
    except ValueError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid OIDC token") from exc
    if settings.scheduler_service_account and claims.get("email") != settings.scheduler_service_account:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Unexpected caller")
