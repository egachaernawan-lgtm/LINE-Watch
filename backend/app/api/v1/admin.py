from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import CurrentUser, get_current_user, require_admin
from app.models import Keyword, Source
from app.schemas.article import KeywordIn, KeywordOut, SourceOut

router = APIRouter(tags=["admin"])


@router.get("/me")
async def me(user: CurrentUser = Depends(get_current_user)) -> dict:
    return {"email": user.email, "is_admin": user.is_admin}


@router.get("/keywords", response_model=list[KeywordOut], dependencies=[Depends(get_current_user)])
async def list_keywords(session: AsyncSession = Depends(get_session)):
    return list(await session.scalars(select(Keyword).order_by(Keyword.category, Keyword.term)))


@router.post("/keywords", response_model=KeywordOut, dependencies=[Depends(require_admin)])
async def add_keyword(body: KeywordIn, session: AsyncSession = Depends(get_session)):
    keyword = Keyword(**body.model_dump())
    session.add(keyword)
    await session.commit()
    return keyword


@router.patch("/keywords/{keyword_id}/active", response_model=KeywordOut, dependencies=[Depends(require_admin)])
async def toggle_keyword(keyword_id: int, is_active: bool, session: AsyncSession = Depends(get_session)):
    keyword = await session.get(Keyword, keyword_id)
    if keyword is None:
        raise HTTPException(404, "Keyword not found")
    keyword.is_active = is_active
    await session.commit()
    return keyword


@router.get("/sources", response_model=list[SourceOut], dependencies=[Depends(get_current_user)])
async def list_sources(session: AsyncSession = Depends(get_session)):
    return list(await session.scalars(select(Source).order_by(Source.media_name)))
