from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.schemas.library import Library
from app.services.library import build_library

router = APIRouter(prefix="/library", tags=["library"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=Library)
async def get_library(session: AsyncSession = Depends(get_session)) -> Library:
    """Topics (Business, Tech, Service, Leadership, Competitor, Industry) with their keywords and article counts."""
    return await build_library(session)
