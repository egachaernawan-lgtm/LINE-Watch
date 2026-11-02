from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_admin
from app.models import Recipient, RecipientGroup
from app.schemas.email import GroupIn, GroupOut

router = APIRouter(prefix="/recipient-groups", tags=["recipients"])


def _out(group: RecipientGroup) -> GroupOut:
    return GroupOut(id=group.id, name=group.name, description=group.description, emails=[m.email for m in group.members])


async def _get(session: AsyncSession, group_id: int) -> RecipientGroup:
    group = await session.get(RecipientGroup, group_id)
    if group is None:
        raise HTTPException(404, "Group not found")
    return group


@router.get("", response_model=list[GroupOut], dependencies=[Depends(get_current_user)])
async def list_groups(session: AsyncSession = Depends(get_session)):
    groups = await session.scalars(select(RecipientGroup).order_by(RecipientGroup.name))
    return [_out(g) for g in groups]


@router.post("", response_model=GroupOut, status_code=201, dependencies=[Depends(require_admin)])
async def create_group(body: GroupIn, session: AsyncSession = Depends(get_session)):
    group = RecipientGroup(name=body.name, description=body.description, members=[Recipient(email=e) for e in body.emails])
    session.add(group)
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(409, "A group with this name already exists") from exc
    return _out(group)


@router.put("/{group_id}", response_model=GroupOut, dependencies=[Depends(require_admin)])
async def update_group(group_id: int, body: GroupIn, session: AsyncSession = Depends(get_session)):
    group = await _get(session, group_id)
    group.name, group.description = body.name, body.description
    group.members = [Recipient(email=e) for e in body.emails]  # replaces the whole list
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(409, "A group with this name already exists") from exc
    return _out(group)


@router.delete("/{group_id}", status_code=204, dependencies=[Depends(require_admin)])
async def delete_group(group_id: int, session: AsyncSession = Depends(get_session)) -> Response:
    await session.delete(await _get(session, group_id))
    await session.commit()
    return Response(status_code=204)
